<?php

// TO DO:
// - I really also want to save the date/time or timestamp
// - return the alien ID to the ajax request
// - Do we want to save an optional email address?

$config = parse_ini_file( 'config.ini', true );

$mysql = $config[ 'mysql' ];
$conn = new PDO('mysql:host=' . $mysql['host'] . ';dbname=' . $mysql['database'], $mysql['user'], $mysql['password']);

$data = [
  'body' => $_POST[ 'body' ],
  'head' => $_POST[ 'head' ],
  'color' => $_POST[ 'color' ],
  'trait1' => $_POST['trait1'],
  'trait2' => $_POST['trait2'],
];

print_r( $data );

$sql = 'INSERT INTO aliens ( utcTimeStamp, body, head, color, trait1, trait2 ) VALUES ( UTC_TIMESTAMP(), :body, :head, :color, :trait1, :trait2 )';
$statement = $conn -> prepare( $sql );

$statement -> execute( $data );
// echo 'PDO ALIEN: ' . $statement -> debugDumpParams();

$eyesData = json_decode( stripslashes( $_POST[ 'eyes' ] ) );

$sql = 'SELECT LAST_INSERT_ID() AS id';
$statement = $conn->prepare($sql);
$statement -> execute();
$alienID = $statement -> fetch()[ 'id' ];

foreach ( $eyesData as $eyeData ) {
  print_r( $eyeData -> x );

  $data = [
    'alienID' => $alienID,
    'type' => $eyeData -> index,
    'x' => $eyeData -> x,
    'y' => $eyeData -> y,
  ];

  $sql = 'INSERT INTO eyes ( alienID, type, x, y ) VALUES ( :alienID, :type, :x, :y )';
  $statement = $conn -> prepare( $sql );
  $statement -> execute( $data );
  // echo 'PDO EYES: ' . $statement -> debugDumpParams();
}


$image = $_POST[ 'image' ];
$image = str_replace( 'data:image/png;base64,', '', $image );
$image = str_replace( ' ', '+', $image );
$data = base64_decode( $image );
$filename = uniqid();
$file = $config[ 'userData' ][ 'folder' ] . '/' . $filename . '.png';
$success = file_put_contents( $file, $data );
// print $success ? 'Saved image: ' . $file : 'Unable to save the file.';
?>