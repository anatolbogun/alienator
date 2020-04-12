<section id="alien{$alien.id}" class="alien">
  <a onClick="toggleTraits({$alien.id})">
    <img class="image lazy" data-src="{$alien.id}.png" src="assets/blank.png" />
    <img class="traits lazy" data-src="{$alien.id}traits.png" src="assets/blank.png" />
  </a>
  <p class="hidden">{$alien.trait1}</p>
  <p class="hidden">{$alien.trait2}</p>
  <p><a href="/aliens"><span class="localized">Joined</span> <time class="utc">{$alien.utcTimeStamp}</time></a></p>
</section>