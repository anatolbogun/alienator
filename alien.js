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


export default class Alien {

  constructor( opt ) {
    const { game, parent, x, y, mutable, atlasKey, atlasKeyCombinations, validColors, dna, groundY, onMake } = _.defaults( opt, {
      x: 0,
      y: 0,
      atlasKey: 'alien',
      atlasKeyCombinations: [ 'alien-combinations-1', 'alien-combinations-2' ],
      mutable: false, // TO DO: only create images of DNA, do not create BMDs, other "read only" optimnisations
      groundY: 0.65,
    } )

    this.game = game
    this.atlasKey = atlasKey
    this.atlasKeyCombinations = atlasKeyCombinations
    this.validColors = validColors
    this.groundY = groundY
    this.dna = {}
    this.onMake = onMake

    this.group = this.game.make.group()
    if ( parent !== undefined ) parent.addChild( group )
    this.group.position.set( x, y )

    this.combinations = this.makeCombinations( { atlasKeys: atlasKeyCombinations, withBMD: true } )
    this.bodies = this.makeItems( { parent: this.group, type: BODY, props: bodyPartProps.bodies, withBMD: true } )
    this.heads = this.makeItems( { parent: this.group, type: HEAD, props: bodyPartProps.heads, withBMD: true } )
    this.eyes = []

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


  toLocal ( opt ) {
    const { x, y, from } = _.defaults( opt || {}, {
      x: 0,
      y: 0,
    } )

    return this.group.toLocal( { x, y }, from )
  }


  makeCombinations ( { atlasKeys, withBMD } ) {
    let combinations = []

    for ( const atlasKey of atlasKeys ) {
      const frameNames = _.keys( this.game.cache.getFrameData( atlasKey )._frameNames )

      for ( const frameName of frameNames ) {
        const parts = frameName.split( '-' )
        const bodyID = _.toNumber( _.trimStart( parts[ 0 ], 'body' ) )
        const headID = _.toNumber( _.trimStart( parts[ 1 ], 'head' ) )
        const image = this.game.add.sprite( 0, 0, atlasKey, frameName, this.group )
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


  randomize ( opt = {} ) {
    const { logDNA } = opt

    const bodyID = this.sampleArrayIndex( this.bodies )
    const headID = this.sampleArrayIndex( this.heads )
    const color = this.getRandomColor()

    // this.makeRandomEyes()

    this.make( { bodyID, headID, color, logDNA } )
  }


  makeRandomEyes ( opt ) {
    const { num, positions } = _.defaults( opt || {}, {
      num: 1,
      positions: [
        { x: -50, y: 0 },
        { x: 50, y: 0 },
      ],
    } )

    this.destroyEyes()

    for ( const i of _.range( num ) ) {
      const { x, y } = positions[ i ]
      const index = _.random( bodyPartProps.eyeballs.length - 1 )
      const eye = this.makeEye( { index, x, y } )
      this.eyeTest( { eye } )
    }
  }


  // returns false if the eye is overlapping another eye or if it exceeds the body
  eyeTest ( { eye } ) {
    eye.inputEnabled = true
    eye.pixelPerfectOver = true
  }


  destroyEyes () {
    for ( const eye of this.eyes ) {
      eye.stopBlinking()
      eye.destroy()
    }

    this.eyes = []
  }


  getRandomColor () {
    return this.validColors !== undefined ? _.sample( this.validColors ).color : _.random( 0, 0xffffff )
  }


  // TO DO: rename dna to opt?
  make ( dna = {} ) {
    const { bodyID, headID, color, positionOnGround, logDNA } = _.defaults( dna, {
      bodyID: this.dna.bodyID,
      headID: this.dna.headID,
      color: this.dna.color,
      blink: true,
      positionOnGround: true,
      logDNA: true,
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

      if ( positionOnGround ) this.group.y = this.game.world.height * this.groundY - body.height + body.height * body.anchor.y
    } else {
      this.hideHeads()
      this.hideBodies()

      this.combination.tint = color
      this.combination.visible = true
      this.dna.headID = headID
      this.dna.bodyID = bodyID

      if ( positionOnGround ) this.group.y = this.game.world.height * this.groundY - this.combination.height * this.combination.anchor.y
    }

    this.tint( { color } )

    if ( this.onMake !== undefined ) this.onMake( { dna: this.dna } )

    if ( logDNA ) this.logDNA()
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

    const irisColor = this.getIrisColor()

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
    const { luminosityThreshold } = _.defaults( opt, {
      luminosityThreshold: 0.95,
    } )

    // when luminosity is very high, tint the iris black
    // const rgb = Phaser.Color.valueToColor( this.dna.color )
    // const hsl = Phaser.Color.RGBtoHSL( rgb.r, rgb.g, rgb.b )
    const hsl = this.colorToHSL( { color: this.dna.color } )
    return ( hsl.l > luminosityThreshold ) ? 0x000000 : this.dna.color
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
      parent: this.group,
      index: 0,
      x: 0,
      y: 0,
      blink: true,
      attach: true,
    } )

    const eye = this.game.add.sprite()
    if ( parent !== undefined ) parent.addChild( eye )
    eye.index = index
    eye.eyeball = this.makeItem( { parent: eye, type: EYEBALL, index, prop: bodyPartProps.eyeballs[ index ], withBMD: true } )

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

    eye.startBlinking = () => this.startBlinking( { eye } )
    eye.stopBlinking = () => this.stopBlinking( { eye } )
    eye.open = () => this.openEye( { eye } )
    eye.close = () => this.closeEye( { eye } )
    eye.reset = () => this.resetEye( { eye } )
    eye.hideAndDestroy = () => this.hideAndDestroyEye( { eye } )

    eye.reset()

    if ( blink ) eye.startBlinking()
    if ( attach ) this.attachEye( { eye } )

    return eye
  }


  attachEye ( { eye } ) {
    this.eyes.push( eye )
  }


  detachEye ( { eye } ) {
    _.pull( this.eyes, eye )
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


  // TO DO: instead of the alpha tint probably better to make a faded colour of the current tint so that the head/body overlap isn't
  // obvious with an alpha value < 1
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


  stopBlinking ( { eye } ) {
    if ( eye.blinkTL !== undefined ) {
      eye.blinkTL.pause().progress( 0 )
    }
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


  hideAndDestroyEye ( { eye } ) {
    const tl = new TimelineMax()
    tl.to( eye.scale, 0.5, { x: 0, y: 0, ease: Back.easeOut } )
    tl.call( () => this.detachEye( { eye } ) )
    tl.call( () => eye.destroy() )
  }


  logDNA () {
    console.log( 'ALIEN DNA:', this.dna )
  }

}
