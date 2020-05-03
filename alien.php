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

  $fbImagePath = $config[ 'userData' ][ 'folder' ].'/'.$alien[ 'id' ].'facebook.png';

  if ( !file_exists( $fbImagePath ) ) {
    $sourceImagePath = $config[ 'userData' ][ 'folder' ].'/'.$alien[ 'id' ].'avatar.png';
    $sourceImageProperties = getimagesize( $sourceImagePath );
    $targetWidth = 1200; // Facebook target width
    $targetHeight = 630; // Facebook target height
    $targetQuality = -1;
    $fbImage = imagecreatetruecolor( $targetWidth, $targetHeight );
    $white = imagecolorallocate( $fbImage, 255, 255, 255 );
    imagefill( $fbImage, 0, 0, $white);
    $sourceImage = imagecreatefrompng( $sourceImagePath );
    $sourceScaleFactor = $targetHeight / $sourceImageProperties[ 1 ];
    $sourceRescaledWidth = round( $sourceImageProperties[ 0 ] * $sourceScaleFactor );
    $sourceRescaledHeight = $targetHeight;
    $rescaledImage = imagescale( $sourceImage, $sourceRescaledWidth, $sourceRescaledHeight );
    $destinationX = ( $targetWidth - $sourceRescaledWidth ) / 2;
    imagecopyresampled( $fbImage, $rescaledImage, $destinationX, 0, 0, 0, $sourceRescaledWidth, $sourceRescaledHeight, $sourceRescaledWidth, $sourceRescaledHeight );
    imagepng( $fbImage, $config[ 'userData' ][ 'folder' ].'/'.$alien[ 'id' ].'facebook.png', $targetQuality );
  }

  $fbImageProperties = getimagesize( $fbImagePath );

  $smarty -> assign( 'fbImageProperties', $fbImageProperties );
}

// get the current URL and base URL

if ( isset( $_SERVER[ 'HTTPS' ] ) && $_SERVER[ 'HTTPS' ] == 'on' ) {
    $protocol = 'https';
} else {
    $protocol = 'http';
}

$port = ( $_SERVER[ 'SERVER_PORT' ] == '80' ) ? '' : ( ':'.$_SERVER[ 'SERVER_PORT' ] );
$baseUrl = $protocol.'://'.$_SERVER[ 'SERVER_NAME' ].$port;
$url =  $baseUrl.$_SERVER[ 'REQUEST_URI' ];

$smarty->assign( 'baseUrl', $baseUrl );
$smarty->assign( 'url', $url );

$smarty -> display( 'alien.tpl' );
?>