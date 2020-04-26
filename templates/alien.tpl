{include file="header.tpl" title="Alien {$alien.id}" cssFile="alien.css" showViewer=true}

<header>
  <a href="aliens/"><img class="logo" src="assets/logo.png" /></a>
</header>

{if !$alien.id}

  <main class="info">
    <p>Sorry, we couldn&acute;t find this alien.</p>
    <p>You may find who you&acute;re looking for in our <a href="aliens/">alien registry</a>.</p>
  </main>

{else}

  <main id="alien">
    <div id="viewer"></div>
  </main>
  <div class="info">
    <h1 class="name"><span class="localized">Alien</span> {$alien.name}</h1>
    <p class="hidden">{$alien.trait1}</p>
    <p class="hidden">{$alien.trait2}</p>
    <p class="fadein"><span class="localized">Joined</span> <time class="utc">{$alien.utcTimeStamp}</time></p>
  </div>

{/if}


{include file="footer.tpl"}