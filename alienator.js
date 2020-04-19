import Alien from './alien.js'
import Planet from './planet.js'
import TextField from './text-field.js'

// TO DO:
// - maybe also display aliens moving across the screen
// - One more page for the beginning (I will send you the design)

// NICE TO HAVE:
// - Instagram API to automatically upload new aliens? (probably not possible, the API
//   seems very limited)
// - save a unique ID (SHA?) with each alien so that it can be edited; that's not really
//   hard, just load the alien dna from that id and run an update query instead of creating
//   a new entry
// - for the random generator it'd be nice to have a way to automatically place eyes,
//   ideally with a random placement on the shape with validation as user drag and drop;
//   maybe a while loop that picks random positions within the body part bounds and places
//   the eye as long as it does not collide with other eyes; but limit the number of loops
//   because it's possible that there's just no space left, and I don't think there's a
//   simple way to check that; this is really low priority though, it's probably better to
//   leave some creativity to the user, so it really would be more of a coding challenge.
// - could try Phaser.Physics collisions for eyes instead of the hit test, but that's
//   probably not easy and could take some time, however, it could be better for performance
//   as the hit test is quite expensive, especially noticeable on lower spec devices;
//   this is also really low priority, it seems to work pretty ok right now.


const game = new Phaser.Game( {
  width: 1200,
  height: 1800,
  renderer: Phaser.WEBGL,
  transparent: true, // this also defines if the saved PNG is transparent or not
  antialias: true,
  scaleMode: Phaser.ScaleManager.SHOW_ALL,
  preserveDrawingBuffer: true,
  state: {
    preload,
    create,
    update,
  },
} )

let background
let alien
let planet
let ui
let notice
let currentScreen = 'editor'
let screenshots
let completeTimeline

const useUrlHash = false
const useLocalStorage = true
const imageExportWidth = 800
const imageExportHeight = 800
const traitMaxLength = 100
const aliensURL = './aliens/'


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
  game.scale.parentIsWindow = true

  background = makeBackGround()
  background.visible = false

  const dna = ( () => {
    switch ( true ) {
      case useUrlHash: return hashToDNA() // note: the URL hash does not include raits
      case useLocalStorage: return localStorageToDNA()
      default: return
    }
  } )()

  const x = game.world.centerX
  const y = game.world.centerY + alienOffsetY
  alien = new Alien( { game, x, y, mutable: true, dna, onDNAChange: handleDNAChange } )
  alien.origin = { x, y }
  console.log( 'ALIEN', alien )

  makeEyesDraggable()

  ui = makeUI( { parent: game.world, previousNextButtonOffsetY: alienOffsetY } )
  ui.traits.textFields[ 0 ].text = alien.dna.trait1
  ui.traits.textFields[ 1 ].text = alien.dna.trait2

  game.world.addChild( alien )

  notice = makeNotice( { parent: game.world, x: alien.x, y: alien.y, width: game.world.width * 0.8, height: game.world.height * 0.2 } )

  game.scale.onResize = handleResize
}


function makeBackGround ( opt ) {
  const { color } = _.defaults( opt || {}, {
    color: 0xffffff,
  } )

  const graphics = game.add.graphics( 0, 0 )
  graphics.beginFill( color )
  graphics.drawRect( 0, 0, game.world.width, game.world.height )
  return graphics
}


function handleResize () {
  for ( const textField of ui.traits.textFields ) {
    textField.updateHtmlText()
  }
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

  if ( useUrlHash ) dnaToHash( { dna } )
  if ( useLocalStorage ) dnaToLocalStorage()
  makeEyesDraggable()
}


function dnaToLocalStorage () {
  if ( alien === undefined || alien.dna === undefined ) return

  const exportDNA = _.pick( alien.dna, [ 'bodyID', 'headID', 'color', 'trait1', 'trait2' ] )
  exportDNA.eyes = _.map( alien.dna.eyes, ( eye ) => _.pick( eye, [ 'index', 'x', 'y' ] ) )
  localStorage.setItem( 'dna', JSON.stringify( exportDNA ) )
}


function localStorageToDNA () {
  return JSON.parse( localStorage.getItem( 'dna' ) ) || undefined
}


function hashToDNA ( opt ) {
  const { separator1, separator2, eyeSeparator1, eyeSeparator2, mapping } = _.defaults( opt || {}, {
    separator1: ',',
    separator2: '=',
    eyeSeparator1: ';',
    eyeSeparator2: '!',
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
    eyeSeparator2: '!',
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
  const { parent, edgeMargin, headYPosFactor, bodyYPosFactor, previousNextButtonOffsetY } = _.defaults( opt || {}, {
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

  const oath = makeOath( { x: bounds.centerX, y: bounds.height * 0.43 } )
  group.oath = oath

  const traits = makeTraits( { x: bounds.centerX, y: bounds.height * 0.43 } )
  group.traits = traits

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
  eye.initialDrag = eye.parent !== alien
  alien.addChild( eye )
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
  const { key, atlasKey, frameKey, x, y, anchorX, anchorY, alpha, visible, inputEnabled, group, onClick } = _.defaults( opt || {}, {
    atlasKey: 'assets',
    frameKey: opt.key,
    x: 0,
    y: 0,
    anchorX: 0.5,
    anchorY: 0.5,
    alpha: 1,
    visible: true,
    inputEnabled: true,
  } )

  const capitalizedFrameKey = capitalize( frameKey )
  const button = game.add.button( x, y, atlasKey, onClick, this, `ui${ capitalizedFrameKey }Over`, `ui${ capitalizedFrameKey }`, `ui${ capitalizedFrameKey }Down`, `ui${ capitalizedFrameKey }`, group )
  button.anchor.set( anchorX, anchorY )
  button.origin = _.clone( button.position )
  button.alpha = alpha
  button.visible = visible
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
  const { x, y, widthFactor, heightFactor, panelRadius, textOffsetY, panelColor, textMargin, textStyle, text } = _.defaults( opt, {
    widthFactor: 0.95,
    heightFactor: 0.62,
    panelRadius: 50,
    textOffsetY: -8,
    panelColor: 0x000000,
    textMargin: 50,
    textStyle: {
      font: 'BC Alphapipe, sans-serif',
      fontSize: '56px',
      fill: '#ffffff',
      align: 'left',
      boundsAlignH: 'left',
      boundsAlignV: 'top',
    },
    text: `To join this planet and become a proud Alien, you must take the following oath:

Do you solemnly swear that you will support and defend the differences of all aliens of this planet, foreign and domestic;

that you will bear true faith and allegiance to the same;

that you will be open-minded to face the unknown; and that you will be proud of the alienness you and others have.`,
  } )

  const group = game.add.group()
  group.visible = false

  const width = game.world.width * widthFactor
  const height = game.world.height * heightFactor
  const textWidth = width - 2 * textMargin
  const textHeight = height - 2 * textMargin

  group.pivot.set( width / 2, height / 2 )

  const panel = game.add.graphics( 0, 0, group )
  panel.beginFill( panelColor )
  panel.drawRoundedRect( 0, 0, width, height, panelRadius )

  textStyle.wordWrap = true
  textStyle.wordWrapWidth = textWidth

  const textObj = game.add.text( textMargin, textMargin, text, textStyle, group )
  textObj.setTextBounds( 0, 0, textWidth, textHeight )

  group.showPos = { x, y }
  group.hidePos = { x, y: -panel.height / 2 }

  group.position.set( group.hidePos.x, group.hidePos.y )

  return group
}


function showOath () {
  currentScreen = 'oath'
  ui.disableButtons()
  ui.colorSelector.inputEnabled = false
  ui.oath.enabled = true

  ui.oath.timeline = new TimelineMax()
    .set( ui.oath, { visible: true } )
    .staggerTo( [ ui.previousHeadButton, ui.previousBodyButton ], 0.5, { x: -100, ease: Back.easeIn }, 0.1 )
    .staggerTo( [ ui.nextHeadButton, ui.nextBodyButton ], 0.5, { x: game.world.width + 100, ease: Back.easeIn }, 0.1, 0 )
    .staggerTo( [ ui.eyes[ 0 ], ui.eyes[ 1 ], ui.eyes[ 2 ] ], 0.25, { y: -110, ease: Back.easeIn }, 0.05, 0 )
    .staggerTo( [ ui.eyes[ 5 ], ui.eyes[ 4 ], ui.eyes[ 3 ] ], 0.25, { y: -110, ease: Back.easeIn }, 0.05, 0 )
    .to( ui.oath, 0.35, _.merge( ui.oath.showPos, { ease: Back.easeOut } ), 0.45 )
    .to( ui.randomButton, 0.5, { x: `-=${ game.world.width }`, angle: -720, ease: Power1.easeIn }, 0.2 )
    .to( ui.colorSelector.sprite, 0.5, { x: `-=${ game.world.width }`, angle: -180, ease: Power1.easeIn }, 0.2 )
    .to( ui.okButton, 0.5, { x: game.world.centerX + 100, angle: -360, ease: Power1.easeInOut }, 0.2 )
    .to( ui.cancelButton, 0.5, { x: game.world.centerX - 100, angle: -360, alpha: 1, ease: Power1.easeInOut }, 0.2 )
    .to( alien, 0.5, { y: 120, ease: Back.easeOut }, 0.3 )
    .to( alien.scale, 0.5, { x: 0.3, y: 0.3, ease: Power1.easeOut }, 0.3 )
    .call( () => ui.cancelButton.inputEnabled = true )
    .call( () => ui.okButton.inputEnabled = true )
}


function hideOath () {
  currentScreen = 'editor'
  ui.oath.timeline.reverse()
  ui.enableButtons()
  ui.colorSelector.inputEnabled = true
  ui.cancelButton.inputEnabled = false
  ui.oath.enabled = false
}


function makeTraits ( opt ) {
  const { x, y, widthFactor, heightFactor, panelRadius, panelColor, textMargin } = _.defaults( opt || {}, {
    x: 0,
    y: 0,
    widthFactor: 0.95,
    heightFactor: 0.62,
    panelRadius: 50,
    panelColor: 0x000000,
    textMargin: 50,
  } )

  const group = game.add.group()

  const width = game.world.width * widthFactor
  const height = game.world.height * heightFactor
  const textWidth = width - 2 * textMargin

  group.pivot.set( width / 2, height / 2 )

  const panel = game.add.graphics( 0, 0, group )
  panel.beginFill( panelColor )
  panel.drawRoundedRect( 0, 0, width, height, panelRadius )

  const textStyle = {
    font: 'BC Alphapipe, sans-serif',
    fontSize: '56px',
    fill: '#ffffff',
    align: 'left',
    boundsAlignH: 'left',
    boundsAlignV: 'top',
  }

  game.add.text( textMargin, textMargin, 'Please tell us two things that alienate you.', textStyle, group )
  game.add.text( textMargin, textMargin + 100, '1.', textStyle, group )

  const textField1 = new TextField( {
    game,
    parent: group,
    x: textMargin,
    y: textMargin + 180,
    width: textWidth,
    height: 240,
    multiLine: true,
    maxLength: traitMaxLength,
    edgeRadius: 30,
    borderThickness: 5,
    hidden: true,
    onChange: handleTextFieldChange,
  } )

  textField1.warning = makeTextWarning( { parent: group, x: textMargin + textWidth, y: textMargin + 100 } )

  game.add.text( textMargin, textMargin + 465, '2.', textStyle, group )

  const textField2 = new TextField( {
    game,
    parent: group,
    x: textMargin,
    y: textMargin + 540,
    width: textWidth,
    height: 240,
    multiLine: true,
    edgeRadius: 30,
    borderThickness: 5,
    hidden: true,
    onChange: handleTextFieldChange,
  } )

  textField2.warning = makeTextWarning( { parent: group, x: textMargin + textWidth, y: textMargin + 465 } )

  group.textFields = [ textField1, textField2 ]

  group.showPos = { x, y }
  group.hidePos1 = { x, y: game.world.height + panel.height / 2 }
  group.hidePos2 = { x, y: -panel.height / 2 }

  group.position.set( group.hidePos1.x, group.hidePos1.y )
  group.visible = false

  return group
}


function makeTextWarning ( opt ) {
  const { parent, x, y, textStyle } = _.defaults( opt || {}, {
    x: 0,
    y: 0,
    textStyle: {
      font: 'BC Alphapipe, sans-serif',
      fontSize: '56px',
      fill: '#f57e20',
      align: 'right',
      boundsAlignH: 'right',
      boundsAlignV: 'top',
    }
  } )

  const warning = game.add.text( x, y, '', textStyle, parent )
  warning.setTextBounds( 0, 0, 0, 0 )
  warning.alpha = 0
  warning.scale.set( 0 )

  warning.show = ( opt ) => {
    const { text } = opt

    if ( text !== undefined ) warning.text = text

    if ( warning.showTl !== undefined && warning.showTl.progress() < 1 ) return

    warning.showTl = new TimelineMax()
      .to( warning, { duration: 0.5, alpha: 1 }, 0 )
      .to( warning.scale, { duration: 0.5, x: 1, y: 1, ease: Back.easeOut }, 0 )
  }

  warning.hide = () => {
    if ( warning.hideTl !== undefined && warning.hideTl.progress() < 1 ) return
    warning.hideTl = new TimelineMax()
      .to( warning, { duration: 0.5, alpha: 0 }, 0 )
      .to( warning.scale, { duration: 0.5, x: 0, y: 0, ease: Back.easeIn }, 0 )
  }

  return warning
}


function handleTextFieldChange( textField ) {
  if ( textField.text.length > traitMaxLength - 1 ) {
    textField.warning.show( { text: `max ${ traitMaxLength } characters` } )
  } else {
    textField.warning.hide()
  }
}


function validateTextFields () {
  let valid = true

  for ( const textField of ui.traits.textFields ) {
    if ( textField.text.length === 0 || !textField.text.match( /\S/gm ) ) {
      textField.warning.show( { text: `enter text please` } )
      valid = false
    }
  }

  return valid
}


function showTraits () {
  currentScreen = 'traits'
  // for mobile devices we need to change the scaleMode on this screen, otherwise the soft keyboard messes with the canvas scaling
  const scaleFactorInversedX = game.scale.scaleFactorInversed.x
  const scaleFactorInversedY = game.scale.scaleFactorInversed.y
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
  game.scale.setUserScale( scaleFactorInversedX, scaleFactorInversedY, 0, 0 )
  ui.cancelButton.inputEnabled = false
  ui.okButton.inputEnabled = false
  ui.traits.textFields[ 0 ].show().setFadeOutText()
  ui.traits.textFields[ 1 ].show().setFadeOutText()

  new TimelineMax()
    .set( ui.traits, { visible: true } )
    .to( ui.oath, 0.75, _.extend( ui.oath.hidePos, { ease: Back.easeInOut } ), 0 )
    .to( ui.traits, 0.75, _.extend( ui.traits.showPos, { ease: Back.easeInOut } ), 0 )
    .call( () => ui.traits.textFields[ 0 ].setFadeInText(), null, 0.75 )
    .call( () => ui.traits.textFields[ 1 ].setFadeInText(), null, 0.75 )
    .call( () => ui.traits.textFields[ 0 ].focus(), null, 0.75 )
    .call( () => ui.cancelButton.inputEnabled = true )
    .call( () => ui.okButton.inputEnabled = true )
}


function hideTraits () {
  currentScreen = 'oath'

  ui.cancelButton.inputEnabled = false
  ui.okButton.inputEnabled = false

  new TimelineMax()
    .to( ui.traits, 0.75, _.extend( ui.traits.hidePos1, { ease: Back.easeInOut } ), 0 )
    .to( ui.oath, 0.75, _.extend( ui.oath.showPos, { ease: Back.easeInOut } ), 0 )
    .set( ui.traits, { visible: false }, 0.75 )
    .set( game.scale, { scaleMode: Phaser.ScaleManager.SHOW_ALL }, 0.75 )
    .call( () => ui.cancelButton.inputEnabled = true )
    .call( () => ui.okButton.inputEnabled = true )

  for ( const textField of ui.traits.textFields ) {
    textField.blur()
    textField.hideHtmlText()
  }
}


function makeNotice ( opt ) {
  const { parent, x, y, width, height, color, alpha, edgeRadius, padding, persistent, textStyle } = _.defaults( opt || {}, {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    color: 0x000000,
    alpha: 1,
    edgeRadius: 50,
    padding: 40,
    persistent: false,
    textStyle: {
      font: 'BC Alphapipe, sans-serif',
      fontSize: '56px',
      fill: '#ffffff',
      align: 'center',
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
    }
  } )

  const group = game.add.group( parent )
  group.position.set( x, y )
  group.origin = { x, y }
  group.alpha = 0
  group.scale.set( 0 )
  group.persistent = persistent

  const box = game.add.graphics( 0, 0, group )

  box.beginFill( color )
  box.drawRoundedRect( 0, 0, width, height, edgeRadius )
  box.alpha = alpha
  box.pivot.set( width / 2, height / 2 )

  const textWidth = width - 2 * padding
  const textHeight = height - 2 * padding
  textStyle.wordWrap = true
  textStyle.wordWrapWidth = textWidth

  const textObj = game.add.text( 0, 0, '', textStyle, group )
  textObj.setTextBounds( -textWidth / 2, -textHeight / 2, textWidth, textHeight )

  group.show = ( opt ) => {
    const { text, x, y, persistent } = _.defaults( opt || {}, {
      x: group.origin.x,
      y: group.origin.y,
      persistent: false,
    } )

    group.persistent = persistent

    if ( text !== undefined ) textObj.text = text

    group.position.set( x, y )

    new TimelineMax()
      .to( group, { duration: 0.5, alpha: 1 }, 0 )
      .to( group.scale, { duration: 0.5, x: 1, y: 1, ease: Back.easeOut }, 0 )
      .call( () => group.isShowing = true )
  }

  group.hide = () => {
    if ( !group.isShowing || group.persistent ) return

    group.isShowing = false

    new TimelineMax()
      .to( group, { duration: 0.5, alpha: 0 }, 0 )
      .to( group.scale, { duration: 0.5, x: 0, y: 0, ease: Back.easeIn }, 0 )
  }

  game.input.onDown.add( () => group.hide() )

  return group
}


function showResult () {
  currentScreen = 'result'

  // trait max length is already set for the text field, but just in case
  alien.dna.trait1 = ui.traits.textFields[ 0 ].text.substr( 0, traitMaxLength )
  alien.dna.trait2 = ui.traits.textFields[ 1 ].text.substr( 0, traitMaxLength )

  if ( useLocalStorage ) dnaToLocalStorage()

  alien.updateTraits()

  ui.cancelButton.inputEnabled = false
  ui.okButton.inputEnabled = false

  screenshots = {}

  const tl = new TimelineMax()
    .call( () => alien.stopAllBlinking() )
    .to( ui.traits, 0.75, _.extend( ui.traits.hidePos2, { ease: Back.easeInOut } ), 0 )
    .to( alien, 0.5, { y: alien.origin.y, ease: Back.easeIn }, 0 )
    .to( alien.scale, 0.5, { x: 1, y: 1, ease: Power1.easeIn }, 0 )
    .set( ui.traits, { visible: false }, 0.75 )
    .set( game.scale, { scaleMode: Phaser.ScaleManager.SHOW_ALL }, 0.75 )

  // here we need to take 3 screenshots: cropped transparent avatar, with white background, with white background and traits text
  // when all 3 are taken the data and images are sent to the server to be saved

  const scaleByWidth = alien.totalWidth / alien.totalHeight > imageExportWidth / imageExportHeight

  // scale the avatar to the defined maximum imageExportWidth and imageExportHeight, keeping aspect ratio
  const outputWidth = scaleByWidth ? imageExportWidth : alien.totalWidth * ( imageExportHeight / alien.totalHeight )
  const outputHeight = scaleByWidth ? alien.totalHeight * ( imageExportWidth / alien.totalWidth ) : imageExportHeight

  // cropped transparent image
  tl.call( () => takeScreenshot( {
    x: alien.left,
    y: alien.top,
    width: alien.totalWidth,
    height: alien.totalHeight,
    outputWidth,
    outputHeight,
    onComplete: ( image ) => {
      screenshots.avatar = image
      background.visible = true
      requestAnimationFrame( () => {

        // white background, no text
        takeScreenshot( {
          x: game.world.width / 6,
          y: game.world.height / 4.5,
          width: game.world.width / 1.5, // this should be a square (calculate width/height as with the avatar above if this should change)
          height: game.world.width / 1.5, // this should be a square
          outputWidth: imageExportWidth,
          outputHeight: imageExportHeight,
          onComplete: ( image ) => {
            screenshots.alien = image

            alien.showTraits( {
              onComplete: () => {
                // white background, with text
                takeScreenshot( {
                  x: 0,
                  y: game.world.height / 40,
                  width: game.world.width,  // this should be a square
                  height: game.world.width,  // this should be a square
                  outputWidth: imageExportWidth, // game.world.width / 1.5,
                  outputHeight: imageExportHeight, // game.world.width / 1.5,
                  onComplete: ( image ) => {
                    screenshots.traits = image

                    // back to normal
                    background.visible = false
                    alien.resumeAllBlinking()

                    // enable buttons after all screenshots are taken
                    ui.cancelButton.inputEnabled = true
                    ui.okButton.inputEnabled = true
                  }
                } )
            } } )
          },
        } )
      } )

    },
  } ) )

  for ( const textField of ui.traits.textFields ) {
    textField.blur()
    textField.hideHtmlText()
  }
}


function hideResult () {
  currentScreen = 'traits'

  ui.cancelButton.inputEnabled = false
  ui.okButton.inputEnabled = false

  alien.hideTraits()

  const scaleFactorInversedX = game.scale.scaleFactorInversed.x
  const scaleFactorInversedY = game.scale.scaleFactorInversed.y
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
  game.scale.setUserScale( scaleFactorInversedX, scaleFactorInversedY, 0, 0 )

  new TimelineMax()
    .set( ui.traits, { visible: true } )
    .to( ui.traits, 0.75, _.extend( ui.traits.showPos, { ease: Back.easeInOut } ), 0 )
    .to( alien, 0.5, { y: 120, ease: Back.easeOut }, 0 )
    .to( alien.scale, 0.5, { x: 0.3, y: 0.3, ease: Power1.easeOut }, 0 )
    .call( () => ui.traits.textFields[ 0 ].setFadeInText(), null, 0.75 )
    .call( () => ui.traits.textFields[ 1 ].setFadeInText(), null, 0.75 )
    .call( () => ui.cancelButton.inputEnabled = true )
    .call( () => ui.okButton.inputEnabled = true )
}


function showComplete () {
  const textStyle = {
    font: 'BC Alphapipe, sans-serif',
    fontSize: '56px',
    fill: '#ffffff',
    align: 'center',
    boundsAlignH: 'center',
    boundsAlignV: 'top',
  }

  currentScreen = 'complete'

  planet = new Planet( { game, parent: game.world, x: game.world.centerX } )
  planet.y = game.world.centerY + planet.height
  game.world.setChildIndex( planet, 1 )

  ui.cancelButton.inputEnabled = false
  ui.okButton.inputEnabled = false

  const text = 'Integrating alien into community.\nPlease be patient.'
  planet.text = game.add.text( 0, 400, text, textStyle, planet )
  planet.text.setTextBounds( 0, 0, 0, 0 )
  planet.text.alpha = 0

  const alienScale = 0
  const brightness = { value: 1 }

  completeTimeline = new TimelineMax( { paused: true } )
    .to( ui.cancelButton, { duration: 0.5, x: -ui.cancelButton.width, angle: -360, ease: Power1.easeIn }, 0 )
    .to( ui.okButton, { duration: 0.5, x: game.world.width + ui.okButton.width, angle: 360, ease: Power1.easeIn }, 0 )
    .to( brightness, {
      duration: 1, value: 0, onUpdate: ( () => {
        const rgbValue = Math.round( brightness.value * 255 )
        const color = Phaser.Color.RGBtoString( rgbValue, rgbValue, rgbValue )
        $( 'body' ).css( 'backgroundColor', color )
      } )
    }, 0.25 )
    .to( planet, { duration: 1, y: game.world.height / 2, ease: Back.easeOut }, 0.25 )
    .to( alien.scale, { duration: 1, x: alienScale, y: alienScale }, 0.25 )
    .to( planet.text, { duration: 1, alpha: 1 } )

  alien.hideTraits( {
    onComplete: () => completeTimeline.play()
  } )

  save( { images: screenshots } )
}


function goToAliens () {
  const tl = new TimelineMax( { paused: true } )
  .to( planet.text, { duration: 0.5, alpha: 0 } )
  .to( planet, { duration: 0.5, alpha: 0 }, 0.5 )
  .to( planet.scale, { duration: 0.5, x: 0, y: 0 }, 0.5 )
  .call( () => window.location.href = aliensURL )

  if ( completeTimeline.progress() === 1 ) {
    tl.play()
  } else {
    completeTimeline.call( () => tl.play() )
  }
}


function save ( { images } ) {
  const data = {
    body: alien.dna.bodyID,
    head: alien.dna.headID,
    color: alien.dna.color,
    trait1: alien.dna.trait1,
    trait2: alien.dna.trait2,
    eyes: JSON.stringify( _.map( alien.dna.eyes, ( eye ) => _.pick( eye, [ 'index', 'x', 'y' ] ) ) ),
    imageAvatar: images.avatar,
    image: images.alien,
    imageTraits: images.traits,
  }

  console.log( 'SAVING …' )
  // TO DO: add a saving visualisation

  $.ajax( {
    type: 'POST',
    url: 'save',
    data,
  } ).done( function ( response ) {
    const responseObj = JSON.parse( response )
    console.log( 'SAVING COMPLETE, SERVER RESPONSE:', responseObj )

    if ( responseObj.success ) {
      // alien.logDNA()
      goToAliens()
    } else {
      notice.show( { text: 'Oops. We encountered an error.\nThe alien could not be saved.\nPlease reload the page\nto try again.', y: alien.y + 150, persistent: true } )
    }
  } )
}


// x, y, width and height are the crop area
// if defined outputWidth and outputHeight are the resulting output size (this scales the image)
function takeScreenshot ( opt ) {
  const { x, y, width, height, outputWidth, outputHeight, mimeType, onComplete } = _.defaults( opt || {}, {
    x: 0,
    y: 0,
    width: game.world.width,
    height: game.world.height,
    outputWidth: opt.width || game.world.width,
    outputHeight: opt.height || game.world.height,
    // mimeType: 'image/octet-stream', // if downloading the image we need image/octet-stream , but that's not good for saving it
  } )

  const screenshot = new Image

  screenshot.onload = () => {
    // crop the image in a new temporary canvas
    const tempCanvas = document.createElement( 'canvas' )
    const context = tempCanvas.getContext( '2d' )
    tempCanvas.width = outputWidth
    tempCanvas.height = outputHeight
    context.drawImage( screenshot, x, y, width, height, 0, 0, outputWidth, outputHeight )
    // for some reason the .replace() on the next line has to happen right after .toDataURL() or it won't take any effect; maybe because it's not instant to create the dataURL?
    const dataURL = mimeType == undefined ? tempCanvas.toDataURL() : tempCanvas.toDataURL().replace( 'image/png', mimeType )
    if ( onComplete !== undefined ) onComplete( dataURL )
  }

  screenshot.src = game.canvas.toDataURL( 'image/png' )
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
      switch ( currentScreen ) {
        case 'editor': {
          if ( !alien.hasEyes() ) {
            notice.show( { text: 'This alien needs some eyes.\nDrag them onto the body.' } )
          } else {
            showOath()
          }
          break
        }
        case 'oath': {
          showTraits()
          break
        }
        case 'traits': {
          if ( validateTextFields() ) showResult()
          break
        }
        case 'result': {
          showComplete()
          break
        }
      }
      break
    }
    case 'cancel': {
      switch ( currentScreen ) {
        case 'oath': {
          hideOath()
          break
        }
        case 'traits': {
          hideTraits()
          break
        }
        case 'result': {
          hideResult()
          break
        }
      }
      break
    }
  }
}


function update () {
}
