{include file="header.tpl" title="Aliens"}


<header>
  <h1>We Are All Aliens</h1>
</header>

<main id="aliens">

  {foreach $aliens as $alien}
  {include file="alien.tpl" alien=$alien}
  {/foreach}

</main>

{include file="footer.tpl"}