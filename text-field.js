export default class TextField extends Phaser.Group {
  // htmlAttributeType: can be any HTML input type such as 'submit', 'search', password, etc. which may change the soft keyboard layout if supported
  // htmlAttributeInputMode: smilar to type but often used in combination with type, e.g. type 'text', inputmode 'decimal' to show the numeric keyboard

  constructor(opt = {}) {
    const {
      game,
      id,
      htmlAttributeType,
      htmlAttributeInputMode,
      parent,
      text = '',
      x = 0,
      y = 0,
      width = 100,
      height = 10,
      padding = 20,
      multiLine = false,
      maxLength = 100,
      borderThickness = 1,
      borderColor = 0x000000,
      borderColorFocus = 0xf57e20,
      borderAlpha = 1,
      borderAlphaFocus = 1,
      fillColor = 0xffffff,
      fillColorFocus = 0xffffff,
      fillAlpha = 1,
      fillAlphaFocus = 1,
      edgeRadius = 5,
      fontFamily = 'BC Alphapipe, sans-serif',
      fontSize = 56,
      fontColor = '#000000',
      textAlign = 'left',
      parentDom = 'body',
      cssStyle = 'position: absolute; margin: 0px; background-color: transparent; border: none; resize: none; outline: none;',
      cssStyleFocus,
      cssId,
      cssClass,
      focus = false,
      fadedOut = false,
      hidden = false,
      onChange,
    } = opt

    super(game, parent)

    this.position.set(x, y)

    this.game = game
    this.id = id
    this.box = game.add.graphics(0, 0, this)
    this.box.beginFill(fillColor, fillAlpha)
    this.box.lineStyle(borderThickness, borderColor, borderAlpha)
    this.box.drawRoundedRect(0, 0, width, height, edgeRadius)

    this.boxFocus = game.add.graphics(0, 0, this)
    this.boxFocus.beginFill(fillColorFocus, fillAlphaFocus)
    this.boxFocus.lineStyle(borderThickness, borderColorFocus, borderAlphaFocus)
    this.boxFocus.drawRoundedRect(0, 0, width, height, edgeRadius)
    this.boxFocus.visible = false

    this.width = width
    this.height = height
    this.padding = padding
    this.maxLength = maxLength
    this.onChange = onChange
    this.fontSize = fontSize
    this.previousText = text

    this.htmlText = this.makeHtmlText({
      parentDom,
      cssStyle,
      cssStyleFocus,
      cssId,
      cssClass,
      fontFamily,
      fontColor,
      textAlign,
      multiLine,
      htmlAttributeType,
      htmlAttributeInputMode,
    })
    this.text = text
    this.cssBorder = this.htmlText.style.border

    if (fadedOut) this.setFadeOut()
    if (focus) this.htmlText.focus()

    window.requestAnimationFrame(() => this.updateHtmlText())

    if (hidden) this.hide()
  }

  makeHtmlText(opt = {}) {
    const {
      parentDom,
      cssStyle,
      cssClass,
      fontFamily,
      fontColor,
      textAlign,
      multiLine,
      htmlAttributeType,
      htmlAttributeInputMode,
    } = opt

    const cssClassParam = cssClass == null ? '' : ` class="${cssClass}"`
    const cssStyleParam = cssStyle == null ? '' : ` style="${cssStyle}"`
    const tag = multiLine ? 'textarea' : 'input'
    if (this.id == null) this.id = `textField${$(tag).length}`
    const type = htmlAttributeType == null ? '' : ` type="${htmlAttributeType}"`
    const inputMode = htmlAttributeInputMode == null ? '' : ` inputmode="${htmlAttributeInputMode}"`
    const maxLength = this.maxLength == null ? '' : ` maxLength="${this.maxLength}" `
    const htmlText = $(`<${tag} id="${this.id}"${type}${inputMode}${cssClassParam}${cssStyleParam}${maxLength}>`).get(0)
    if (parentDom != null) $(parentDom).append(htmlText)
    htmlText.style.fontFamily = fontFamily
    htmlText.style.color = fontColor
    htmlText.style.textAlign = textAlign
    htmlText.onfocus = () => this.handleFocus()
    htmlText.onblur = () => this.handleBlur()
    htmlText.onkeydown = () => this.handleKeyDown()

    return htmlText
  }

  focus() {
    this.htmlText.focus()
    return this
  }

  blur() {
    this.htmlText.blur()
    return this
  }

  handleFocus() {
    this.box.visible = false
    this.boxFocus.visible = true
    this.updateHtmlText()
  }

  handleBlur() {
    this.boxFocus.visible = false
    this.box.visible = true
  }

  handleKeyDown() {
    if (this.onChange != null) {
      // requestAnimationFrame to give the htmlText a chance to get the latest user input, otherwise this may lag one character behind
      window.requestAnimationFrame(() => {
        this.text = this.text.replace(/[\n\s]+/gm, ' ')
        if (this.previousText !== this.text) this.onChange(this)
        this.previousText = this.text
      })
    }
  }

  updateHtmlText() {
    const canvasScale = this.game.canvas.offsetWidth / this.game.canvas.width
    const globalPosition = this.toGlobal(new Phaser.Point())
    const x = Math.round(this.game.canvas.offsetLeft + globalPosition.x * canvasScale)
    const y = Math.round(this.game.canvas.offsetTop + globalPosition.y * canvasScale)
    const fontSize = this.fontSize * canvasScale
    const width = (this.width - this.padding * 2) * canvasScale
    const height = (this.height - this.padding * 2) * canvasScale
    const padding = this.padding * canvasScale

    this.htmlText.style.left = `${x}px`
    this.htmlText.style.top = `${y}px`
    this.htmlText.style.fontSize = `${fontSize}px`
    this.htmlText.style.width = `${width}px`
    this.htmlText.style.height = `${height}px`
    this.htmlText.style.padding = `${padding}px`

    this.handleKeyDown() //just in case the text changed

    return this
  }

  set text(text) {
    this.htmlText.value = text
  }

  get text() {
    return this.htmlText.value
  }

  hide() {
    this.visible = false
    this.hideHtmlText()
    return this
  }

  show() {
    this.visible = true
    this.updateHtmlText()
    this.showHtmlText()
    return this
  }

  hideHtmlText() {
    this.htmlText.style.display = 'none'
    return this
  }

  showHtmlText() {
    this.htmlText.style.display = 'initial'
    return this
  }

  setFadeOut() {
    this.alpha = 0
    this.htmlText.style.opacity = 0
    return this
  }

  setFadeIn() {
    this.show()
    this.alpha = 1
    this.htmlText.style.opacity = 1
    return this
  }

  setFadeOutText() {
    this.htmlText.style.opacity = 0
    return this
  }

  setFadeInText() {
    this.show()
    this.htmlText.style.opacity = 1
    return this
  }

  fadeIn(opt = {}) {
    const { duration = 0.5, onComplete } = opt

    this.show()

    const tl = new TimelineMax()
    tl.to(this, duration, { alpha: 1 })
    tl.to(this.htmlText.style, duration, { opacity: 1 }, 0)
    if (onComplete !== undefined) onComplete()

    return this
  }

  fadeOut(opt = {}) {
    const { duration = 0.5, onComplete } = opt

    const tl = new TimelineMax()
    tl.to(this, duration, { alpha: 0 })
    tl.to(this.htmlText.style, duration, { opacity: 0 }, 0)
    if (onComplete !== undefined) onComplete()

    return this
  }

  fadeInText(opt = {}) {
    const { duration = 0.5, onComplete } = opt

    this.show()

    const tl = new TimelineMax()
    tl.to(this.htmlText.style, duration, { opacity: 1 }, 0)
    if (onComplete !== undefined) onComplete()

    return this
  }

  fadeOutText(opt = {}) {
    const { duration = 0.5, onComplete } = opt

    const tl = new TimelineMax()
    tl.to(this.htmlText.style, duration, { opacity: 0 }, 0)
    if (onComplete !== undefined) onComplete()

    return this
  }
}
