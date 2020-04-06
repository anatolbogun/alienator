<?php
$config = parse_ini_file('config.ini', true);

$mysql = $config['mysql'];
$pdo = new PDO('mysql:host=' . $mysql['host'] . ';dbname=' . $mysql['database'], $mysql['user'], $mysql['password']);

$sql = 'SELECT * FROM `aliens` ORDER BY `id` DESC';
$aliensData = $pdo->query($sql)->fetchAll();

?>
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Aliens</title>
  <base href="/" />
  <script type="text/javascript" src="gsap.min.js"></script>
  <script type="text/javascript" src="jquery.min.js"></script>
  <link rel="stylesheet" href="aliens.css">
  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />

  <!-- favicons -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#dc424c">
  <meta name="msapplication-TileColor" content="#2b5797">
  <meta name="theme-color" content="#ffffff">
</head>

<body>
  <h1>Aliens</h1>
  <!-- <pre><?php print_r($data) ?></pre> -->
  <?php
  foreach ( $aliensData as $alienData ) {
    echo '<img src="user-images/' . $alienData[ 'id' ] . '.png" />';
  }
  ?>
</body>

</html>