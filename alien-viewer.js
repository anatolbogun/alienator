import Alien from './alien.js'

const game = new Phaser.Game({
  width: 1200,
  height: 1200,
  renderer: Phaser.WEBGL,
  parent: 'viewer',
  transparent: true,
  antialias: true,
  scaleMode: Phaser.ScaleManager.SHOW_ALL,
  preserveDrawingBuffer: true,
  state: {
    preload,
    create,
    update,
  },
})

function preload() {
  game.load.atlas('alien', 'assets/alien.png', 'assets/alien.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
  game.load.atlas(
    'alien-combinations-1',
    'assets/alien-combinations-1.png',
    'assets/alien-combinations-1.json',
    Phaser.Loader.TEXTURE_ATLAS_JSON_HASH,
  )
  game.load.atlas(
    'alien-combinations-2',
    'assets/alien-combinations-2.png',
    'assets/alien-combinations-2.json',
    Phaser.Loader.TEXTURE_ATLAS_JSON_HASH,
  )
}

function create() {
  game.input.maxPointers = 1
  // game.scale.parentIsWindow = true

  // to do: not the best way to read the id from the URL, I'd prefer to call a load( id ) function from outside this module, but Safari causes issues
  const id = Number(window.location.pathname.match(/aliens\/(\d+)/)[1])

  loadDNA({ id, onLoaded: (dna) => makeAlien({ dna }) })
}

function loadDNA({ id, onLoaded }) {
  $.ajax({
    type: 'POST',
    url: 'load',
    data: { id },
  }).done(function (response) {
    try {
      const responseObj = JSON.parse(response)
      console.log('LOADING COMPLETE, SERVER RESPONSE:', responseObj)

      if (responseObj.success) {
        if (onLoaded != null) onLoaded(responseObj.dna)
      } else {
        // notice.show( { text: 'Oops. We encountered an error.\nThe alien could not be loaded.\nPlease reload the page\nto try again.', y: alien.y + 150, persistent: true } )
      }
    } catch (e) {
      console.warn(`Could not find alien with ID ${id}\n`, e)
    }
  })
}

function makeAlien({ dna }) {
  if (dna == null) return

  const alien = new Alien({
    game,
    x: game.world.centerX,
    y: game.world.centerY,
    groundY: 1,
    dna,
    onClick: (alien) => handleClick(alien),
    textStyle: {
      fontSize: '60px',
      fill: 0xffffff,
    },
    traitProperties: {
      width: game.world.width * 0.8,
      height: game.world.height * 0.15,
      yMargin1: game.world.height * -0.25,
      yMargin2: game.world.height * -0.09,
      fromYOffset: game.world.height * 0.19,
      color: 0xffffff,
    },
  })

  gsap.delayedCall(1, () => alien.toggleTraits())
}

function handleClick(alien) {
  alien.toggleTraits()
}

function update() {}
