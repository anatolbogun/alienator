<?php
include('smarty/Smarty.class.php');

$smarty = new Smarty;

$config = parse_ini_file( 'config.ini', true );

$mysql = $config[ 'mysql' ];
$pdo = new PDO( 'mysql:host=' . $mysql[ 'host' ] . ';dbname=' . $mysql[ 'database' ], $mysql[ 'user' ], $mysql[ 'password' ] );

$sql = 'SELECT COUNT(*) AS count FROM `aliens`';
$numAliens = $pdo -> query( $sql ) -> fetch( PDO::FETCH_LAZY ) -> count;
$smarty -> assign( 'numAliens', $numAliens );

$sql = 'SELECT * FROM `aliens` ORDER BY `id` DESC';
$aliens = $pdo -> query( $sql ) -> fetchAll();

$smarty -> assign( 'aliens', $aliens );

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

$smarty -> display( 'home.tpl' );
?>