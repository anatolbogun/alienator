<?php

function openConnection () {
  $mysql = parse_ini_file( 'config.ini', true )[ 'mysql' ];
  print_r( $mysql );

  return new PDO( 'mysql:host=' . $mysql[ 'host' ] . ';dbname=' . $mysql[ 'database' ], $mysql[ 'user' ], $mysql[ 'password' ] );
  // $connection = new mysqli( $config[ 'mysql' ][ 'host' ], $config[ 'mysql' ][ 'user' ], $config[ 'mysql' ][ 'password' ], $config[ 'mysql' ][ 'database' ]) or die( 'Connection failed: %s\n' . $connection -> error );
  // return $connection;
}


// function closeConnection ( $connection ) {
//   $connection -> close();
// }

?>