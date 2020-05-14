import Alien from './alien.js'

gsap.registerPlugin( MotionPathPlugin )


const aliens = []
let dnaPool
const margin = -175 // the margin from the edge where aliens are spawned

const body = $( 'body' )[ 0 ]
const sizeFactor = 2 // this creates game dimensions sizeFactor the size of the dom body; keeping this at 1 creates quite a pixelated result, not very nice

const game = new Phaser.Game( {
  width: body.clientWidth * sizeFactor || 1600,
  height: body.clientHeight * sizeFactor || 1600,
  renderer: Phaser.WEBGL,
  parent: 'viewer',
  transparent: true,
  antialias: true,
  multiTexture: true,
  scaleMode: Phaser.ScaleManager.EXACT_FIT, // EXACT_FIT only works here because we resize the world, otherwise this isn't recommended; RESIZE would be a nice option if it didn't pixelate things so much
  preserveDrawingBuffer: true,
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
  console.log( 'GAME', game )
  console.log( 'GSAP', gsap )

  game.onBlur.add( handleBlur )
  game.onFocus.add( handleFocus )

  game.input.maxPointers = 1
  game.scale.onSizeChange.add( handleResize )

  loadDNAs( { num: 100, onLoaded: handleLoaded } )
}


function handleResize ( scaleManager, width, height ) {
  // the game.world dimensions change with a window resize
  game.scale.setGameSize( width * sizeFactor, height * sizeFactor )
}


function loadDNAs ( { num, onLoaded } ) {
  $.ajax( {
    type: 'POST',
    url: 'load-multiple',
    data: { num },
  } ).done( function ( response ) {
    try {
      const responseObj = JSON.parse( response )
      console.log( 'LOADING COMPLETE, SERVER RESPONSE:', responseObj )

      if ( responseObj.success ) {
        if ( onLoaded !== undefined ) onLoaded( responseObj.dnas )
      } else {
        // notice.show( { text: 'Oops. We encountered an error.\nThe alien could not be loaded.\nPlease reload the page\nto try again.', y: alien.y + 150, persistent: true } )
      }
    } catch ( e ) {
      console.warn( `Aliens don't exist.`, e )
    }
  } )
}


function handleBlur () {
  gsap.globalTimeline.pause()
}


function handleFocus () {
  gsap.globalTimeline.play()
}


function getNumAliens ( squarePixelsPerAlien = 275 ) {
  return Math.round( game.world.width * game.world.height / squarePixelsPerAlien ** 2 )
}


function handleLoaded ( dnas ) {
  dnaPool = _.cloneDeep( dnas )
  const numAliens = Math.min( dnas.length, getNumAliens() )
  console.log( 'MAX ALIENS', numAliens, ', NUM ALIENS', dnas.length )

  for ( const i of _.range( numAliens ) ) {
    const alien = new Alien( {
      game,
      groundY: 1,
      dna: dnas[ i ],
      onClick: ( alien ) => handleClick( alien ),
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
    } )

    setAlienPivotToBottom( alien )
    alien.scale.set( 0.5 )
    positionAlien( alien )
    moveAlien( alien )
    aliens.push( alien )
  }
}


function setAlienPivotToBottom ( alien ) {
  alien.pivot.set( 0, alien.body.height * ( 1 - alien.body.anchor.y ) )
}


function getAvailableDNAs () {
  return _.differenceBy( dnaPool, _.map( aliens, 'dna' ), 'id' )
}


function getAvailableDNA () {
  return _.sample( getAvailableDNAs() )
}


function positionAlien ( alien ) {
  // const { x, y } = ( () => {
  //   const random = Math.random()
  //   switch ( true ) {
  //     case random < 0.25: return { x: _.random( margin, game.world.width - margin ), y: margin }
  //     case random < 0.5: return { x: _.random( margin, game.world.width - margin ), y: game.world.height - margin }
  //     case random < 0.75: return { x: margin, y: _.random( margin, game.world.height - margin ) }
  //     default: return { x: game.world.width - margin, y: _.random( margin, game.world.height - margin ) }
  //   }
  // } )()

  // alien.position.set( x, y )

  alien.position.set( _.random( margin, game.world.width - margin ) , 0 )
}


// function moveAlien ( alien ) {
//   const minDuration = 30
//   const maxDuration = 50
//   const minX = margin
//   const minY = margin

//   const animation = ( opt ) => {
//     const { item, delay } = opt

//     const maxX = game.world.width - margin
//     const maxY = game.world.height - margin

//     item.tween = gsap.to( item, {
//       duration: _.random( minDuration, maxDuration, true ),
//       delay,
//       motionPath: {
//         path: [
//           {
//             x: _.random( minX, maxX ),
//             y: _.random( minY, maxY ),
//           },
//           {
//             x: _.random( minX, maxX ),
//             y: _.random( minY, maxY ),
//           },
//           {
//             x: _.random( minX, maxX ),
//             y: _.random( minY, maxY ),
//           },
//         ],
//       },
//       ease: 'power1.inOut',
//       onComplete: () => animation( { item: alien } ),
//     } )
//   }

//   animation( { item: alien, delay: _.random( 10, true ) } )
// }


function moveAlien ( alien ) {
  const minDuration = 40
  const maxDuration = 40
  const minX = margin
  const minY = margin

  const animation = ( opt ) => {
    const { alien, delay } = opt

    const maxX = game.world.width - margin
    const maxY = ( game.world.height - margin ) * 1.5
    const duration = 40

    // alien.tween = gsap.to( alien, {
    //   duration: 40, // _.random( minDuration, maxDuration, true ),
    //   delay,
    //   motionPath: {
    //     path: [
    //       {
    //         x: _.random( minX, maxX ),
    //         y: Power1.easeOut( 1 / 3 ) * maxY,
    //       },
    //       {
    //         x: _.random( minX, maxX ),
    //         y: Power1.easeOut( 2 / 3 ) * maxY,
    //       },
    //       {
    //         x: _.random( minX, maxX ),
    //         y: maxY,
    //       },
    //     ],
    //   },
    //   ease: 'power1.inOut',
    //   onComplete: () => {
    //     const dna = _.cloneDeep( getAvailableDNA() )

    //     if ( dna !== undefined ) {
    //       alien.make( dna )
    //       alien.trait1.setText( dna.trait1 )
    //       alien.trait2.setText( dna.trait2 )
    //       setAlienPivotToBottom( alien )
    //       console.log( 'MAKING NEW ALIEN', dna )
    //     }

    //     alien.y = 0
    //     animation( { alien } )
    //   },
    // } )

    alien.tween = gsap.timeline( { delay } )
      .to( alien, { duration: duration / 3, x: _.random( minX, maxX ), ease: 'power1.inOut' } )
      .to( alien, { duration: duration / 3, x: _.random( minX, maxX ), ease: 'power1.inOut' } )
      .to( alien, { duration: duration / 3, x: _.random( minX, maxX ), ease: 'power1.inOut' } )
      .to( alien, { duration, y: maxY, ease: 'power1.in' }, 0 )
      .call( () => {
        const dna = _.cloneDeep( getAvailableDNA() )

        if ( dna !== undefined ) {
          alien.make( dna )
          alien.trait1.setText( dna.trait1 )
          alien.trait2.setText( dna.trait2 )
          setAlienPivotToBottom( alien )
          console.log( 'MAKING NEW ALIEN', dna )
        }

        alien.y = 0
        animation( { alien } )
      } )
  }

  animation( { alien, delay: _.random( 40, true ) } )
}


function handleClick ( alien ) {
  alien.showTraits()
  gsap.delayedCall( 4, () => alien.hideTraits() )
}


function update () {
  _.sortBy( aliens, 'y' ).forEach( ( alien, i ) => {
    alien.parent.setChildIndex( alien, i )

    const positionYFactor = Power1.easeOut( _.clamp( alien.y / game.world.height, 0, 1 ) ) // change this to gsap eases

    alien.scale.set( positionYFactor )

    const rgb = Phaser.Color.getRGB( alien.dna.color )
    const hsl = Phaser.Color.RGBtoHSL( rgb.r, rgb.g, rgb.b )
    const tint = Phaser.Color.HSLtoRGB( hsl.h, hsl.s, hsl.l * positionYFactor ).color
    alien.tint( { color: tint, setDNA: false } )
  } )
}