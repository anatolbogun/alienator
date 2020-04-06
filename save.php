<?php

// TO DO:
// - Do we want to save an optional email address?

// NOTES:
// - to create database see database-structure.sql
// - to clear all recods and reset auto increment run SQL:
//   SET FOREIGN_KEY_CHECKS = 0;
//   TRUNCATE table aliens;
//   TRUNCATE table eyes;
//   SET FOREIGN_KEY_CHECKS = 1;

$config = parse_ini_file( 'config.ini', true );

$mysql = $config[ 'mysql' ];
$pdo = new PDO('mysql:host=' . $mysql['host'] . ';dbname=' . $mysql['database'], $mysql['user'], $mysql['password']);

$data = [
  'body' => $_POST[ 'body' ],
  'head' => $_POST[ 'head' ],
  'color' => $_POST[ 'color' ],
  'trait1' => $_POST['trait1'],
  'trait2' => $_POST['trait2'],
];

$sql = "INSERT INTO aliens ( utcTimeStamp, uuid, body, head, color, trait1, trait2 ) VALUES ( UTC_TIMESTAMP(), REPLACE(UUID(),'-',''), :body, :head, :color, :trait1, :trait2 )";
$statement = $pdo -> prepare( $sql );
$sqlSuccess = $statement -> execute( $data );

if ( !$sqlSuccess ) {
  $error = $statement->errorInfo() . '\n' . getDebugDumpParamsString( $statement );
  sendResponse( false, null, $error );
}


$eyesData = json_decode( stripslashes( $_POST[ 'eyes' ] ) );

$sql = 'SELECT LAST_INSERT_ID() AS id';
$statement = $pdo -> prepare($sql);
$statement -> execute();
$alienID = $statement -> fetch()[ 'id' ];

foreach ( $eyesData as $eyeData ) {
  $data = [
    'alienID' => $alienID,
    'type' => $eyeData -> index,
    'x' => $eyeData -> x,
    'y' => $eyeData -> y,
  ];

  $sql = 'INSERT INTO eyes ( alienID, type, x, y ) VALUES ( :alienID, :type, :x, :y )';
  $statement = $pdo -> prepare( $sql );
  $sqlSuccess = $statement -> execute( $data );

  if ( !$sqlSuccess ) {
    $error = $statement->errorInfo() . '\n' . getDebugDumpParamsString($statement);
    sendResponse( false, $alienID, $error );
  }
}


$images = [
  $_POST[ 'imageAvatar' ],
  $_POST[ 'image' ],
  $_POST[ 'imageTraits' ],
];

$suffixes = [
  'avatar',
  '',
  'traits',
];

$i = 0;

foreach ( $images as $image ) {
  saveImage( $image, $alienID, $suffixes[ $i ] );
  $i++;
}

sendResponse( true, $alienID );


function saveImage ( $image, $alienID, $suffix = '' ) {
  $image = str_replace( 'data:image/png;base64,', '', $image );
  $image = str_replace( ' ', '+', $image );
  $data = base64_decode( $image );
  $file = $GLOBALS[ 'config' ][ 'userData' ][ 'folder' ] . '/' . $alienID . $suffix . '.png';
  $saveImageSuccess = file_put_contents( $file, $data );

  if ( !$saveImageSuccess ) {
    $error = $saveImageSuccess ? '' : 'image ' . $file . ' could not be saved (' . $saveImageSuccess . ' bytes written).';
    sendResponse( false, $alienID, $error );
  }
}



function getDebugDumpParamsString ( $statement ) {
  ob_start();
  $statement -> debugDumpParams();
  $contents = ob_get_contents();
  ob_end_clean();
  return $contents;
}


function sendResponse ( $success, $alienID, $error = null ) {
  if ( !$success && $alienID ) {
    // if for any reason saving fails we delete the alien from the database in case it has been created
    // note that the MySQL alienID auto increment will not be adjusted and skip this entry
    // eyes will automatically be deleted due to the alienID foreign key constraint and ON DELETE CASCADE
    $data = [
      'id' => $alienID,
    ];
    $sql = 'DELETE FROM aliens WHERE id = :id';
    $statement = $GLOBALS[ 'conn' ] -> prepare( $sql );
    $statement -> execute( $data );
  }

  $response = [
    'success' => $success,
    'alienID' => ( int ) $alienID,
  ];

  if ( $GLOBALS[ 'config' ][ 'program' ][ 'debug' ] && $error ) {
    // send error messages if config debug is true
    $response[ 'error' ] = $error;
  }

  echo json_encode( $response );

  die();
}
?>