const { delayedCall } = gsap

const HEAD = 'head'
const BODY = 'body'
const EYEBALL = 'eyeball'
const IRIS = 'iris'
const EYE_CLOSED = 'eyeClosed'

const eyeballHitTestPoints = {
  full: _.map( [ 0, 45, 90, 135, 180, 225, 270, 315 ], ( angle ) => getPointOnCircle( { angle, radius: 0.5 } ) ),
  half: _.concat(
    [
      { x: -0.25, y: 0 },
      { x: 0, y: 0 },
      { x: 0.25, y: 0 },
    ],
    _.map( [ 0, 45, 90, 135, 180 ], ( angle ) => {
      const point = getPointOnCircle( { angle, radius: 0.5 } )
      point.y *= 2 // because the half open eye height equals the radius of the circle the point y must me multiplied by 2
      return point
    } )
  )
}

function getPointOnCircle ( opt ) {
  const { radius, angle } = _.defaults( opt || {}, {
    radius: 1,
    angle: 0,
  } )

  const radian = angle * Math.PI / 180
  const x = radius * Math.cos( radian )
  const y = radius * Math.sin( radian )
  return { x, y }
}

const bodyPartProps = {
  heads: [
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.3, neckHeight: 0.11, combinations: { body1: { anchorY: 0.7, neckWidth: 0.5, neckHeight: 0.25 }, body2: { anchorY: 0.7, neckWidth: 0.5, neckHeight: 0.25 }, body3: { anchorX: 0.48, anchorY: 0.79 }, body4: { anchorY: 0.8 }, body5: { anchorY: 0.8 }, body6: { anchorY: 0.82, neckWidth: 0.2 }, body7: { anchorY: 0.7 } } }, // 0
    { anchorX: 0.5, anchorY: 0.84, neckWidth: 0.4, neckHeight: 0.05, combinations: { body1: { neckWidth: 0.7, neckHeight: 0.15 } } }, // 1
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.5, neckHeight: 0.05, combinations: { body6: { anchorX: 0.55 } } }, // 2
    { anchorX: 0.5, anchorY: 0.85, neckWidth: 0.3, neckHeight: 0.05, combinations: { body1: { neckWidth: 0.5, neckHeight: 0.07 }, body7: { neckWidth: 0.5 } } }, // 3
    { anchorX: 0.49, anchorY: 0.73, neckWidth: 0.3, neckHeight: 0.1, combinations: { body1: { neckWidth: 0.65, neckHeight: 0.25 }, body3: { anchorY: 0.8 }, body6: { neckWidth: 0.2 }, body7: { anchorY: 0.9 } } }, // 4
    { anchorX: 0.5, anchorY: 0.8, neckWidth: 0.5, neckHeight: 0.15 }, // 5
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.6, neckHeight: 0.05 }, // 6
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.6, neckHeight: 0.07 }, // 7
    { anchorX: 0.5, anchorY: 0.7, neckWidth: 0, neckHeight: 0, combinations: { body3: { anchorX: 0.48, anchorY: 0.63 } } }, // 8
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 1, neckHeight: 0.05 }, // 9
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.3, neckHeight: 0.05 }, // 10
    { anchorX: 0.49, anchorY: 0.88, neckWidth: 0.4, neckHeight: 0.05 }, // 11
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.5, neckHeight: 0.1 }, // 12
    { anchorX: 0.5, anchorY: 0.9, neckWidth: 0.5, neckHeight: 0.05 }, // 13
    { anchorX: 0.48, anchorY: 0.9, neckWidth: 0.4, neckHeight: 0.05 }, // 14
  ],
  bodies: [
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.4 }, // 0
    { anchorX: 0.5, anchorY: 0.25, neckWidth: 0.6 }, // 1
    { anchorX: 0.5, anchorY: 0.3, neckWidth: 0.6 }, // 2
    { anchorX: 0.52, anchorY: 0, neckWidth: 0.8 }, // 3
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.5 }, // 4
    { anchorX: 0.5, anchorY: 0, neckWidth: 0.6 }, // 5
    { anchorX: 0.64, anchorY: 0, neckWidth: 0.3 }, // 6
    { anchorX: 0.5, anchorY: 0.2, neckWidth: 0.8 }, // 7
  ],
  eyeballs: [
    { anchorX: 0.5, anchorY: 0.5, hitTestPoints: eyeballHitTestPoints.full }, // 0
    { anchorX: 0.5, anchorY: 0.5, hitTestPoints: eyeballHitTestPoints.full }, // 1
    { anchorX: 0.5, anchorY: 0.5, hitTestPoints: eyeballHitTestPoints.full }, // 2
    { anchorX: 0.5, anchorY: 0, hitTestPoints: eyeballHitTestPoints.half }, // 3
    { anchorX: 0.5, anchorY: 0, hitTestPoints: eyeballHitTestPoints.half }, // 4
    { anchorX: 0.5, anchorY: 0, hitTestPoints: eyeballHitTestPoints.half }, // 5
  ],
  irises: [
    { anchorX: 0.5, anchorY: 0.5 }, // 0
    { anchorX: 0.5, anchorY: 0.5 }, // 1
    { anchorX: 0.5, anchorY: 0.5 }, // 2
    { anchorX: 0.5, anchorY: -0.2 }, // 3
    { anchorX: 0.5, anchorY: -0.33 }, // 4
    { anchorX: 0.5, anchorY: -0.6 }, // 5
  ],
  eyesClosed: [
    { anchorX: 0.5, anchorY: 0.15 }, // 0
    { anchorX: 0.5, anchorY: 0.075 }, // 1
    { anchorX: 0.5, anchorY: 0.06 }, // 2
    { anchorX: 0.5, anchorY: 0 }, // 3
    { anchorX: 0.5, anchorY: 0 }, // 4
    { anchorX: 0.5, anchorY: 0 }, // 5
  ],
}


export default class Alien extends Phaser.Group {

  constructor( opt ) {
    const {
      game, parent, x, y, atlasKey, atlasKeyCombinations, validColors, dna, groundY, withBMD, eyeCheck, logDNAChange, textStyle, traitProperties, onDNAChange,
      enabled, pixelPerfectAlpha, pixelPerfectClick, pixelPerfectOver, useHandCursor, onClick,
    } = _.defaults( opt, {
      x: 0,
      y: 0,
      atlasKey: 'alien',
      atlasKeyCombinations: [ 'alien-combinations-1', 'alien-combinations-2' ],
      groundY: 0.6,
      withBMD: false,
      eyeCheck: _.isNil( opt.withBMD ) ? false : opt.withBMD,
      logDNAChange: false,
      textStyle: _.defaults( opt.textStyle || {}, {
        font: 'BC Alphapipe, sans-serif',
        fontSize: '56px',
        fill: '#ffffff',
        align: 'left',
        boundsAlignH: 'center',
        boundsAlignV: 'middle',
      } ),
      traitProperties: _.defaults( opt.traitProperties || {}, {
        width: opt.game.world.width * 0.6,
        height: opt.game.world.height * 0.085,
        padding: opt.game.world.width * 0.01,
        edgeRadius: opt.game.world.width * 0.04,
        x1: opt.game.world.width * -0.05,
        x2: opt.game.world.width * 0.05,
        yMargin1: opt.game.world.height * -0.14,
        yMargin2: opt.game.world.height * -0.05,
        color: 0x000000,
        fromYOffset: opt.game.world.height * 0.1, // the tween from y position
        fromScale: 0.5, // the tween from scale
        toYOffset: 0,
        toScale: 0.5,
        horizontalSway: opt.game.world.width * 0.0125,
        verticalSway: opt.game.world.width * -0.00625,
      } )
    } )

    traitProperties.textStyle = textStyle

    super( game, parent, 'alien' )

    this.position.set( x, y )

    this.game = game
    this.atlasKey = atlasKey
    this.atlasKeyCombinations = atlasKeyCombinations
    this.validColors = validColors
    this.groundY = groundY
    this.withBMD = withBMD
    this.eyeCheck = eyeCheck
    this.logDNAChange = logDNAChange
    this.traitProperties = traitProperties
    this.traitsVisible = false
    this.onDNAChange = onDNAChange
    this.enabled = false

    this.combinations = this.makeCombinations( { atlasKeys: atlasKeyCombinations, withBMD } )
    this.bodies = this.makeItems( { parent: this, type: BODY, props: bodyPartProps.bodies, withBMD } )
    this.heads = this.makeItems( { parent: this, type: HEAD, props: bodyPartProps.heads, withBMD } )
    this.eyes = []

    this.mapping = {
      body: this.bodies,
      head: this.heads,
      eye: this.eyes,
    }

    this.dna = _.defaults( dna || {}, {
      name: '',
      trait1: '',
      trait2: '',
    } )

    if ( dna === undefined ) {
      this.randomize()
    } else {
      this.make( dna )
    }

    this.makeTraits( this.traitProperties )

    if ( onClick !== undefined ) this.setupClick( { enabled, pixelPerfectAlpha, pixelPerfectClick, pixelPerfectOver, useHandCursor, onClick } )
  }


  fixDNAPropertyTypes ( opt ) {
    const { dna, numberTypes } = _.defaults( opt || {}, {
      numberTypes: [ 'id', 'headID', 'bodyID', 'color', 'index', 'x', 'y' ]
    } )

    if ( dna === undefined ) return

    const toNumber = ( value, key, obj ) => {
      if ( _.includes( numberTypes, key ) ) obj[ key ] = Number( value )
    }

    _.forOwn( dna, toNumber )
    _.forEach( dna.eyes, ( eye ) => _.forOwn( eye, toNumber ) )
  }


  sampleArrayIndex ( array ) {
    return _.sample( _.range( array.length ) )
  }


  toLocal ( opt ) {
    const { x, y, from } = _.defaults( opt || {}, {
      x: 0,
      y: 0,
    } )

    return this.toLocal( { x, y }, from )
  }


  makeCombinations ( { atlasKeys, withBMD } ) {
    let combinations = []

    for ( const atlasKey of atlasKeys ) {
      const frameNames = _.keys( this.game.cache.getFrameData( atlasKey )._frameNames )

      for ( const frameName of frameNames ) {
        const parts = frameName.split( '-' )
        const bodyID = _.toNumber( _.trimStart( parts[ 0 ], 'body' ) )
        const headID = _.toNumber( _.trimStart( parts[ 1 ], 'head' ) )
        const image = this.game.add.sprite( 0, 0, atlasKey, frameName, this )
        image.visible = false
        image.anchor.set( 0.5, 0.5 )
        const combination = { headID, bodyID, image }

        if ( withBMD ) {
          image.bmd = this.makeBitmapData( { sourceImage: image } )
          image.bmd.inputEnabled = true
        }

        combinations.push( combination )
      }
    }

    return combinations
  }


  randomize () {
    const bodyID = this.sampleArrayIndex( this.bodies )
    const headID = this.sampleArrayIndex( this.heads )
    const color = this.getRandomColor()

    this.make( { bodyID, headID, color } )
  }


  // returns false if the eye is overlapping another eye or if it exceeds the body
  eyeTest ( { eye } ) {
    eye.inputEnabled = true
    eye.pixelPerfectOver = true
  }


  destroyEyes () {
    for ( const eye of this.eyes ) {
      eye.killBlinking()
      eye.destroy()
    }

    this.eyes = []
    this.dna.eyes = []
  }


  getRandomColor () {
    return this.validColors !== undefined ? _.sample( this.validColors ).color : _.random( 0, 0xffffff )
  }


  make ( dna = {} ) {
    this.fixDNAPropertyTypes( { dna } )

    const { bodyID, headID, color, eyes, positionOnGround, logDNA } = _.defaults( dna, {
      bodyID: this.dna.bodyID,
      headID: this.dna.headID,
      color: this.dna.color,
      eyes: _.isArray( this.dna.eyes ) ? this.dna.eyes : [],
      blink: true,
      positionOnGround: true,
      logDNA: this.logDNAChange,
    } )

    this.hideCombinations()

    this.combination = this.getCombination( { headID, bodyID } )

    if ( this.combination === undefined ) {
      const body = this.showItem( { type: BODY, id: bodyID, combinationID: `${ HEAD }${ headID }` } )
      const head = this.showItem( { type: HEAD, id: headID, combinationID: `${ BODY }${ bodyID }` } )

      if ( this.neck !== undefined ) this.neck.destroy()
      const width = Math.min( head.neckWidth * head.width, body.neckWidth * body.width )
      const height = head.neckHeight * head.height
      this.neck = this.makeNeck( { width, height } )
      this.neck.y = head.height - head.height * head.anchor.y

      head.addChild( this.neck )

      if ( positionOnGround ) this.y = this.game.world.height * this.groundY - body.height + body.height * body.anchor.y
    } else {
      this.hideHeads()
      this.hideBodies()

      this.combination.tint = color
      this.combination.visible = true
      this.dna.headID = headID
      this.dna.bodyID = bodyID

      if ( positionOnGround ) this.y = this.game.world.height * this.groundY - this.combination.height * this.combination.anchor.y
    }

    this.destroyEyes()

    for ( const eyeProps of eyes ) {
      this.makeEye( eyeProps )
    }

    this.tint( { color } )

    if ( this.onDNAChange !== undefined ) this.onDNAChange( { dna: this.dna } )

    if ( logDNA ) this.logDNA()

    // anything with bitmapdata is expensive performance-wise, so only use this if necessary (i.e. only for the editor)
    if ( this.eyeCheck && this.withBMD ) requestAnimationFrame( () => this.hideAndDestroyOutOfBodyEyes() )

    if ( this.enabled ) this.enable()
  }


  // segments Japanese words for potential line breaks with the TinySegmenter module.
  // We use a zero-width space unicode character \u200b to declare potential line breaks.
  // This zero-width unicode character is not supported by the Phaser word wrap functions, so
  // we need to overwrite Phaser.Text.prototype.basicWordWrap to also split words at /\u200B/.
  // In basicWordWrap we also run the text through advancedWordWrap to break long words that
  // would otherwise exceed the wordWrapWidth.
  // See phaser-extensions.js
  segmentJapaneseText ( opt ) {
    const { string, separator } = _.defaults( opt || {}, {
      separator: '\u200b', // zero-width space unicode character
    } )
    const segmenter = new TinySegmenter()
    const segments = segmenter.segment( string )
    return segments.join( separator )
  }


  makeTraits ( opt ) {
    const { x1, x2, yMargin1, yMargin2, width, height, padding, edgeRadius, color, textStyle } = opt

    this.trait1 = this.makeTrait( { text: this.dna.trait1, x: x1, yMargin: yMargin1, width, height, padding, edgeRadius, color, textStyle } )
    this.trait2 = this.makeTrait( { text: this.dna.trait2, x: x2, yMargin: yMargin2, width, height, padding, edgeRadius, color, textStyle } )
  }


  makeTrait ( opt ) {
    const { text, x, yMargin, width, height, padding, edgeRadius, color, textStyle } = opt

    const group = this.game.add.group( this )
    group.alpha = 0

    const textWidth = width - 2 * padding
    const textHeight = height - 2 * padding

    group.pivot.set( width / 2, height / 2 )

    const box = this.game.add.graphics( 0, 0, group )
    box.beginFill( color )
    box.drawRoundedRect( 0, 0, width, height, edgeRadius )

    textStyle.wordWrap = true
    textStyle.wordWrapWidth = textWidth

    const textObj = this.game.add.text( padding, padding, '', textStyle, group )
    textObj.setTextBounds( 0, 0, textWidth, textHeight )
    textObj.originFontSize = textObj.fontSize

    group.updatePosition = () => {
      const y = this.top - this.y + yMargin
      group.position.set( x, y )
      group.targetPosition = { x, y }
      return group
    }

    group.setText = ( text ) => {
      if ( text === undefined ) return

      textObj.text = this.segmentJapaneseText( { string: text } )
      textObj.fontSize = textObj.originFontSize
      this.fitTextToBounds( { textObj } )
      return group
    }

    group.setText( text )
    group.updatePosition()

    return group
  }


  updateTraits () {
    for ( const key of [ 'trait1', 'trait2' ] ) {
      const trait = this[ key ]
      const text = this.dna[ key ]
      trait.setText( text )
      trait.updatePosition()
    }
  }


  showTraits ( opt ) {
    const { duration, fromScale, fromYOffset, sway, onComplete } = _.defaults( opt || {}, {
      duration: 1,
      fromScale: this.traitProperties.fromScale,
      fromYOffset: this.traitProperties.fromYOffset,
      sway: true
    } )

    const tl = new TimelineMax()
      .set( [ this.trait1, this.trait2 ], { alpha: 0, y: this.trait1.targetPosition.y + fromYOffset } )
      .set( this.trait1.scale, { x: fromScale, y: fromScale } )
      .set( this.trait2.scale, { x: fromScale, y: fromScale } )
      .to( this.trait1, { duration, y: this.trait1.targetPosition.y, alpha: 1, ease: Power2.easeIn }, 0 )
      .to( this.trait1.scale, { duration, x: 1, y: 1, ease: Power2.easeOut }, 0 )
      .to( this.trait2, { duration, y: this.trait2.targetPosition.y, alpha: 1, ease: Power2.easeIn }, duration / 2 )
      .to( this.trait2.scale, { duration, x: 1, y: 1, ease: Power2.easeOut }, duration / 2 )
      .call( () => this.traitsVisible = true )

    if ( onComplete !== undefined ) tl.call( onComplete )
    if ( sway ) tl.call( () => this.swayTraits( { duration: duration * 2 } ) )


    this.showTraitsTl = tl
  }


  hideTraits ( opt ) {
    const { duration, toScale, toYOffset, onComplete } = _.defaults( opt || {}, {
      duration: 0.4,
      toScale: this.traitProperties.toScale,
      toYOffset: this.traitProperties.toYOffset,
    } )

    const tl = new TimelineMax()
      .to( this.trait1, { duration, y: this.trait1.targetPosition.y + toYOffset, alpha: 0, ease: Power2.easeIn }, 0 )
      .to( this.trait1.scale, { duration, x: toScale, y: toScale, ease: Back.easeIn}, 0 )
      .to( this.trait2, { duration, y: this.trait2.targetPosition.y + toYOffset, alpha: 0, ease: Power2.easeIn }, duration / 2 )
      .to( this.trait2.scale, { duration, x: toScale, y: toScale, ease: Back.easeIn }, duration / 2 )
      .call( () => this.traitsVisible = false )

    if ( this.swayTl !== undefined ) tl.call( () => this.swayTl.kill() )
    if ( onComplete !== undefined ) tl.call( onComplete )

    this.hideTraitsTl = tl
  }


  toggleTraits () {
    if ( this.traitsVisible && ( this.hideTraitsTl === undefined || this.hideTraitsTl.progress() === 1 ) ) {
      this.hideTraits()
    } else if ( this.showTraitsTl === undefined || this.showTraitsTl.progress() === 1 ) {
      this.showTraits()
    }
  }


  swayTraits ( opt ) {
    const { duration, horizontalSway, verticalSway } = _.defaults( opt || {}, {
      duration: 2,
      horizontalSway: this.traitProperties.horizontalSway,
      verticalSway: this.traitProperties.verticalSway,
    } )

    if ( this.swayTl !== undefined ) this.swayTl.kill()

    this.swayTl = new TimelineMax()
      .to( this.trait1, { duration: duration, y: this.trait1.targetPosition.y + verticalSway, ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0 )
      .to( this.trait2, { duration: duration, y: this.trait2.targetPosition.y + verticalSway, ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0 )
      .to( this.trait1, { duration: duration, x: this.trait1.targetPosition.x + horizontalSway, ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0 )
      .to( this.trait2, { duration: duration, x: this.trait2.targetPosition.x - horizontalSway, ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0 )
  }


  fitTextToBounds ( opt ) {
    const { textObj, minFontSize } = _.defaults( opt, {
      minFontSize: 24,
    } )

    if ( textObj.height <= textObj.textBounds.height ) return

    while ( textObj.height > textObj.textBounds.height && textObj.fontSize > minFontSize ) {
      textObj.fontSize -= 1
    }
  }


  hideCombinations () {
    for ( const combination of this.combinations ) {
      combination.image.visible = false
    }
  }


  hideHeads () {
    for ( const head of this.heads ) {
      head.visible = false
    }
  }


  hideBodies () {
    for ( const body of this.bodies ) {
      body.visible = false
    }
  }


  getCombination ( { headID, bodyID } ) {
    const combination = _.find( this.combinations, { headID, bodyID } )
    if ( combination !== undefined ) return combination.image
  }


  tint ( opt = {} ) {
    const { color, setDNA } = _.defaults( opt, {
      color: this.dna.color || 0xffffff,
      setDNA: true,
    } )

    if ( setDNA ) this.dna.color = color

    if ( this.body !== undefined ) this.body.tint = color
    if ( this.head !== undefined ) this.head.tint = color
    if ( this.combination !== undefined ) this.combination.tint = color

    const irisColor = this.getIrisColor( { color } )

    for ( const eye of this.eyes ) {
      eye.iris.tint = irisColor
    }

    if ( this.neck !== undefined ) this.neck.tint = color
    this.isTintAdjusted = false
  }


  adjustTintLuminosity ( opt ) {
    if ( this.isTintAdjusted ) return // performance improvement

    const hsl = this.colorToHSL( { color: this.dna.color } )

    const { adjustment } = _.defaults( opt || {}, {
      adjustment: ( 1 - hsl.l ) / 2,
    } )

    const luminosity = Math.min( 1, hsl.l + adjustment )
    const rgb = Phaser.Color.HSLtoRGB( hsl.h, hsl.s, luminosity )
    this.tint( { color: rgb.color, setDNA: false } )
    this.isTintAdjusted = true
  }


  getIrisColor ( opt ) {
    const { luminosityThreshold, color } = _.defaults( opt, {
      luminosityThreshold: 0.95,
      color: this.dna.color,
    } )

    // when luminosity is very high, tint the iris black
    const hsl = this.colorToHSL( { color } )
    return ( hsl.l > luminosityThreshold ) ? 0x000000 : color
  }


  colorToHSL ( { color } ) {
    const rgb = Phaser.Color.valueToColor( color )
    return Phaser.Color.RGBtoHSL( rgb.r, rgb.g, rgb.b )
  }


  setEye ( { eye } ) {
    this.head.addChild( eye )
    eye.y = -this.head.anchor.y * this.head.height + this.head.height / 2
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
    } else if ( item.defaultProps !== undefined ) {
      this.setItemProps( { item } )
    }

    item.visible = true
    item.scale.set( 1 )
    this.dna[ `${ type }ID` ] = id

    return item
  }


  setItemProps ( { item, props } ) {
    const { anchorX, anchorY, neckWidth, neckHeight } = props || item.defaultProps

    item.anchor.set( anchorX, anchorY )
    item.neckWidth = neckWidth
    item.neckHeight = neckHeight
  }


  makeItems ( { parent, type, props, withBMD } ) {
    const items = []

    props.forEach( ( prop, index ) => {
      const item = this.makeItem( { parent, type, index, prop, withBMD } )
      items.push( item )
    } )

    return items
  }


  makeItem ( { parent, type, index, prop, withBMD } ) {
    const item = this.game.add.sprite( 0, 0, this.atlasKey, `${ type }${ index }` )
    if ( parent !== undefined ) parent.addChild( item )
    item.defaultProps = prop
    this.setItemProps( { item } )
    if ( withBMD ) {
      item.bmd = this.makeBitmapData( { sourceImage: item } )
      item.bmd.inputEnabled = true
    }
    return item
  }


  makeEye ( opt ) {
    const { parent, index, x, y, blink, attach } = _.defaults( opt || {}, {
      parent: this,
      index: 0,
      x: 0,
      y: 0,
      blink: true,
      attach: true,
    } )

    const eye = this.game.add.sprite()
    if ( parent !== undefined ) parent.addChild( eye )
    eye.index = index
    eye.eyeball = this.makeItem( { parent: eye, type: EYEBALL, index, prop: bodyPartProps.eyeballs[ index ], withBMD: this.withBMD } )

    eye.iris = this.makeItem( { parent: eye, type: IRIS, index, prop: bodyPartProps.irises[ index ] } )
    eye.closed = this.makeItem( { parent: eye, type: EYE_CLOSED, index, prop: bodyPartProps.eyesClosed[ index ] } )
    eye.closingFrame = `eyeClosing${ index }`
    eye.closedFrame = `eyeClosed${ index }`
    eye.hitTestPoints = bodyPartProps.eyeballs[ index ].hitTestPoints
    eye.iris.tint = this.getIrisColor()
    eye.addChild( eye.eyeball )
    eye.addChild( eye.iris )
    eye.addChild( eye.closed )
    eye.position.set( x, y )

    eye.attach = () => this.attachEye( { eye } )
    eye.detach = () => this.detachEye( { eye } )
    eye.startBlinking = () => this.startBlinking( { eye } )
    eye.stopBlinking = () => this.stopBlinking( { eye } )
    eye.resumeBlinking = () => this.resumeBlinking( { eye } )
    eye.killBlinking = () => this.killBlinking( { eye } )
    eye.open = () => this.openEye( { eye } )
    eye.close = () => this.closeEye( { eye } )
    eye.reset = () => this.resetEye( { eye } )
    eye.hideAndDestroy = () => this.hideAndDestroyEye( { eye } )

    eye.reset()

    if ( blink ) eye.startBlinking()
    if ( attach ) eye.attach()

    return eye
  }


  attachEye ( opt ) {
    const { eye, logDNA } = _.defaults( opt || {}, {
      logDNA: this.logDNAChange,
    } )

    this.eyes.push( eye )
    const eyeDNA = _.pick( eye, [ 'index', 'x', 'y' ] )
    eyeDNA.eye = eye // we won't need to save this but need it if we want to remove the eye from the DNA

    const existingEyeDNA = _.find( this.dna.eyes, ( eyeDNA ) => eyeDNA.eye === eye )

    if ( existingEyeDNA !== undefined ) {
      _.pull( this.dna.eyes, existingEyeDNA )
    }

    this.dna.eyes.push( eyeDNA )

    if ( this.onDNAChange !== undefined ) this.onDNAChange( { dna: this.dna } )
    if ( logDNA ) this.logDNA()
  }


  detachEye ( { eye } ) {
    _.pull( this.eyes, eye )
  }


  hasEyes () {
    return this.dna.eyes.length > 0
  }


  hitTest ( { item, x, y } ) {
    if ( item.bmd === undefined || !item.bmd.inputEnabled ) return console.warn( 'Hittest target doesn\'t have bitmap data attached or the bitmap data is not input enabled.' )

    const { bmd } = item
    const localPos = item.toLocal( { x: x + item.anchor.x * item.width, y: y + item.anchor.y * item.height } )
    const rgb = bmd.getPixelRGB( Math.round( localPos.x ), Math.round( localPos.y ) )

    return rgb.a === 255
  }


  // TO DO: There's a bug where eyes can be on top of each other if hit test points don't register or so.
  // Does the eye to eye hit test have some logical error with checking for overlap?
  eyeToEyeHitTest ( { eye, offsetX, offsetY } ) {
    const otherEyes = _.without( this.eyes, eye )

    for ( const otherEye of otherEyes ) {
      if ( eye.eyeball.overlap( otherEye.eyeball ) ) {

        for ( const hitTestPoint of eye.hitTestPoints ) {
          const x = eye.eyeball.x + hitTestPoint.x * eye.eyeball.width + ( offsetX || 0 )
          const y = eye.eyeball.y + hitTestPoint.y * eye.eyeball.height + ( offsetY || 0 )
          const globalPos = eye.eyeball.toGlobal( { x, y } )
          const hit = this.hitTest( { item: otherEye.eyeball, x: globalPos.x, y: globalPos.y } )

          if ( hit ) {
            // eye.iris.tint = 0xff0000 // DEV test
            return true
          }
        }
      }
    }

    // eye.iris.tint = this.getIrisColor() // DEV test
    return false
  }


  eyeToBodyHitTest ( { eye } ) {
    if ( this.combination === undefined ) {

      if ( eye.eyeball.overlap( this.head ) || eye.eyeball.overlap( this.body ) ) {
        let hitsNeeded = eye.hitTestPoints.length

        hitPointCheck:
        for ( const hitTestPoint of eye.hitTestPoints ) {
          const x = eye.eyeball.x + hitTestPoint.x * eye.eyeball.width
          const y = eye.eyeball.y + hitTestPoint.y * eye.eyeball.height
          const globalPos = eye.eyeball.toGlobal( { x, y } )

          for ( const item of [ this.head, this.body ] ) {
            const hit = this.hitTest( { item, x: globalPos.x, y: globalPos.y } )

            if ( hit ) {
              --hitsNeeded
              continue hitPointCheck
            }
          }
        }

        return hitsNeeded < 1
      }
    } else {
      if ( eye.eyeball.overlap( this.combination ) ) {
        for ( const hitTestPoint of eye.hitTestPoints ) {
          const x = eye.eyeball.x + hitTestPoint.x * eye.eyeball.width
          const y = eye.eyeball.y + hitTestPoint.y * eye.eyeball.height
          const globalPos = eye.eyeball.toGlobal( { x, y } )
          const hit = this.hitTest( { item: this.combination, x: globalPos.x, y: globalPos.y } )

          if ( !hit ) {
            return false
          }
        }
      } else {
        return false
      }
      // we only return true if all hitTestPoint tests are true (the entire eye is in the body)
      return true
    }
  }


  makeBitmapData ( { sourceImage } ) {
    const currentFrame = sourceImage.animations.currentFrame
    const bmd = this.game.add.bitmapData( currentFrame.width, currentFrame.height )
    bmd.draw( sourceImage, -currentFrame.spriteSourceSizeX + currentFrame.width * sourceImage.anchor.x, -currentFrame.spriteSourceSizeY + currentFrame.height * sourceImage.anchor.y )
    bmd.update() // necessary to getPixelRGB()
    const sprite = bmd.addToWorld()
    sprite.anchor.set( sourceImage.anchor.x, sourceImage.anchor.y )
    sprite.alpha = 0
    sourceImage.parent.addChild( sprite )
    return bmd
  }


  get body () {
    return this.bodies[ this.dna.bodyID ]
  }


  get head () {
    return this.heads[ this.dna.headID ]
  }


  // total width of head and body or combination, whichever applies
  get totalWidth () {
    if ( this.combination === undefined ) {
      return Math.max( this.head.width, this.body.width)
    } else {
      return this.combination.width
    }
  }

  // total height of head and body or combination, whichever applies
  get totalHeight () {
    if ( this.combination === undefined ) {
      return this.head.height * this.head.anchor.y + this.body.height * ( 1 - this.body.anchor.y )
    } else {
      return this.combination.height
    }
  }


  // the x position from the left canvas edge
  get left () {
    if ( this.combination === undefined ) {
      return this.x - Math.max( this.head.width * this.head.anchor.x, this.body.width * this.body.anchor.x )
    } else {
      return this.x - this.combination.width / 2
    }
  }


  // the y position from the top canvas edge
  get top () {
    if ( this.combination === undefined ) {
      return this.y - this.head.height * this.head.anchor.y
    } else {
      return this.y - this.combination.height / 2
    }
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

    if ( eye.blinkTL !== undefined ) {
      eye.blinkTL.play()
      return
    }

    const interval = Math.max( closeDuration, _.random( minInterval, maxInterval, true ) )

    eye.blinkTL = new TimelineMax( { repeat: -1, delay: interval } )
    eye.blinkTL.call( eye.close )
    eye.blinkTL.call( eye.open, null, closeDuration )
    eye.blinkTL.to( {}, interval, {} )
  }


  killBlinking ( { eye } ) {
    this.stopBlinking( { eye } )

    if ( eye.blinkTL !== undefined ) {
      eye.blinkTL.kill()
      eye.blinkTL = undefined
    }

    eye.reset()
  }


  killAllBlinking () {
    for ( const eye of this.eyes ) {
      eye.killBlinking()
    }
  }


  stopBlinking ( { eye } ) {
    if ( eye.blinkTL !== undefined ) {
      eye.blinkTL.pause().progress( 0 )
    }

    if ( eye.closeDelayedCall !== undefined ) {
      eye.closeDelayedCall.kill()
      eye.closeDelayedCall = undefined
    }

    if ( eye.openDelayedCall !== undefined ) {
      eye.openDelayedCall.kill()
      eye.openDelayedCall = undefined
    }

    eye.reset()
  }


  stopAllBlinking () {
    for ( const eye of this.eyes ) {
      eye.stopBlinking()
    }
  }


  resumeBlinking ( { eye } ) {
    if ( eye.blinkTL !== undefined ) eye.blinkTL.play()
  }


  resumeAllBlinking () {
    for ( const eye of this.eyes ) {
      eye.resumeBlinking()
    }
  }


  closeEye ( { eye } ) {
    eye.closed.frameName = eye.closingFrame
    eye.closed.visible = true
    eye.eyeball.visible = false
    eye.iris.visible = false

    eye.closeDelayedCall = delayedCall( 0.03, () => {
      if ( eye !== undefined && eye.closed !== undefined && eye.closedFrame !== undefined ) eye.closed.frameName = eye.closedFrame
    } )
  }


  openEye ( { eye } ) {
    eye.closed.frameName = eye.closingFrame
    eye.closed.visible = true
    eye.eyeball.visible = false
    eye.iris.visible = false

    eye.openDelayedCall = delayedCall( 0.03, () => {
      if ( eye !== undefined && eye.closed !== undefined ) {
        eye.closed.visible = false
        eye.eyeball.visible = true
        eye.iris.visible = true
      }
    } )
  }


  resetEye ( { eye } ) {
    eye.closed.visible = false
    eye.eyeball.visible = true
    eye.iris.visible = true
  }


  hideAndDestroyEye ( { eye } ) {
    const existingEyeDNA = _.find( this.dna.eyes, ( eyeDNA ) => eyeDNA.eye === eye )
    _.pull( this.dna.eyes, existingEyeDNA )

    if ( this.onDNAChange !== undefined ) this.onDNAChange( { dna: this.dna } )

    eye.stopBlinking()

    const tl = new TimelineMax()
    tl.to( eye.scale, 0.5, { x: 0, y: 0, ease: Back.easeOut } )
    tl.call( () => this.detachEye( { eye } ) )
    tl.call( () => eye.destroy() )
  }


  hideAndDestroyOutOfBodyEyes () {
    console.log( 'hideAndDestroyOutOfBodyEyes' )
    for ( const eye of this.eyes ) {
      if ( !this.eyeToBodyHitTest( { eye } ) ) {
        eye.hideAndDestroy()
      }
    }
  }


  destroyAttachedEyes () {
    for ( const eye of this.eyes ) {
      eye.detach()
      eye.destroy()
    }
  }


  setupClick ( opt ) {
    const { enabled, pixelPerfectAlpha, pixelPerfectClick, pixelPerfectOver, useHandCursor, onClick } = _.defaults( opt || {}, {
      enabled: true,
      pixelPerfectAlpha: 1,
      pixelPerfectClick: true,
      pixelPerfectOver: true,
      useHandCursor: true,
    } )

    for ( const item of _.concat( this.heads, this.bodies, _.map( this.combinations, 'image' ) ) ) {
      if ( item === undefined ) continue
      item.inputEnabled = true
      item.input.enabled = false
      item.input.pixelPerfectAlpha = pixelPerfectAlpha
      item.input.pixelPerfectClick = pixelPerfectClick
      item.input.pixelPerfectOver = pixelPerfectOver
      item.input.useHandCursor = useHandCursor
      if ( onClick !== undefined ) item.events.onInputDown.add( () => onClick( this ) )
    }

    if ( enabled ) this.enable()
  }


  // this enables clicks if setupClick was run before; it also updates event listeners when the alien dna is changed
  enable () {
    this.disable()
    if ( this.head !== undefined ) this.head.input.enabled = true
    if ( this.body !== undefined ) this.body.input.enabled = true
    if ( this.combination !== undefined ) this.combination.input.enabled = true
    this.enabled = true
  }


  disable () {
    for ( const item of _.concat( this.heads, this.bodies, _.map( this.combinations, 'image' ) ) ) {
      item.input.enabled = false
    }

    this.enabled = false
  }


  logDNA () {
    console.log( 'ALIEN DNA:', this.dna )
  }

}
