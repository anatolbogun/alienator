import Alien from './alien.js'

const game = new Phaser.Game( {
  width: 1200,
  height: 1200,
  renderer: Phaser.WEBGL,
  transparent: true,
  antialias: true,
  scaleMode: Phaser.ScaleManager.SHOW_ALL,
  preserveDrawingBuffer: true,
  parent: 'viewer',
  state: {
    preload,
    create,
    update,
  },
} )


function preload () {
  game.load.atlas( 'alien', 'assets/alien.png', 'assets/alien.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH )
  game.load.atlas( 'alien-combinations-1', 'assets/alien-combinations-1.png', 'assets/alien-combinations-1.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH )
  game.load.atlas( 'alien-combinations-2', 'assets/alien-combinations-2.png', 'assets/alien-combinations-2.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH )
}


function create () {
  game.input.maxPointers = 1
  game.scale.parentIsWindow = true

  console.log( 'GAME', game )

  loadDNA( { id, onLoaded: ( dna ) => makeAlien( { dna } ) } )
}


function loadDNA ( { id, onLoaded } ) {
  console.log( 'LOADING …' )
  // TO DO: add a saving visualisation

  $.ajax( {
    type: 'POST',
    url: 'load',
    data: { id },
  } ).done( function ( response ) {
    const responseObj = JSON.parse( response )
    console.log( 'LOADING COMPLETE, SERVER RESPONSE:', responseObj )

    if ( responseObj.success ) {
      if ( onLoaded !== undefined ) onLoaded( responseObj.dna )
    } else {
      // notice.show( { text: 'Oops. We encountered an error.\nThe alien could not be loaded.\nPlease reload the page\nto try again.', y: alien.y + 150, persistent: true } )
    }
  } )
}


function makeAlien ( { dna } ) {
  console.log( 'MAKE ALIEN' )
  if ( dna === undefined ) return

  const alien = new Alien( {
    game,
    x: game.world.centerX,
    y: game.world.centerY,
    dna,
  } )
}


function update () {
}
