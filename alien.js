// TO DO:
// - I can probably get rid of scaleToFit

const { delayedCall } = gsap

const HEAD = 'head'
const BODY = 'body'
const EYE = 'eye'
const EYEBALL = 'eyeball'
const IRIS = 'iris'
const EYE_CLOSED = 'eyeClosed'

const bodyPartProps = {
  heads: [
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.3, neckHeight: 0.1, combinations: { body3: { anchorX: 0.49, anchorY: 0.8 } } }, // 0
    { anchorX: 0.5, anchorY: 0.84, neckWidth: 0.4, neckHeight: 0.05 }, // 1
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.5, neckHeight: 0.05 }, // 2
    { anchorX: 0.5, anchorY: 0.85, neckWidth: 0.3, neckHeight: 0.05 }, // 3
    { anchorX: 0.49, anchorY: 0.73, neckWidth: 0.3, neckHeight: 0.1 }, // 4
    { anchorX: 0.5, anchorY: 0.8, neckWidth: 0.5, neckHeight: 0.15 }, // 5
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.6, neckHeight: 0.05 }, // 6
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.6, neckHeight: 0.07 }, // 7
    { anchorX: 0.5, anchorY: 0.7, neckWidth: 0, neckHeight: 0 }, // 8
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 1, neckHeight: 0.05 }, // 9
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.3, neckHeight: 0.05 }, // 10
    { anchorX: 0.49, anchorY: 0.88, neckWidth: 0.4, neckHeight: 0.05 }, // 11
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.5, neckHeight: 0.1 }, // 12
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.5, neckHeight: 0.05 }, // 13
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.5, neckHeight: 0.05 }, // 14
  ],
  bodies: [
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.4 }, // 0
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.6 }, // 1
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.6 }, // 2
    { anchorX: 0.52, anchorY: 0, neckWidth: 0.8 }, // 3
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.5 }, // 4
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.6 }, // 5
    { anchorX: 0.65, anchorY: 0, neckWidth: 0.3 }, // 6
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.8 }, // 7
  ],
  eyeballs: [
    { anchorX: 0.5, anchorY: 0.5 }, // 0
    { anchorX: 0.5, anchorY: 0 }, // 1
  ],
  irises: [
    { anchorX: 0.5, anchorY: 0.5 }, // 0
    { anchorX: 0.5, anchorY: -0.35 }, // 1
  ],
  eyesClosed: [
    { anchorX: 0.5, anchorY: 0 }, // 0
    { anchorX: 0.5, anchorY: 0 }, // 1
  ],
}


export default class Alien {

  constructor( opt ) {
    const { game, parent, x, y, mutable, validColors, dna, groundY, onMake } = _.defaults( opt, {
      x: 0,
      y: 0,
      mutable: false,
      groundY: 0.7,
    } )

    this.game = game
    this.validColors = validColors
    this.groundY = groundY
    this.dna = {}
    this.onMake = onMake

    this.group = this.game.add.group( parent )
    this.group.position.set( x, y )

    this.bodies = this.makeItems( { parent: this.group, type: BODY, props: bodyPartProps.bodies } )
    this.heads = this.makeItems( { parent: this.group, type: HEAD, props: bodyPartProps.heads } )
    this.eyes = this.makeEyes( { parent: this.group, props: bodyPartProps.eyeballs } )

    this.mapping = {
      body: this.bodies,
      head: this.heads,
      eye: this.eyes,
    }

    this.randomize( { logDNA: false } )
    this.make( dna )
  }


  sampleArrayIndex ( array ) {
    return _.sample( _.range( array.length ) )
  }


  randomize ( opt = {} ) {
    const { logDNA } = opt

    const bodyID = this.sampleArrayIndex( this.bodies )
    const headID = this.sampleArrayIndex( this.heads )
    const eyeID = this.sampleArrayIndex( this.eyes )
    const color = this.getRandomColor()

    this.make( { bodyID, headID, eyeID, color, logDNA } )
  }


  getRandomColor () {
    return this.validColors !== undefined ? _.sample( this.validColors ).color : _.random( 0, 0xffffff )
  }


  make ( dna = {} ) {
    const { bodyID, headID, eyeID, color, blink, positionOnGround, logDNA } = _.defaults( dna, {
      bodyID: this.dna.bodyID,
      headID: this.dna.headID,
      eyeID: this.dna.eyeID,
      color: this.dna.color,
      blink: true,
      positionOnGround: true,
      logDNA: true,
    } )

    const isNewEye = eyeID !== this.dna.eyeID

    if ( isNewEye ) this.stopAllBlinking()

    const body = this.showItem( { type: BODY, id: bodyID, combinationID: `${ HEAD }${ headID }` } )
    const head = this.showItem( { type: HEAD, id: headID, combinationID: `${ BODY }${ bodyID }` } )

    if ( this.neck !== undefined ) this.neck.destroy()
    const width = Math.min( head.neckWidth * head.width, body.neckWidth * body.width )
    const height = head.neckHeight * head.height
    this.neck = this.makeNeck( { width, height } )
    this.neck.y = head.height - head.height * head.anchor.y

    head.addChild( this.neck )

    const eye = this.showItem( { type: EYE, id: eyeID } )

    if ( head.scaleToFit ) {
      const scale = width / head.width
      head.scale.set( scale )
      eye.scale.set( 1 / scale )
    }

    this.setEye()

    this.tint( { color } )

    if ( positionOnGround ) this.group.y = this.game.world.height * this.groundY - body.height + body.height * body.anchor.y

    if ( blink && isNewEye ) eye.startBlinking()

    if ( this.onMake !== undefined ) this.onMake( { dna: this.dna } )

    if ( logDNA ) this.logDNA()
  }


  tint ( opt = {} ) {
    const { color } = _.defaults( opt, {
      color: 0xffffff,
    } )

    this.body.tint = color
    this.head.tint = color
    this.eye.iris.tint = ( color > 0xfafafa ) ? 0x000000 : color
    this.neck.tint = color
    this.dna.color = color
  }


  setEye () {
    this.head.addChild( this.eye )
    this.eye.y = -this.head.anchor.y * this.head.height + this.head.height / 2
  }


  makeNeck ( opt = {} ) {
    const { width, height } = _.defaults( opt, {
      width: 0,
      height: 50,
    } )

    const graphics = this.game.add.graphics( width, height )
    graphics.beginFill( 0xffffff )
    graphics.drawRect( -width * 1.5, -height, width, height )

    return graphics
  }


  setColor ( opt = {} ) {
    const { color } = _.defaults( opt, {
      color: this.dna.color === undefined ? 0xffffff : this.dna.color,
    } )

    this.make( { color } )
  }


  showItem ( { type, id, combinationID } ) {
    for ( const item of this.mapping[ type ] ) {
      item.visible = false
    }

    const item = this.mapping[ type ][ id ]

    // check for special combinations and adjust props
    if ( item.defaultProps !== undefined && item.defaultProps.combinations !== undefined && item.defaultProps.combinations[ combinationID ] !== undefined ) {
      const props = _.merge( _.clone( item.defaultProps ), item.defaultProps.combinations[ combinationID ] )
      this.setItemProps( { item, props } )
      console.log( 'SPECIAL PROPS' )
    } else if ( item.defaultProps !== undefined ) {
      this.setItemProps( { item } )
    }

    item.visible = true
    item.scale.set( 1 )
    this.dna[ `${ type }ID` ] = id

    return item
  }


  setItemProps ( { item, props } ) {
    const { anchorX, anchorY, neckWidth, neckHeight, scaleToFit } = props || item.defaultProps

    item.anchor.set( anchorX, anchorY )
    item.neckWidth = neckWidth
    item.neckHeight = neckHeight
    item.scaleToFit = scaleToFit || false
  }


  makeItems ( { parent, type, props } ) {
    const items = []

    props.forEach( ( prop, i ) => {
      const item = this.game.add.sprite( 0, 0, 'assets', `${ type }${ i }`, parent )
      item.defaultProps = prop
      this.setItemProps( { item } )
      items.push( item )
    } )

    return items
  }


  makeEyes ( { parent, props } ) {
    const eyes = []
    const eyeballs = this.makeItems( { type: EYEBALL, props } )
    const irises = this.makeItems( { type: IRIS, props: bodyPartProps.irises } )
    const eyesClosed = this.makeItems( { type: EYE_CLOSED, props: bodyPartProps.eyesClosed } )

    props.forEach( ( prop, i ) => {
      const eye = this.game.add.group( parent )
      eye.eyeball = eyeballs[ i ]
      eye.iris = irises[ i ]
      eye.closed = eyesClosed[ i ]
      eye.closingFrame = `eyeClosing${ i }`
      eye.closedFrame = `eyeClosed${ i }`
      eye.add( eyeballs[ i ] )
      eye.add( irises[ i ] )
      eye.add( eyesClosed[ i ] )

      eye.startBlinking = () => this.startBlinking( { eye } )
      eye.stopBlinking = () => this.stopBlinking( { eye } )
      eye.open = () => this.openEye( { eye } )
      eye.close = () => this.closeEye( { eye } )
      eye.reset = () => this.resetEye( { eye } )

      eye.reset()

      eyes.push( eye )
    } )

    return eyes
  }


  get body () {
    return this.bodies[ this.dna.bodyID ]
  }


  get head () {
    return this.heads[ this.dna.headID ]
  }


  get eye () {
    return this.eyes[ this.dna.eyeID ]
  }


  showNextItem ( { type } ) {
    const id = this.mapping[ type ][ ++this.dna[ `${ type }ID` ] ] === undefined ? 0 : this.dna[ `${ type }ID` ]
    const dna = { [ `${ type }ID` ]: id }
    this.make( dna )
  }


  showPreviousItem ( { type } ) {
    const id = this.mapping[ type ][ --this.dna[ `${ type }ID` ] ] === undefined ? this.mapping[ type ].length - 1 : this.dna[ `${ type }ID` ]
    const dna = { [ `${ type }ID` ]: id }
    this.make( dna )
  }


  startBlinking ( opt = {} ) {
    const { eye, minInterval, maxInterval, closeDuration } = _.defaults( opt, {
      minInterval: 2,
      maxInterval: 4,
      closeDuration: 0.4,
    } )

    const interval = Math.max( closeDuration, _.random( minInterval, maxInterval, true ) )

    eye.blinkTL = new TimelineMax( { repeat: -1, delay: interval } )
    eye.blinkTL.call( eye.close )
    eye.blinkTL.call( eye.open, null, closeDuration )
    eye.blinkTL.to( {}, interval, {} )
  }


  stopBlinking ( { eye } ) {
    if ( eye.blinkTL !== undefined ) eye.blinkTL.kill()
    eye.reset()
  }


  stopAllBlinking () {
    for ( const eye of this.eyes ) {
      eye.stopBlinking()
    }
  }


  closeEye ( { eye } ) {
    eye.closed.frameName = eye.closingFrame
    eye.closed.visible = true
    eye.eyeball.visible = false
    eye.iris.visible = false

    delayedCall( 0.03, () => eye.closed.frameName = eye.closedFrame )
  }


  openEye ( { eye } ) {
    eye.closed.frameName = eye.closingFrame
    eye.closed.visible = true
    eye.eyeball.visible = false
    eye.iris.visible = false

    delayedCall( 0.03, () => {
      eye.closed.visible = false
      eye.eyeball.visible = true
      eye.iris.visible = true
    } )
  }


  resetEye ( { eye } ) {
    eye.closed.visible = false
    eye.eyeball.visible = true
    eye.iris.visible = true
  }


  logDNA () {
    console.log( 'ALIEN DNA:', this.dna )
  }

}