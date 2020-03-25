<?php
include( 'db-connection.php' );

$config = parse_ini_file( 'config.ini', true );

$conn = openConnection();
print_r( $conn );

// $statement = $conn -> prepare( 'INSERT INTO aliens ( body, head, color, trait1, trait2 ) VALUES ( :body, :head, :color, :trait1, :trait2 )' );
// // $statement -> execute( ['name' => $name] );
// $statement -> bindValue( ':body', $_POST[ 'body' ] );
// $statement -> bindValue( ':head', $_POST[ 'head' ] );
// $statement -> bindValue( ':color', $_POST[ 'color' ] );
// $statement -> bindValue( ':trait1', $_POST[ 'trait1' ] );
// $statement -> bindValue( ':trait2', $_POST[ 'trait2' ] );
// $result = $statement -> execute();


// $sql = 'INSERT INTO aliens ( body, head, color, trait1, trait2 ) VALUES ( :body, :head, :color, :trait1, :trait2 )';
// print_r( $_POST );
$data = [
  'body' => $_POST[ 'body' ],
  'head' => $_POST[ 'head' ],
  'color' => $_POST[ 'color' ],
];

print_r( $data );

$sql = 'INSERT INTO aliens ( body, head, color ) VALUES ( :body, :head, :color )';
$statement = $conn -> prepare( $sql );
// print_r( $statement );
$statement -> execute( $data );

$eyesData = json_decode( stripslashes( $_POST[ 'eyes' ] ) );
print_r( $eyesData );

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
  print_r( $statement );
  $statement -> execute( $data );
  echo 'PDO' . $statement -> debugDumpParams();
}

// var_dump( $statement -> errorInf );

// foreach ( $statement as $row ) {
//   print_r( $row );
// }

// if ( $conn -> query( $sql ) === TRUE ) {
//   echo 'New record created successfully';
// } else {
//   echo 'Error: ' . $sql . '<br />' . $conn -> error;
// }


$image = $_POST[ 'image' ];
$image = str_replace( 'data:image/png;base64,', '', $image );
$image = str_replace( ' ', '+', $image );
$data = base64_decode( $image );
$filename = uniqid();
$file = $config[ 'userData' ][ 'folder' ] . '/' . $filename . '.png';
$success = file_put_contents( $file, $data );
print $success ? 'Saved image: ' . $file : 'Unable to save the file.';


// closeConnection( $conn );
?>