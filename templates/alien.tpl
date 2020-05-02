{include file="header.tpl" title="Alien {$alien.name}" cssFile="alien.css" showViewer=true}

{if !$alien.id}

  <main class="info">
    <p>Sorry, we couldn&acute;t find this alien.</p>
    <p>You may find who you&acute;re looking for in our <a href="aliens/">alien registry</a>.</p>
  </main>

{else}

  <main id="alien">
    <h1 class="name"><span class="localized">Alien</span> {$alien.name}</h1>
    <div id="viewer"></div>
    <div class="info">
      <p class="hidden">{$alien.trait1}</p>
      <p class="hidden">{$alien.trait2}</p>
      <p class="fadein"><span class="localized">Joined</span> <time class="utc">{$alien.utcTimeStamp}</time></p>
    </div>
  </main>

{/if}

<footer>
  <a class="logo" href="/"><img class="logo" src="assets/logo.png" /></a>
  <div class="navi">
    <a class="profiles tooltip" href="aliens/"><span>view all aliens</span></a>
  </div>
  <div class="social">
    <a class="twitter tooltip" href="https://twitter.com/intent/tweet?text=Alien%20{$alien.name|escape:'url'}%20%23weareallaliens%20{$url|escape:'url'}%20{$baseUrl|escape:'url'}aliens%2F{$alien.id}.png" data-hashtags="weareallaliens" data-via="soba_ba" data-related="soba_ba"><span>share on Twitter</span></a>
    <a class="facebook tooltip" href="https://www.facebook.com/share.php?u={$url|escape:'url'}"><span>share on Facebook</span></a>
  </div>
</footer>

{include file="footer.tpl"}