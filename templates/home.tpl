{include file="header.tpl" title="We Are All Aliens ({$numAliens} aliens)" cssFile="aliens.css"}

<header>
  <a href="aliens/"><img class="logo" src="assets/logo-white.png" /></a>
</header>

<main>
  <div id="aliens">
    This page is coming soooooon.
  </div>
</main>

<footer>
  <div class="social">
    <a class="twitter" href="https://twitter.com/intent/tweet?text={$url|escape:'url'}" data-text="" data-hashtags="weareallaliens" data-via="soba_ba" data-related="soba_ba"><span>share on Twitter</span></a>
    <a class="facebook" href="https://www.facebook.com/share.php?u={$url|escape:'url'}"><span>share on Facebook</span></a>
  </div>
</footer>

{include file="footer.tpl"}