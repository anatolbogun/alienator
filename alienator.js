import Alien from "./alien.js"

// NOTES:
// - I think makeValidHslColors() and especially getNearestHslColor() was an interesting thing to do
//   and I may use this in another project, but I think if I want to redo the colour picker
//   I rather write a HSL picker that is generated by code and selects colours by angle and distance
//   to the center. For now reading the bitmap pixel colour works fine but isn't ideal because
//   of antialiasing where two colours meet. But it's super flexible because you can just swap out
//   the colour picker image.

// TO DO:
// - handcrafted version needs to store where head and body are to place eyes
// - eyes need to be draggable (and only onto the body, maybe I need a
//   second inner shape and eyes can only drop if inside of that shape)
// - draggable eyes should not overlap each other
// - still, for the random generator we need a way to automatically place eyes,
//   ideally with a random placement on the shape with validation as user drag and drop;
//   maybe a while loop that picks random positions within the body part bounds and places
//   the eye as long as it does not collide with other eyes; but limit the number of loops
//   because it's possible that there's just no space left, and I don't think there's a
//   simple way to check that
// - eyes on the body should be permitted, however, the random generator should prioritise
//   to place them on the head
// - 2 eyes should be prioritised on the same height
// - save as an image on the server (maybe even png and gif with eye blink)
// - save user info in the database
//   alien table: ( id, timestamp, name, 2 traits, dna: headID, bodyID, color)
// - eyes table (links to aliens table via id): ( id, alienID, eyeID, x, y, eyeTick?, scale? )
// - display aliens as images
// - maybe also display aliens moving across the screen

const game = new Phaser.Game( 1200, 1400, Phaser.CANVAS, '', { preload: preload, create: create, update: update } )

let alien
let ui


function preload () {
  game.load.atlas( 'assets', 'assets/assets.png', 'assets/assets.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH )
  game.load.atlas( 'alien', 'assets/alien.png', 'assets/alien.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH )
  game.load.atlas( 'alien-combinations-1', 'assets/alien-combinations-1.png', 'assets/alien-combinations-1.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH )
  game.load.atlas( 'alien-combinations-2', 'assets/alien-combinations-2.png', 'assets/alien-combinations-2.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH )
}


function create () {
  console.log( 'GAME', game )

  const alienOffsetY = -140

  game.input.maxPointers = 1
  game.stage.backgroundColor = 0xffffff
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  game.scale.parentIsWindow = true

  const dna = hashToDNA()

  const x = game.world.centerX
  const y = game.world.centerY + alienOffsetY
  alien = new Alien( { game, x, y, mutable: true, dna, onMake: dnaToHash } )
  console.log( 'ALIEN', alien )

  // alien.makeEye( { index: 1 } )

  ui = makeUI( { previousNextButtonOffsetY: alienOffsetY } )
  console.log( 'UI', ui )

  game.input.keyboard.addKey( Phaser.Keyboard.DOWN ).onDown.add( () => alien.showPreviousItem( { type: 'body' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.UP ).onDown.add( () => alien.showNextItem( { type: 'body' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.LEFT ).onDown.add( () => alien.showPreviousItem( { type: 'head' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.RIGHT ).onDown.add( () => alien.showNextItem( { type: 'head' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR ).onDown.add( () => alien.randomize() )

  game.input.addMoveCallback( hitTest )
}


function hitTest ( pointer ) {
  alien.eyes[ 0 ].hitTest( { pointer } )
}


function hashToDNA ( opt ) {
  const { separator1, separator2, mapping } = _.defaults( opt || {}, {
    separator1: ',',
    separator2: '=',
    mapping: {
      body: 'bodyID',
      head: 'headID',
      eye: 'eyeID',
      color: 'color',
    },
  } )

  const hash = window.location.hash.replace( /^\#/, '' )

  return _.fromPairs( _.remove( _.forEach( _.map( hash.split( separator1 ), ( part ) => part.split( separator2 ) ), ( pair ) => {
    pair[ 0 ] = mapping[ pair[ 0 ] ]
    if ( !isNaN( _.toNumber( pair[ 1 ] ) ) ) pair[ 1 ] = _.toNumber( pair[ 1 ] )
  } ), ( pair ) => pair[ 0 ] !== undefined ) )
}


function dnaToHash ( opt ) {
  const { dna, separator1, separator2, mapping } = _.defaults( opt || {}, {
    separator1: ',',
    separator2: '=',
    mapping: {
      body: 'bodyID',
      head: 'headID',
      eye: 'eyeID',
      color: 'color',
    },
  } )

  const hash = _.join( _.map( _.forEach( _.toPairs( dna ), ( pair ) => {
    if ( pair[ 0 ] === mapping.color ) pair[ 1 ] = `0x${ pair[ 1 ].toString( 16 ) }`
    pair[ 0 ] = _.findKey( mapping, ( item ) => item === pair[ 0 ] )
  } ), ( pair ) => _.join( pair, separator2 ) ), separator1 )

  window.location.hash = hash

  return hash
}


function makeUI ( opt ) {
  const { edgeMargin, headYPosFactor, bodyYPosFactor, previousNextButtonOffsetY, randomXPosFactor, doneXPosFactor } = _.defaults( opt || {}, {
    edgeMargin: 30,
    headYPosFactor: 0.4,
    bodyYPosFactor: 0.6,
    previousNextButtonOffsetY: 0,
  } )

  const group = game.add.group()
  group.buttons = []
  group.disableButtons = () => {
    for ( const button of group.buttons ) {
      button.inputEnabled = false
    }
  }
  group.enableButtons = () => {
    for ( const button of group.buttons ) {
      button.inputEnabled = true
    }
  }

  const bounds = game.world.bounds

  const colorSelector = makeColorSelector( { parent: group } )
  colorSelector.sprite.position.set( bounds.centerX, bounds.bottom - colorSelector.height / 2 - edgeMargin )
  group.colorSelector = colorSelector

  const randomButton = makeButton( { group, key: 'random', onClick: () => alien.randomize() } )
  randomButton.position.set( bounds.left + randomButton.width / 2 + edgeMargin, colorSelector.sprite.y )

  const cancelButton = makeButton( { group, key: 'cancel', alpha: 0, inputEnabled: false, onClick: () => handleClick( { type: 'cancel' } ) } )
  cancelButton.position.set( bounds.right - cancelButton.width / 2 - edgeMargin, colorSelector.sprite.y )

  const okButton = makeButton( { group, key: 'ok', onClick: () => handleClick( { type: 'ok' } ) } )
  okButton.position.set( bounds.right - okButton.width / 2 - edgeMargin, colorSelector.sprite.y )

  const previousHeadButton = makeButton( { group, key: 'previousHead', frameKey: 'previous', onClick: () => alien.showPreviousItem( { type: 'head' } ) } )
  previousHeadButton.position.set( bounds.left + randomButton.width / 2 + edgeMargin, bounds.height * headYPosFactor + previousNextButtonOffsetY )

  const previousBodyButton = makeButton( { group, key: 'previousBody', frameKey: 'previous', onClick: () => alien.showPreviousItem( { type: 'body' } ) } )
  previousBodyButton.position.set( bounds.left + randomButton.width / 2 + edgeMargin, bounds.height * bodyYPosFactor + previousNextButtonOffsetY )

  const nextHeadButton = makeButton( { group, key: 'nextHead', frameKey: 'next', onClick: () => alien.showNextItem( { type: 'head' } ) } )
  nextHeadButton.position.set( bounds.right - randomButton.width / 2 - edgeMargin, bounds.height * headYPosFactor + previousNextButtonOffsetY )

  const nextBodyButton = makeButton( { group, key: 'nextBody', frameKey: 'next', onClick: () => alien.showNextItem( { type: 'body' } ) } )
  nextBodyButton.position.set( bounds.right - randomButton.width / 2 - edgeMargin, bounds.height * bodyYPosFactor + previousNextButtonOffsetY )

  const oath = makeOath( { x: bounds.centerX, y: bounds.height * 0.5 } )
  group.oath = oath

  return group
}


function makeButton ( opt ) {
  const { key, atlasKey, frameKey, x, y, anchorX, anchorY, alpha, inputEnabled, group, onClick } = _.defaults( opt || {}, {
    atlasKey: 'assets',
    frameKey: opt.key,
    x: 0,
    y: 0,
    anchorX: 0.5,
    anchorY: 0.5,
    alpha: 1,
    inputEnabled: true,
  } )

  const capitalizedFrameKey = capitalize( frameKey )
  const button = game.add.button( x, y, atlasKey, onClick, this, `ui${ capitalizedFrameKey }Over`, `ui${ capitalizedFrameKey }`, `ui${ capitalizedFrameKey }Down`, `ui${ capitalizedFrameKey }`, group )
  button.anchor.set( anchorX, anchorY )
  button.origin = _.clone( button.position )
  button.alpha = alpha
  button.inputEnabled = inputEnabled

  if ( group !== undefined ) {
    group[ `${ key }Button` ] = button
    group.buttons.push( button )
  }

  return button
}


function capitalize ( string ) {
  return string.charAt( 0 ).toUpperCase() + string.slice( 1 )
}


function makeOath ( opt ) {
  const { x, y, textOffsetY } = _.defaults( opt, {
    textOffsetY: -8,
  } )

  const group = game.add.group()
  group.visible = false

  const panel = game.add.sprite( 0, 0, 'assets', 'panel', group )
  panel.anchor.set( 0.5, 0.5 )

  const text = game.add.sprite( 0, textOffsetY, 'assets', 'oath', group )
  text.anchor.set( 0.5, 0.5 )

  group.showPos = { x, y }
  group.hidePos = { x, y: -panel.height / 2 }

  group.position.set( group.hidePos.x, group.hidePos.y )

  return group
}


function showOath () {
  ui.disableButtons()
  ui.colorSelector.inputEnabled = false
  ui.oath.enabled = true

  const tl = new TimelineMax()
  // tl.call( ui.disableButtons )
  // tl.set( ui.colorSelector, { inputEnabled: false } )
  tl.set( ui.oath, { visible: true } )
  tl.staggerTo( [ ui.previousHeadButton, ui.previousBodyButton ], 0.5, { x: -100, ease: Back.easeIn }, 0.1 )
  tl.staggerTo( [ ui.nextHeadButton, ui.nextBodyButton ], 0.5, { x: game.world.width + 100, ease: Back.easeIn }, 0.1, 0 )
  tl.to( ui.oath, 0.35, _.merge( ui.oath.showPos, { ease: Back.easeOut } ), 0.45 )
  tl.to( [ ui.colorSelector.sprite, ui.randomButton ], 0.5, { x: `-=${ game.world.width }`, angle: -720, ease: Power1.easeIn }, 0.2 )
  tl.to( ui.okButton, 0.5, { x: game.world.centerX + 100, angle: -360, ease: Power1.easeInOut }, 0.2 )
  tl.to( ui.cancelButton, 0.5, { x: game.world.centerX - 100, angle: -360, alpha: 1, ease: Power1.easeInOut }, 0.2 )
  tl.to( alien.group, 0.5, { y: 180, ease: Back.easeOut }, 0.3 )
  tl.to( alien.group.scale, 0.5, { x: 0.4, y: 0.4, ease: Power1.easeOut }, 0.3 )
  tl.call( () => ui.cancelButton.inputEnabled = true )
  tl.call( () => ui.okButton.inputEnabled = true )

  ui.oath.timeline = tl
}


function hideOath () {
  ui.oath.timeline.reverse()
  ui.enableButtons()
  ui.colorSelector.inputEnabled = true
  ui.cancelButton.inputEnabled = false
  ui.oath.enabled = false
}


function makeColorSelector ( opt ) {
  const { parent, x, y } = _.defaults( opt || {}, {
    x: 0,
    y: 0,
  } )

  const image = game.make.image( 0, 0, 'assets', 'colorPicker' )
  const bmd = game.make.bitmapData( image.width, image.height )
  bmd.draw( image, x, y )
  bmd.update()
  const sprite = bmd.addToWorld()
  sprite.anchor.set( 0.5, 0.5 )
  bmd.sprite = sprite
  parent.add( sprite )
  game.input.addMoveCallback( getColor )
  bmd.origin = { x, y }
  bmd.inputEnabled = true
  return bmd

  function getColor ( pointer ) {
    if ( !bmd.inputEnabled ) return
    const { x, y } = pointer

    const posX = Math.round( x - sprite.x + sprite.anchor.x * sprite.width )
    const posY = Math.round( y - sprite.y + sprite.anchor.y * sprite.height )

    // TO DO: this can be im proved by first checking item bounds before the getPixelRGB
    // maybe also use .toLocal(); see alien.js hit test

    if ( pointer.isDown && posX >= 0 && posX <= bmd.width && posY >= 0 && posY <= bmd.height ) {
      const rgb = bmd.getPixelRGB( posX, posY )
      const color = Phaser.Color.getColor( rgb.r, rgb.g, rgb.b )

      if ( rgb.a === 255 && color !== alien.dna.color ) {
        alien.setColor( { color } )
      }
    }
  }
}


function handleClick( { type } ) {
  switch ( type ) {
    case 'ok': {
      if ( ui.oath.enabled ) {
        alert( 'I can\'t do that yet.' )
      } else {
        showOath()
      }

      break
    }
    case 'cancel': {
      hideOath()
      break
    }
  }
}


function update() {
}
