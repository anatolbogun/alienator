import Alien from "./alien.js"

// TO DO
//
// CRUCIAL:
// - save DNA including eyes
// - add text input
// - export as image
// - Instagram API? (probably not possible)
//
// THINGS TO REFINE:
// - if possible for the random generator we need a way to automatically place eyes,
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
// - could try Phaser.Physics collisions for eyes instead of the hit test, but that's probably not easy and could take some time,
//   however, it could be better for performance as the hit test is quite expensive, especially noticeable on lower spec devices

const game = new Phaser.Game( 1200, 1600, Phaser.CANVAS, '', { preload: preload, create: create, update: update } )

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

  game.canvas.addEventListener( 'contextmenu', e => {
    e.preventDefault()
    return false
  } )

  const alienOffsetY = -140

  game.input.maxPointers = 1
  game.stage.backgroundColor = 0xffffff
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  game.scale.parentIsWindow = true

  const dna = hashToDNA()
  // console.log( 'HASH TO DNA', dna )

  const x = game.world.centerX
  const y = game.world.centerY + alienOffsetY
  alien = new Alien( { game, x, y, mutable: true, dna, onDNAChange: handleDNAChange } )
  console.log( 'ALIEN', alien )

  makeEyesDraggable()

  ui = makeUI( { parent: game.world, previousNextButtonOffsetY: alienOffsetY } )
  console.log( 'UI', ui )

  game.world.addChild( alien.group )

  game.input.keyboard.addKey( Phaser.Keyboard.DOWN ).onDown.add( () => alien.showPreviousItem( { type: 'body' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.UP ).onDown.add( () => alien.showNextItem( { type: 'body' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.LEFT ).onDown.add( () => alien.showPreviousItem( { type: 'head' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.RIGHT ).onDown.add( () => alien.showNextItem( { type: 'head' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR ).onDown.add( () => alien.randomize() )
}


function handleDNAChange ( opt ) {
  const { dna } = opt || {}

  if ( ui !== undefined ) {
    const uiEyes = _.filter( ui.buttons, ( button ) => button.eyeball !== undefined )

    // detach existing eyes from the UI because they will be re-created on a DNA change
    for ( const eye of uiEyes ) {
      ui.detachButton( eye )
    }
  }

  dnaToHash( { dna } )
  makeEyesDraggable()
}


function hashToDNA ( opt ) {
  const { separator1, separator2, eyeSeparator1, eyeSeparator2, mapping } = _.defaults( opt || {}, {
    separator1: ',',
    separator2: '=',
    eyeSeparator1: ';',
    eyeSeparator2: '+',
    mapping: {
      body: 'bodyID',
      head: 'headID',
      eyes: 'eyes',
      color: 'color',
    },
  } )

  const hash = window.location.hash.replace( /^\#/, '' )

  const dna = _.fromPairs( _.remove( _.forEach( _.map( hash.split( separator1 ), ( part ) => part.split( separator2 ) ), ( pair ) => {
    pair[ 0 ] = mapping[ pair[ 0 ] ]
    if ( !isNaN( _.toNumber( pair[ 1 ] ) ) ) pair[ 1 ] = _.toNumber( pair[ 1 ] )
  } ), ( pair ) => pair[ 0 ] !== undefined ) )

  if ( dna.eyes !== undefined ) {
    dna.eyes = _.map( _.map( dna.eyes.split( eyeSeparator2 ), ( eyePropsString ) => eyePropsString.split( eyeSeparator1 ) ), ( values ) => {
      return {
        index: Number( values[ 0 ] ),
        x: Number( values[ 1 ] ),
        y: Number( values[ 2 ] ),
      }
    } )
  }

  return dna
}


function dnaToHash ( opt ) {
  const { dna, separator1, separator2, eyeSeparator1, eyeSeparator2, mapping } = _.defaults( opt || {}, {
    separator1: ',',
    separator2: '=',
    eyeSeparator1: ';',
    eyeSeparator2: '+',
    mapping: {
      body: 'bodyID',
      head: 'headID',
      color: 'color',
    },
  } )

  // with ..._.values( mapping ) we just remove the eyes property from DNA because this is an array and will be handled differently below
  let hash = _.join( _.map( _.forEach( _.toPairs( _.pick( dna, ..._.values( mapping ) ) ), ( pair ) => {
    if ( pair[ 0 ] === mapping.color ) pair[ 1 ] = `0x${ pair[ 1 ].toString( 16 ) }`
    pair[ 0 ] = _.findKey( mapping, ( item ) => item === pair[ 0 ] )
  } ), ( pair ) => _.join( pair, separator2 ) ), separator1 )


  let separator = ''

  if ( dna.eyes.length > 0 ) {
    hash += `${ separator1 }eyes${ separator2 }`

    for ( const eye of dna.eyes ) {
      hash += separator + eye.index + eyeSeparator1 + eye.x + eyeSeparator1 + eye.y
      separator = eyeSeparator2
    }
  }

  window.location.hash = hash

  return hash
}


function makeUI ( opt ) {
  const { parent, edgeMargin, headYPosFactor, bodyYPosFactor, previousNextButtonOffsetY, randomXPosFactor, doneXPosFactor } = _.defaults( opt || {}, {
    edgeMargin: 30,
    headYPosFactor: 0.4,
    bodyYPosFactor: 0.6,
    previousNextButtonOffsetY: 0,
  } )

  const group = game.make.group()
  if ( parent !== undefined ) parent.addChild( group )
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

  group.detachButton = ( button ) => {
    _.pull( group.buttons, button )
  }


  group.attachButton = ( button ) => {
    group.buttons.push( button )
  }

  const bounds = game.world.bounds

  const colorSelector = makeColorSelector( { parent: group } )
  colorSelector.sprite.position.set( bounds.centerX, bounds.bottom - colorSelector.height / 2 - edgeMargin )
  group.colorSelector = colorSelector

  const eyes = makeEyes( { parent: group } )
  group.eyes = eyes
  group.buttons = _.concat( group.buttons, eyes )

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


// creates UI eyes
function makeEyes ( opt ) {
  const { parent, x, y, margin, eyeIndices } = _.defaults( opt || {}, {
    x: game.world.centerX,
    y: 50,
    margin: 20,
    eyeIndices: [ 0, 1, 2, 3, 4, 5 ],
    // eyeIndices: [ 2, 1, 0, 5, 4, 3 ], // alternative eye order
  } )

  const eyes = []
  let width = 0
  let height = 0

  eyeIndices.forEach( ( index, order ) => {
    const eye = makeEye( { parent, index, order } )

    width += eye.eyeball.width + margin
    height = Math.max( height, eye.eyeball.height )
    eyes[ order ] = eye
  } )

  width -= margin

  const posY = y + height / 2
  let posX = x - width / 2

  for ( const eye of eyes ) {
    posX += eye.eyeball.width / 2
    eye.position.set( posX, posY )
    eye.origin = { x: posX, y: posY }
    posX += eye.eyeball.width / 2 + margin
  }

  return eyes
}


function makeEye ( opt ) {
  const { parent, index, order, x, y, origin, color, alpha } = _.defaults( opt || {}, {
    x: 0,
    y: 0,
    origin: { x: opt.x || 0, y: opt.y || 0 },
    alpha: 1,
    color: 0x808080,
  } )

  const eye = alien.makeEye( { parent, x, y, index, blink: false, attach: false } )
  eye.alpha = alpha
  eye.index = index
  eye.order = order
  eye.origin = origin
  eye.iris.tint = color

  makeEyeDraggable( { eye } )

  return eye
}


function makeEyesDraggable () {
  if ( alien === undefined ) return

  for ( const eye of alien.eyes ) {
    makeEyeDraggable( { eye } )
  }
}


function makeEyeDraggable ( { eye } ) {
  eye.previousValidPosition = new Phaser.Point( eye.x, eye.y )
  eye.inputEnabled = true
  eye.input.enableDrag( false, true )
  eye.input.enableSnap( 1, 1, true, true )
  eye.events.onDragStart.add( handleEyeDragStart )
  eye.events.onDragUpdate.add( handleEyeDragUpdate )
  eye.events.onDragStop.add( handleEyeDragStop )
}


function handleEyeDragStart ( eye ) {
  eye.initialDrag = eye.parent !== alien.group
  alien.group.addChild( eye )
  eye.iris.tint = alien.getIrisColor()
  eye.stopBlinking()
}


function handleEyeDragUpdate ( eye ) {
  // I'm not entirely certain why, but without offsetX / offsetY, once the eyeToEyeHitTest is true it will never become false again
  const offsetX = eye.x - eye.previousValidPosition.x
  const offsetY = eye.y - eye.previousValidPosition.y

  if ( alien.eyeToBodyHitTest( { eye } ) ) {
    alien.tint()
  } else {
    alien.adjustTintLuminosity()
  }

  if ( alien.eyeToEyeHitTest( { eye, offsetX, offsetY } ) ) {
    eye.position.set( eye.previousValidPosition.x, eye.previousValidPosition.y )
  } else {
    eye.previousValidPosition.set( eye.x, eye.y )
  }
}


function handleEyeDragStop ( eye ) {
  if ( eye.initialDrag ) makeNewUiEye( { eye } )

  if ( alien.eyeToBodyHitTest( { eye } ) ) {
    alien.attachEye( { eye } )
    eye.startBlinking()
  } else {
    eye.hideAndDestroy()
    ui.detachButton( eye )
  }

  alien.tint()
}


function makeNewUiEye ( { eye } ) {
  const uiEye = makeEye( { parent: ui, index: eye.index, order: eye.order, x: eye.origin.x, y: eye.origin.y, alpha: 0 } )

  const tl = new TimelineMax()
  tl.set( uiEye, { alpha: 1 } )
  tl.from( uiEye.scale, 0.5, { x: 0, y: 0, ease: Back.easeOut } )
  ui.eyes[ eye.order ] = uiEye
  ui.attachButton( uiEye )
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
  tl.staggerTo( [ ui.eyes[ 0 ], ui.eyes[ 1 ], ui.eyes[ 2 ] ], 0.25, { y: -110, ease: Back.easeIn }, 0.05, 0 )
  tl.staggerTo( [ ui.eyes[ 5 ], ui.eyes[ 4 ], ui.eyes[ 3 ] ], 0.25, { y: -110, ease: Back.easeIn }, 0.05, 0 )
  tl.to( ui.oath, 0.35, _.merge( ui.oath.showPos, { ease: Back.easeOut } ), 0.45 )
  tl.to( [ ui.colorSelector.sprite, ui.randomButton ], 0.5, { x: `-=${ game.world.width }`, angle: -720, ease: Power1.easeIn }, 0.2 )
  tl.to( ui.okButton, 0.5, { x: game.world.centerX + 100, angle: -360, ease: Power1.easeInOut }, 0.2 )
  tl.to( ui.cancelButton, 0.5, { x: game.world.centerX - 100, angle: -360, alpha: 1, ease: Power1.easeInOut }, 0.2 )
  tl.to( alien.group, 0.5, { y: 320, ease: Back.easeOut }, 0.3 )
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
    if ( !bmd.inputEnabled || !pointer.isDown ) return
    const { x, y } = pointer

    if ( x >= sprite.x - sprite.anchor.x * sprite.width && x <= sprite.x - sprite.anchor.x * sprite.width + sprite.width && y >= sprite.y - sprite.anchor.y * sprite.height && y <= sprite.y - sprite.anchor.y * sprite.height + sprite.height ) {
      const localPos = sprite.toLocal( { x: x + sprite.anchor.x * sprite.width, y: y + sprite.anchor.y * sprite.height } )
      const rgb = bmd.getPixelRGB( Math.round( localPos.x ), Math.round( localPos.y ) )
      const color = Phaser.Color.getColor( rgb.r, rgb.g, rgb.b )

      if ( rgb.a === 255 && color !== alien.dna.color ) {
        alien.setColor( { color } )
      }
    }
  }
}


function handleClick ( { type } ) {
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


function update () {
}
