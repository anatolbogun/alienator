const HEAD = 'head'
const BODY = 'body'
const EYE = 'eye'
const EYEBALL = 'eyeball'
const IRIS = 'iris'

const bodyPartProps = {
  heads: [
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.3 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.4 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.5 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.3 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.3 },
    { anchorX: 0.5, anchorY: 0.8, neckWidth: 0.5 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.6 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.6 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 1 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.3 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.4 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.6 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.5 },
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.5 },
  ],
  bodies: [
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.4 },
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.6 },
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.6 },
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.8 },
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.5 },
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.6 },
    { anchorX: 0.65, anchorY: 0, neckWidth: 0.3 },
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.8 },
  ],
  eyeballs: [
    { anchorX: 0.5, anchorY: 0.5 },
    { anchorX: 0.5, anchorY: 0 },
  ],
  irises: [
    { anchorX: 0.5, anchorY: 0.5 },
    { anchorX: 0.5, anchorY: -0.35 },
  ]
}


export default class Alien {

  constructor( opt ) {
    const { game, parent, x, y, mutable, validColors } = _.defaults( opt, {
      x: 0,
      y: 0,
      mutable: false,
    } )

    this.game = game
    this.validColors = validColors
    this.dna = {}

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
  }


  sampleArrayIndex ( array ) {
    return _.sample( _.range( array.length ) )
  }


  randomize () {
    const bodyID = this.sampleArrayIndex( this.bodies )
    const headID = this.sampleArrayIndex( this.heads )
    const eyeID = this.sampleArrayIndex( this.eyes )
    const color = this.getRandomColor()
    this.make( { bodyID, headID, eyeID, color } )
  }


  getRandomColor () {
    return this.validColors !== undefined ? _.sample( this.validColors ).color : _.random( 0, 0xffffff )
  }


  make ( opt = {} ) {
    const { bodyID, headID, eyeID, color } = _.defaults( opt, {
      color: 0xffffff,
    } )

    const body = this.showItem( { type: BODY, id: bodyID } )
    const head = this.showItem( { type: HEAD, id: headID } )

    if ( this.neck !== undefined ) this.neck.destroy()

    const width = Math.min( head.neckWidth * head.width, body.neckWidth * body.width )
    this.neck = this.makeNeck( { width } )
    head.addChild( this.neck )

    const eye = this.showItem( { type: EYE, id: eyeID } )
    this.setEye()

    this.setColor( { color } )
  }


  setEye () {
    const head = this.getHead()
    const eye = this.getEye()
    head.addChild( eye )
    eye.y = -head.anchor.y * head.height + head.height / 2
  }


  makeNeck ( opt = {} ) {
    const { width, height, color } = _.defaults( opt, {
      width: 100,
      height: 50,
    } )

    const graphics = this.game.add.graphics( width, height )
    graphics.beginFill( 0xffffff )
    graphics.drawRect( -width * 1.5, -height, width, height )
    // graphics.alpha = 0.5

    return graphics
  }


  setColor ( opt = {} ) {
    const { color } = _.defaults( opt, {
      color: this.dna.color === undefined ? 0xffffff : this.dna.color,
    } )

    this.getBody().tint = color
    this.getHead().tint = color
    this.getEye().iris.tint = ( color > 0xf8f8f8 ) ? 0x000000 : color // TO DO: set this to color === 0xffffff when color limitations are implemented
    this.neck.tint = color
    this.dna.color = color
    this.logDNA()
  }


  showItem ( { type, id } ) {
    for ( const item of this.mapping[ type ] ) {
      item.visible = false
    }

    const item = this.mapping[ type ][ id ]
    item.visible = true
    this.dna[ `${ type }ID` ] = id

    return item
  }


  makeItems ( { parent, type, props } ) {
    const items = []

    props.forEach( ( prop, i ) => {
      const { anchorX, anchorY, neckWidth } = prop
      const item = this.game.add.sprite( 0, 0, 'assets', `${ type }${ i }`, parent )
      item.anchor.set( anchorX, anchorY )
      item.neckWidth = neckWidth
      items.push( item )
    } )

    return items
  }


  makeEyes ( { parent, props } ) {
    const eyes = []
    const eyeballs = this.makeItems( { type: EYEBALL, props } )
    const irises = this.makeItems( { type: IRIS, props: bodyPartProps.irises } )

    props.forEach( ( prop, i ) => {
      const eye = this.game.add.group( parent )
      eye.eyeball = eyeballs[ i ]
      eye.iris = irises[ i ]
      eye.add( eyeballs[ i ] )
      eye.add( irises[ i ] )
      eyes.push( eye )
    } )

    return eyes
  }


  getBody () {
    return this.bodies[ this.dna.bodyID ]
  }


  getHead () {
    return this.heads[ this.dna.headID ]
  }


  getEye () {
    return this.eyes[ this.dna.eyeID ]
  }


  showNextItem ( { type } ) {
    const id = this.mapping[ type ][ ++this.dna[ `${ type }ID` ] ] === undefined ? 0 : this.dna[ `${ type }ID` ]
    this.showItem( { type, id } )
    this.setColor()
    this.setEye()
    this.logDNA()
  }


  showPreviousItem ( { type } ) {
    const id = this.mapping[ type ][ --this.dna[ `${ type }ID` ] ] === undefined ? this.mapping[ type ].length - 1 : this.dna[ `${ type }ID` ]
    this.showItem( { type, id } )
    this.setColor()
    this.setEye()
    this.logDNA()
  }


  logDNA () {
    console.log( 'ALIEN DNA:', this.dna )
  }

}