export default class TextField extends Phaser.Group {

  constructor ( opt ) {
    const {
      game, id, parent, text, x, y, width, height, padding, multiLine,
      borderThickness, borderColor, borderColorFocus, borderAlpha, borderAlphaFocus, fillColor, fillColorFocus, fillAlpha, fillAlphaFocus, edgeRadius,
      fontFamily, fontSize, fontColor, textAlign,
      parentDom, cssStyle, cssStyleFocus, cssId, cssClass, focus, fadedOut, hidden, onChange
    } = _.defaults( opt || {}, {
      text: '',
      x: 0,
      y: 0,
      width: 100,
      height: 10,
      padding: 20,
      multiLine: false,
      borderThickness: 1,
      borderColor: 0x000000,
      borderColorFocus: 0xf57e20,
      borderAlpha: 1,
      borderAlphaFocus: 1,
      fillColor: 0xffffff,
      fillColorFocus: 0xffffff,
      fillAlpha: 1,
      fillAlphaFocus: 1,
      edgeRadius: 5,
      fontFamily: 'BC Alphapipe, sans-serif',
      fontSize: 56,
      fontColor: '#000000',
      textAlign: 'left',
      parentDom: 'body',
      cssStyle: 'position: absolute; margin: 0px; background-color: transparent; border: none; resize: none; outline: none;',
      focus: false,
      fadedOut: false,
      hidden: false,
    } )

    super( game, parent )

    this.position.set( x, y )

    this.game = game
    this.id = id
    this.box = game.add.graphics( 0, 0, this )
    this.box.beginFill( fillColor, fillAlpha )
    this.box.lineStyle( borderThickness, borderColor, borderAlpha )
    this.box.drawRoundedRect( 0, 0, width, height, edgeRadius )

    this.boxFocus = game.add.graphics( 0, 0, this )
    this.boxFocus.beginFill( fillColorFocus, fillAlphaFocus )
    this.boxFocus.lineStyle( borderThickness, borderColorFocus, borderAlphaFocus )
    this.boxFocus.drawRoundedRect( 0, 0, width, height, edgeRadius )
    this.boxFocus.visible = false

    this.width = width
    this.height = height
    this.padding = padding
    this.onChange = onChange
    this.fontSize = fontSize
    this.previousText = text

    this.htmlText = this.makeHtmlText( { parentDom, cssStyle, cssStyleFocus, cssId, cssClass, fontFamily, fontSize, fontColor, textAlign, width, height, padding, multiLine } )
    this.text = text
    this.cssBorder = this.htmlText.style.border

    window.htmlText = this.htmlText

    if ( fadedOut ) this.setFadeOut()
    if ( focus ) this.htmlText.focus()

    window.requestAnimationFrame( () => this.updateHtmlText() )

    if ( hidden ) this.hide()
  }


  makeHtmlText ( opt ) {
    const { parentDom, cssStyle, cssClass, fontFamily, fontSize, fontColor, textAlign, width, height, padding, multiLine } = opt

    const cssClassParam = cssClass === undefined ? '' : ` class="${ cssClass }"`
    const cssStyleParam = cssStyle === undefined ? '' : ` style="${ cssStyle }"`
    const tag = multiLine ? 'textarea' : 'input'
    if ( this.id === undefined ) this.id = `textField${ $( tag ).length }`
    const htmlText = $( `<${ tag } id="${ this.id }"${ cssClassParam }${ cssStyleParam }>` ).get( 0 )
    if ( parentDom !== undefined ) $( parentDom ).append( htmlText )
    htmlText.style.fontFamily = fontFamily
    htmlText.style.color = fontColor
    htmlText.style.textAlign = textAlign
    htmlText.onfocus = () => this.handleFocus()
    htmlText.onblur = () => this.handleBlur()
    htmlText.onkeydown = () => this.handleKeyDown()

    return htmlText
  }


  focus () {
    this.htmlText.focus()
  }


  blur () {
    this.htmlText.blur()
  }


  handleFocus () {
    this.box.visible = false
    this.boxFocus.visible = true
    this.updateHtmlText()
  }


  handleBlur () {
    this.boxFocus.visible = false
    this.box.visible = true
  }


  handleKeyDown () {
    if ( this.onChange !== undefined ) {
      // requestAnimationFrame to give the htmlText a chance to get the latest user input, otherwise this may lag one character behind
      window.requestAnimationFrame( () => {
        if ( this.previousText !== this.text ) this.onChange( this )
        this.previousText = this.text
      } )
    }
  }


  updateHtmlText () {
    const canvasScale = this.game.canvas.offsetWidth / this.game.canvas.width
    const globalPosition = this.toGlobal( new Phaser.Point() )
    const x = Math.round( this.game.canvas.offsetLeft + globalPosition.x * canvasScale )
    const y = Math.round( this.game.canvas.offsetTop + globalPosition.y * canvasScale )
    const fontSize = this.fontSize * canvasScale
    const width = ( this.width - this.padding * 2 ) * canvasScale
    const height = ( this.height - this.padding * 2 ) * canvasScale
    const padding = this.padding * canvasScale

    this.htmlText.style.left = `${ x }px`
    this.htmlText.style.top = `${ y }px`
    this.htmlText.style.fontSize = `${ fontSize }px`
    this.htmlText.style.width = `${ width }px`
    this.htmlText.style.height = `${ height }px`
    this.htmlText.style.padding = `${ padding }px`

    this.handleKeyDown() //just in case the text changed
  }


  set text ( text ) {
    this.htmlText.value = text
  }


  get text () {
    return this.htmlText.value
  }


  hide () {
    this.visible = false
    this.hideHtmlText()
  }


  show () {
    this.visible = true
    this.updateHtmlText()
    this.showHtmlText()
  }


  hideHtmlText () {
    this.htmlText.style.display = 'none'
  }


  showHtmlText () {
    this.htmlText.style.display = 'initial'
  }


  setFadeOut () {
    this.alpha = 0
    this.htmlText.style.opacity = 0
  }


  setFadeIn () {
    this.show()
    this.alpha = 1
    tthis.htmlText.style.opacity = 1
  }


  fadeIn ( opt ) {
    const { duration, onComplete } = _.defaults( opt || {}, {
      duration: 0.5,
    } )

    this.show()

    const tl = new TimelineMax()
    tl.to( this, duration, { alpha: 1 } )
    tl.to( this.htmlText.style, duration, { opacity: 1 }, 0 )
    if ( onComplete !== undefined ) onComplete()
  }


  fadeOut ( opt ) {
    const { duration, onComplete } = _.defaults( opt || {}, {
      duration: 0.5,
    } )

    const tl = new TimelineMax()
    tl.to( this, duration, { alpha: 0 } )
    tl.to( this.htmlText.style, duration, { opacity: 0 }, 0 )
    if ( onComplete !== undefined ) onComplete()
  }

}
