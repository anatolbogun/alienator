<?php
$config = parse_ini_file( 'config.ini', true );

$mysql = $config[ 'mysql' ];
$pdo = new PDO( 'mysql:host=' . $mysql[ 'host' ] . ';dbname=' . $mysql[ 'database' ], $mysql[ 'user' ], $mysql[ 'password' ]);

if ( array_key_exists( 'num', $_REQUEST ) ) {
  $data = [ 'num' => $_REQUEST[ 'num' ] ];
  $sql = 'SELECT * FROM `aliens` ORDER BY RAND() LIMIT :num';
} else {
  $data = [];
  $sql = 'SELECT * FROM `aliens` ORDER BY RAND()';
}

$statement = $pdo -> prepare( $sql );
$statement -> bindValue( ':num', intval( trim( $_REQUEST['num'] ) ), PDO::PARAM_INT );
$sqlSuccess = $statement -> execute();

if ( !$sqlSuccess ) {
  $error = $statement -> errorInfo() . '\n' . getDebugDumpParamsString( $statement );
  sendResponse( false, $data[ 'id' ], $error );
}

$aliens = $statement -> fetchAll();
$dnas = [];

if ( $statement -> rowCount() ) {
  foreach ( $aliens as $alien ) {
    $data = [ 'alienID' => $alien[ 'id' ] ];
    // we need to map type to index; the javascript code uses index due to conflicts with type, but in MySQL index is a reserved keyword and cannot be used as a column name
    $sql = 'SELECT `type` AS `index`, `x`, `y` FROM `eyes` WHERE `alienID` = :alienID';
    $statement = $pdo -> prepare( $sql );
    $sqlSuccess = $statement -> execute( $data );

    if (!$sqlSuccess) {
      $error = $statement -> errorInfo() . '\n' . getDebugDumpParamsString( $statement );
      sendResponse( false, $data[ 'id' ], $error );
    }

    $eyes = $statement -> fetchAll( PDO::FETCH_CLASS );

    $dna = [
      'id' => $alien[ 'id' ],
      'bodyID' => $alien[ 'body' ],
      'headID' => $alien[ 'head' ],
      'eyes' => $eyes,
      'color' => $alien[ 'color' ],
      'name' => $alien[ 'name' ],
      'trait1' => $alien[ 'trait1' ],
      'trait2' => $alien[ 'trait2' ],
    ];

    array_push( $dnas, $dna );
  }

  sendResponse( true, $dnas );
}


function sendResponse( $success, $dnas, $error = null ) {
  $response = [
    'success' => $success,
    'dnas' => $dnas,
  ];

  if ( $GLOBALS[ 'config' ][ 'program' ][ 'debug' ] && $error) {
    // send error messages if config debug is true
    $response[ 'error' ] = $error;
  }

  echo json_encode( $response );

  die();
}

?>