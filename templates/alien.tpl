<section id="alien{$alien.id}" class="alien">
  <a onClick="toggleTraits({$alien.id})">
    <img class="image" src="user-images/{$alien.id}.png" />
    <img class="traits" src="user-images/{$alien.id}traits.png" />
  </a>
  <p class="hidden">{$alien.trait1}</p>
  <p class="hidden">{$alien.trait2}</p>
  <p><a href="/aliens">Joined <time class="utc">{$alien.utcTimeStamp}</time></a></p>
</section>