{include file="header.tpl" title="Alien {$alien.id}" showViewer=true}

<header>
  <img class="logo" src="assets/logo-white.png" />
  <h1>We Are All Aliens</h1>
</header>

<p class="info"><a href="aliens/">Population: {$numAliens}</a></p>

{if !$alien.id}

  <main class="info">
    <p>Sorry, we couldn&acute;t find this alien.</p>
    <p>You may find who you&acute;re looking for in our <a href="aliens/">alien registry</a>.</p>
  </main>

{else}

  <main>
    <div id="viewer"></div>
    <div class="avatar">
      <img src="/user-images/{$alien.id}avatar.png" />
      <p>This is resident {$alien.id}</p>
    </div>
    <div id="aliens">
      <article id="alien{$alien.id}" class="alien profile">
        <a onClick="toggleTraits({$alien.id})">
          <div>
            {* <img class="image" src="/user-images/{$alien.id}.png" /> *}
            {* <img class="traits" src="/user-images/{$alien.id}traits.png" /> *}
            <img class="image lazy" data-src="{$alien.id}.png" src="assets/blank.png" />
            <img class="traits lazy" data-src="{$alien.id}traits.png" src="assets/blank.png" />
          </div>
        </a>
        <p class="hidden">{$alien.trait1}</p>
        <p class="hidden">{$alien.trait2}</p>
        <p class="info"><span class="localized">Joined</span> <time class="utc">{$alien.utcTimeStamp}</time></p>
      </article>
    </div>
  </main>

{/if}


{include file="footer.tpl"}