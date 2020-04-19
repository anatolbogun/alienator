{include file="header.tpl" title="We Are All Aliens ({$numAliens} aliens)"}

<header>
  <img class="logo" src="assets/logo-white.png" />
  <h1>We Are All Aliens</h1>
</header>

<main>
  <div id="aliens">

  {foreach $aliens as $alien}
  {include file="alien-section.tpl" alien=$alien}
  {/foreach}

  </div>
</main>

{include file="footer.tpl"}