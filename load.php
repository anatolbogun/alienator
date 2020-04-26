<?php
$config = parse_ini_file( 'config.ini', true );

$mysql = $config[ 'mysql' ];
$pdo = new PDO( 'mysql:host=' . $mysql[ 'host' ] . ';dbname=' . $mysql[ 'database' ], $mysql[ 'user' ], $mysql[ 'password' ]);

$data = [ 'id' => $_POST[ 'id' ] ];

$sql = 'SELECT * FROM `aliens` WHERE `id` = :id';
$statement = $pdo -> prepare( $sql );
$sqlSuccess = $statement -> execute( $data );

if ( !$sqlSuccess ) {
  $error = $statement -> errorInfo() . '\n' . getDebugDumpParamsString( $statement );
  sendResponse( false, $data[ 'id' ], $error );
}

$alien = $statement -> fetch( PDO::FETCH_LAZY );

if ( $statement -> rowCount() ) {
  $data = [ 'alienID' => $alien -> id ];
  // we need to map type to index; the javascript code uses index due to conflicts with type, but in MySQL index is a reserved keyword and cannot be used as a column name
  $sql = 'SELECT `type` AS `index`, `x`, `y` FROM `eyes` WHERE `alienID` = :alienID';
  $statement = $pdo -> prepare( $sql );
  $sqlSuccess = $statement -> execute( $data );

  if (!$sqlSuccess) {
    $error = $statement -> errorInfo() . '\n' . getDebugDumpParamsString( $statement );
    sendResponse( false, $data[ 'id' ], $error );
  }

  $eyes = $statement -> fetchAll();

  $dna = [
    'bodyID' => $alien[ 'body' ],
    'headID' => $alien[ 'head' ],
    'eyes' => $eyes,
    'color' => $alien[ 'color' ],
    'name' => $alien[ 'name' ],
    'trait1' => $alien[ 'trait1' ],
    'trait2' => $alien[ 'trait2' ],
  ];

  sendResponse( true, $dna );
}


function sendResponse( $success, $dna, $error = null ) {
  $response = [
    'success' => $success,
    'dna' => $dna,
  ];

  if ( $GLOBALS[ 'config' ][ 'program' ][ 'debug' ] && $error) {
    // send error messages if config debug is true
    $response[ 'error' ] = $error;
  }

  echo json_encode( $response );

  die();
}

?>