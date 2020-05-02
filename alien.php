<?php
include( 'smarty/Smarty.class.php' );

$smarty = new Smarty;

$config = parse_ini_file( 'config.ini', true );

$mysql = $config[ 'mysql'];
$pdo = new PDO( 'mysql:host=' . $mysql[ 'host' ] . ';dbname=' . $mysql[ 'database' ], $mysql[ 'user' ], $mysql[ 'password' ] );

$sql = 'SELECT COUNT(*) AS count FROM `aliens`';
$numAliens = $pdo -> query( $sql ) -> fetch( PDO::FETCH_LAZY ) -> count;
$smarty -> assign( 'numAliens', $numAliens );

$data = [ 'id' => $_GET[ 'id' ] ];
$sql = 'SELECT * FROM `aliens` WHERE `id` = :id';
$statement = $pdo -> prepare( $sql );
$sqlSuccess = $statement -> execute( $data );
$alien = $statement -> fetch( PDO::FETCH_LAZY );

if ( $statement -> rowCount() ) {
  $smarty -> assign( 'alien', $alien );
}

if ( isset( $_SERVER[ 'HTTPS' ] ) && $_SERVER[ 'HTTPS' ] == 'on' ) {
    $protocol = 'https';
} else {
    $protocol = 'http';
}

$port = ( $_SERVER[ 'SERVER_PORT' ] == '80' ) ? '' : ( ':'.$_SERVER[ 'SERVER_PORT' ] );
$baseUrl = $protocol.'://'.$_SERVER[ 'SERVER_NAME' ].$port;
$url =  $baseUrl.$_SERVER[ 'REQUEST_URI' ];

$smarty->assign( 'baseUrl', $url );
$smarty->assign( 'url', $url );

$smarty -> display( 'alien.tpl' );
?>