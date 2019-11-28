// NOTES:
// - I think makeValidHslColors() and especially getNearestHslColor() was an interesting thing to do
//   and I may use this in another project, but I think if I want to redo the colour picker
//   I rather write a HSL picker that is generated by code and selects colours by angle and distance
//   to the center. For now reading the bitmap pixel colour works fine but isn't ideal because
//   of antialiasing where two colours meet. But it's super flexible because you can just swap out
//   the colour picker image.

// TO DO:
// - alien heads and bodies need some anchor info
// - alien heads and bodies need info how wide the connecting gap can be;
//   the smaller value will be selected when combining them
// - eyes need to be draggable (and only onto the body, maybe I need a
//   second inner shape and eyes can only drop if inside of that shape)
// - draggable eyes should not overlap each other
// - as an alternative just select type/s and number of eyes, like UI with
// - <full eye > + | - <half eye> + , but I think I prefer draggables
// - still, for the random generator we need a way to automatically place eyes,
//   ideally with a random placement on the shape with validation as user drag and drop;
//   maybe a while loop that picks random positions within the body part bounds and places
//   the eye as long as it does not collide with other eyes; but limit the number of loops
//   because it's possible that there's just no space left, and I don't think there's a
//   simple way to check that
// - eyes on the body should be permitted, however, the random generator should prioritise
//   to place them on the head
// - save as an image on the server
// - save user info in the database
//   alien table: ( id, timestamp, name, 2 traits, dna: headID, bodyID, color)
// - eyes table (links to aliens table via id): ( id, alienID, eyeID, x, y, scale? )

const game = new Phaser.Game( 1200, 1200, Phaser.CANVAS, '', { preload: preload, create: create, update: update } )

let alien
let bodies
let heads
let eyes
let mapping
let colorSelector
let validHslColors
let validColors
const dna = {}


function preload () {
  game.load.atlas( 'assets', 'assets/assets.png', 'assets/assets.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH )
}


function create () {
  console.log( 'GAME', game )

  const numHeads = 15
  const numBodies = 8
  const numEyes = 2
  const alienOffsetY = -80

  game.input.maxPointers = 1
  game.stage.backgroundColor = 0xffffff
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  game.scale.parentIsWindow = true

  alien = game.add.group()
  alien.position.set( game.world.centerX, game.world.centerY + alienOffsetY )

  bodies = makeItems( { parent: alien, type: 'body', num: numBodies, anchorX: 0.5, anchorY: 0, visible: false } )
  heads = makeItems( { parent: alien, type: 'head', num: numHeads, anchorX: 0.5, anchorY: 1, visible: false } )
  eyes = makeEyes( { parent: alien, num: numEyes } )

  mapping = {
    body: bodies,
    head: heads,
    eye: eyes,
  }

  validHslColors = makeValidHslColors()
  validColors = _.map( validHslColors, ( hsl ) => Phaser.Color.HSLtoRGB( hsl.s, hsl.s, hsl.l ) )

  const ui = makeUI( { previousNextButtonOffsetY: alienOffsetY } )

  game.input.keyboard.addKey( Phaser.Keyboard.DOWN ).onDown.add( () => showPreviousItem( { type: 'body' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.UP ).onDown.add( () => showNextItem( { type: 'body' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.LEFT ).onDown.add( () => showPreviousItem( { type: 'head' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.RIGHT ).onDown.add( () => showNextItem( { type: 'head' } ) )
  game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR ).onDown.add( makeRandomAlien )

  makeRandomAlien()
}


function makeUI ( opt = {} ) {
  const { edgeMargin, headYPosFactor, bodyYPosFactor, previousNextButtonOffsetY, randomXPosFactor, doneXPosFactor } = _.defaults( opt, {
    edgeMargin: 30,
    headYPosFactor: 0.4,
    bodyYPosFactor: 0.6,
    previousNextButtonOffsetY: 0,
  } )

  const group = game.add.group()
  const bounds = game.world.bounds

  // const validHslColors = makeValidHslColors()
  // colorSelector = makeColorSelector( { parent: group, validHslColors } )
  colorSelector = makeColorSelector( { parent: group } )
  colorSelector.sprite.position.set( bounds.centerX, bounds.bottom - colorSelector.height / 2 - edgeMargin )

  const random = game.add.button( 0, 0, 'assets', makeRandomAlien, this, 'uiRandom-over', 'uiRandom', 'uiRandomDown', 'uiRandom', group )
  random.anchor.set( 0.5, 0.5 )
  random.position.set( bounds.left + random.width / 2 + edgeMargin, colorSelector.sprite.y  )
  group.randomButton = random

  const done = game.add.button( 0, 0, 'assets', () => window.alert( 'I can\'t do that yet.' ), this, 'uiDoneOver', 'uiDone', 'uiDoneDown', 'uiDone', group )
  done.anchor.set( 0.5, 0.5 )
  done.position.set( bounds.right - done.width / 2 - edgeMargin, colorSelector.sprite.y )
  group.doneButton = done

  const previousHead = game.add.button( 0, 0, 'assets', () => showPreviousItem( { type: 'head' } ), this, 'uiPreviousOver', 'uiPrevious', 'uiPreviousDown', 'uiPrevious', group )
  previousHead.anchor.set( 0.5, 0.5 )
  previousHead.position.set( bounds.left + random.width / 2 + edgeMargin, bounds.height * headYPosFactor + previousNextButtonOffsetY )
  group.previousHeadButton = previousHead

  const previousBody = game.add.button( 0, 0, 'assets', () => showPreviousItem( { type: 'body' } ), this, 'uiPreviousOver', 'uiPrevious', 'uiPreviousDown', 'uiPrevious', group )
  previousBody.anchor.set( 0.5, 0.5 )
  previousBody.position.set( bounds.left + random.width / 2 + edgeMargin, bounds.height * bodyYPosFactor + previousNextButtonOffsetY )
  group.previousBodyButton = previousBody

  const nextHead = game.add.button( 0, 0, 'assets', () => showNextItem( { type: 'head' } ), this, 'uiNextOver', 'uiNext', 'uiNextDown', 'uiNext', group )
  nextHead.anchor.set( 0.5, 0.5 )
  nextHead.position.set( bounds.right - random.width / 2 - edgeMargin, bounds.height * headYPosFactor + previousNextButtonOffsetY )
  group.nextHeadButton = nextHead

  const nextBody = game.add.button( 0, 0, 'assets', () => showNextItem( { type: 'body' } ), this, 'uiNextOver', 'uiNext', 'uiNextDown', 'uiNext', group )
  nextBody.anchor.set( 0.5, 0.5 )
  nextBody.position.set( bounds.right - random.width / 2 - edgeMargin, bounds.height * bodyYPosFactor + previousNextButtonOffsetY )
  group.nextButton = nextBody

  return group
}


function getRandomItemID ( { items } ) {
  return _.sample( _.range( items.length ) )
}


function makeRandomAlien () {
  const bodyID = getRandomItemID( { items: bodies } )
  const headID = getRandomItemID( { items: heads } )
  const eyeID = getRandomItemID( { items: eyes } )
  const color = getRandomColor()
  makeAlien( { bodyID, headID, eyeID, color } )
}


function getRandomColor () {
  return validColors !== undefined ? _.sample( validColors ).color : _.random( 0, 0xffffff )
}


function makeAlien ( opt = {} ) {
  const { bodyID, headID, eyeID, color } = _.defaults( opt, {
    color: 0xffffff,
  } )

  showItem( { type: 'body', id: bodyID } )
  showItem( { type: 'head', id: headID } )
  showItem( { type: 'eye', id: eyeID } )
  positionEye()
  setColor( { color } )
}


function setColor ( opt = {} ) {
  const { color } = _.defaults( opt, {
    color: dna.color === undefined ? 0xffffff : dna.color,
  } )

  getBody().tint = color
  getHead().tint = color
  getEye().iris.tint = ( color > 0xf8f8f8 ) ? 0x000000 : color // TO DO: set this to color === 0xffffff when color limitations are implemented
  dna.color = color
  logDNA()
}


function showItem ( { type, id } ) {
  for ( const item of mapping[ type ] ) {
    item.visible = false
  }

  const item = mapping[ type ][ id ]
  item.visible = true
  dna[ `${ type }ID` ] = id
}


function makeItems ( { parent, type, num, anchorX, anchorY } ) {
  const items = []

  for ( const i of _.range( num ) ) {
    const item = game.add.sprite( 0, 0, 'assets', `${ type }${ i }`, parent )
    item.anchor.set( anchorX, anchorY )
    items.push( item )
  }

  return items
}


function makeEyes ( { parent, num } ) {
  const eyes = []
  const eyeballs = makeItems( { type: 'eyeball', num, anchorX: 0.5, anchorY: 0.5 } )
  const irises = makeItems( { type: 'iris', num, anchorX: 0.5, anchorY: 0.5 } )

  for ( const i of _.range( num ) ) {
    const eye = game.add.group( parent )
    eye.eyeball = eyeballs[ i ]
    eye.iris = irises[ i ]
    eye.add( eyeballs[ i ] )
    eye.add( irises[ i ] )
    eyes.push( eye )
  }

  return eyes
}


function getBody () {
  return bodies[ dna.bodyID ]
}


function getHead () {
  return heads[ dna.headID ]
}



function getEye () {
  return eyes[ dna.eyeID ]
}


function positionEye () {
  getEye().y = -getHead().height / 2
}


function showNextItem ( { type } ) {
  const id = mapping[ type ][ ++dna[ `${ type }ID` ] ] === undefined ? 0 : dna[ `${ type }ID` ]
  showItem( { type, id } )
  setColor()
  positionEye()
  logDNA()
}


function showPreviousItem ( { type } ) {
  const id = mapping[ type ][ --dna[ `${ type }ID` ] ] === undefined ? mapping[ type ].length - 1 : dna[ `${ type }ID` ]
  showItem( { type, id } )
  setColor()
  positionEye()
  logDNA()
}


function makeColorSelector ( opt = {} ) {
  const { parent, x, y, validHslColors } = _.defaults( opt, {
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
  return bmd

  function getColor ( pointer ) {
    const { x, y } = pointer

    const posX = Math.round( x - sprite.x + sprite.anchor.x * sprite.width )
    const posY = Math.round( y - sprite.y + sprite.anchor.y * sprite.height )

    if ( pointer.isDown && posX >= 0 && posX <= bmd.width && posY >= 0 && posY <= bmd.height ) {
      const rgb = bmd.getPixelRGB( posX, posY )

      let color

      if ( validHslColors !== undefined ) {
        const hsl = Phaser.Color.RGBtoHSL( rgb.r, rgb.g, rgb.b )
        const validHsl = getNearestHslColor( { targetColor: hsl, colors: validHslColors } )
        const validRGB = Phaser.Color.HSLtoRGB( validHsl.h, validHsl.s, validHsl.l )
        color = validRGB.color
      } else {
        color = Phaser.Color.getColor( rgb.r, rgb.g, rgb.b )
      }

      if ( rgb.a === 255 && color !== dna.color ) {
        setColor( { color } )
      }
    }
  }
}


function getNearestHslColor ( opt ) {
  let { colors } = opt
  const { targetColor, priorities } = _.defaults( opt, {
    priorities: [ 'h', 'l', 's' ] // order that colors are filtered by
  } )

  const reducers = {
    h: () => {
      const hues = _.uniq( _.map( colors, 'h' ) )
      const h = getNearestValue( { target: targetColor.h, array: hues } )
      return _.filter( colors, { h } )
    },
    s: () => {
      const saturations = _.uniq( _.map( colors, 's' ) )
      const s = getNearestValue( { target: targetColor.s, array: saturations } )
      return _.filter( colors, { s } )
    },
    l: () => {
      const luminosities = _.uniq( _.map( colors, 'l' ) )
      const l = getNearestValue( { target: targetColor.l, array: luminosities } )
      return _.filter( colors, { l } )
    },
  }

  for ( const priority of priorities ) {
    colors = reducers[ priority ]()
  }

  return _.first( colors )
}


function getNearestValue ( { target, array } ) {
  return array.reduce( ( prev, curr ) => Math.abs( curr - target ) < Math.abs( prev - target ) ? curr : prev )
}


function makeValidHslColors ( opt = {} ) {
  const {
    hueSteps, saturationSteps, luminositySteps,
    hueMin, hueMax, hueEase,
    saturationMin, saturationMax, saturationEase,
    luminosityMin, luminosityMax, luminosityEase,
    extraColors,
  } = _.defaults( opt, {
    hueSteps: 24,
    hueMin: 0,
    hueMax: 1,
    hueEase: Linear.easeNone,
    saturationSteps: 7,
    saturationMin: 0.5,
    saturationMax: 0.85,
    saturationEase: Linear.easeNone,
    luminositySteps: 7,
    luminosityMin: 0.4,
    luminosityMax: 0.85,
    luminosityEase: Linear.easeNone,
    extraColors: [ 0x000000, 0xffffff ],
  } )

  const luminositySaturationSteps = Math.max( luminositySteps, saturationSteps )

  const extraHslColors = _.map( extraColors, ( color ) => {
    const rgb = Phaser.Color.getRGB( color )
    const hsl = Phaser.Color.RGBtoHSL( rgb.r, rgb.g, rgb.b )
    return hsl
  } )

  const colors = extraHslColors || []

  let i = 0

  for ( const hueStep of _.range( hueSteps ) ) {
    const h = hueMin + Math.abs( hueMax - hueMin ) * hueEase( ( hueStep / hueSteps ) )

    for ( const luminositySaturationStep of _.range( luminositySaturationSteps ) ) {
      const s = saturationMin + Math.abs( saturationMax - saturationMin ) * saturationEase( luminositySaturationStep / luminositySaturationSteps )
      const l = luminosityMin + Math.abs( luminosityMax - luminosityMin ) * luminosityEase( luminositySaturationStep / luminositySaturationSteps )

      const rgb = Phaser.Color.HSLtoRGB( h, s, l )
      const color = _.merge( rgb, { h, s, l } )
      colors.push( color )

      console.log( color )

      // temp dev: print color
      const colorString = Phaser.Color.RGBtoString( rgb.r, rgb.g, rgb.b )
      console.log( `%c ${ i++ }: ${ h }, ${ s }, ${ l }, ${ rgb.color }`, `background: ${ colorString }; color: #000000` )
    }
  }

  // return colors.sort( ( a, b ) => a - b )
  return colors
}


function logDNA () {
  console.log( 'ALIEN DNA:', dna )
}

function update() {
}
