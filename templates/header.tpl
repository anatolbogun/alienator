<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>{$title|default:"We Are All Aliens"}</title>
  <base href="/" />
  <script type="text/javascript" src="lodash.min.js"></script>
  <script type="text/javascript" src="gsap.min.js"></script>
  <script type="text/javascript" src="MotionPathPlugin.min.js"></script>
  <script type="text/javascript" src="jquery.min.js"></script>
  <script type="text/javascript" src="jquery.lazy.min.js"></script>
  <script type="text/javascript" src="aliens.js"></script>

  {if $jsModuleFile}
    <script type="text/javascript" src="phaser.min.js"></script>
    <script type="text/javascript" src="phaser-extensions.js"></script>
    <script type="text/javascript" src="tiny-segmenter.js" charset="UTF-8"></script>
    <script type="module" src="{$jsModuleFile}"></script>
  {/if}

  {if $alien.id}
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@soba_ba">
    <meta name="twitter:title" content="Alien {$alien.name}">
    <meta name="twitter:description" content="{$alien.trait1} {$alien.trait2}">
    <meta name="twitter:image" content="{$baseUrl}/aliens/{$alien.id}.png">

    <meta property="og:url" content="{$url}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Alien {$alien.name}">
    <meta property="og:description" content="{$alien.trait1} {$alien.trait2}">
		<meta property="og:image" content="{$baseUrl}/aliens/{$alien.id}facebook.png" />
    <meta property="og:image:type" content="{$imageProperties['mime']}">
    <meta property="og:image:width" content="{$imageProperties[0]}" />
    <meta property="og:image:height" content="{$imageProperties[1]}" />
  {/if}

  <link rel="stylesheet" href="{$cssFile}">
  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width" />

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