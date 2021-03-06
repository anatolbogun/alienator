{include file="header.tpl" title="We Are All Aliens ({$numAliens} aliens)" cssFile="home.css" jsModuleFile="home.js"}

<header>
  <img class="logo" src="assets/logo.png" />
  <img class="uco" src="assets/uco.png" />
  <a class="join" href="join/">Join</a>
</header>

<main>
  <div id="viewer"></div>
</main>

<footer>
  <div class="navi">
    <a class="profiles tooltip" href="aliens/"><span class="localized">view all aliens</span></a>
  </div>
  <div class="social">
    <a class="twitter tooltip" href="https://twitter.com/intent/tweet?text={$url|escape:'url'}" data-text="" data-hashtags="weareallaliens" data-via="soba_ba" data-related="soba_ba"><span class="localized">share on Twitter</span></a>
    <a class="facebook tooltip" href="https://www.facebook.com/share.php?u={$url|escape:'url'}"><span class="localized">share on Facebook</span></a>
  </div>
</footer>

{include file="footer.tpl"}