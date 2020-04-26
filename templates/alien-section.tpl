<section id="alien{$alien.id}" class="alien">
  <a onClick="toggleTraits({$alien.id})">
    <div class="images">
      <img class="image lazy" data-src="{$alien.id}.png" src="assets/blank.png" />
      <img class="traits lazy" data-src="{$alien.id}traits.png" src="assets/blank.png" />
    </div>
  </a>
  <p class="info"><a href="/aliens/{$alien.id}/">{$alien.name}</a></p>
  <p class="hidden">{$alien.trait1}</p>
  <p class="hidden">{$alien.trait2}</p>
  <p class="hidden"><span class="localized">Joined</span> <time class="utc">{$alien.utcTimeStamp}</time></p>
</section>