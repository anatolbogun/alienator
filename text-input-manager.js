export default class TextInputManager {

  constructor ( opt ) {
    const { game, parentDom, cssStyle, cssId, cssClass, focus, onChange } = _.defaults( opt, {
      parentDom: 'body',
      cssStyle: 'opacity: 0;',
      focus: false,
    } )

    this.game = game
    this.text = ''
    this.focusField

    this.domInput = this.makeDomInput( opt )
    game.input.keyboard.onDownCallback = () => this.handleKeyDown()
  }


  handleKeyDown () {
    this.domInput.focus()
    window.requestAnimationFrame( () => {
      this.text = this.domInput.value
      if ( this.focusField !== undefined ) this.focusField.text = this.text
    } )
  }


  makeDomInput ( opt ) {
    const { parentDom, cssStyle, cssId, cssClass, focus } = opt

    const cssClassParam = cssClass === undefined ? '' : ` class="${ cssClass }"`
    const cssIdParam = cssId === undefined ? '' : ` id="${ cssId }"`
    const cssStyleParam = cssStyle === undefined ? '' : ` style="${ cssStyle }"`
    const inputs = $( `<input${ cssIdParam }${ cssClassParam }${ cssStyleParam }>` )
    if ( parentDom !== undefined ) $( parentDom ).append( inputs )
    const domInput = inputs[ 0 ]

    return domInput
  }


  focus ( textField ) {
    this.focusField = textField
    this.text = this.focusField.text
    this.domInput.value = this.text
  }


  addTextField ( opt ) {
    opt = _.defaults( opt || {}, {
      game: this.game,
      focus: false,
    } )

    const textField = new TextField( opt )

    if ( focus ) this.focus( textField )

    return textField
  }
}


class TextField extends Phaser.Group {

  constructor ( opt ) {
    const { game, parent, text, x, y, width, height, borderThickness, borderColor, borderAlpha, fillColor, fillAlpha, edgeRadius, textStyle, onChange } = _.defaults( opt, {
      text: '',
      x: 0,
      y: 0,
      width: 100,
      height: 10,
      borderThickness: 1,
      borderColor: 0x000000,
      borderAlpha: 1,
      fillColor: 0xffffff,
      fillAlpha: 1,
      edgeRadius: 5,
      textStyle: _.defaults( opt.textStyle || {}, {
        font: 'BC Alphapipe, sans-serif',
        fontSize: '56px',
        fill: '#000000',
        align: 'left',
        boundsAlignH: 'left',
        boundsAlignV: 'top',
        wordWrap: true,
        wordWrapWidth: opt.width || 100,
        maxLines: 0,
      } ),
    } )

    super( game, parent )

    this.position.set( x, y )

    this.box = game.add.graphics( 0, 0, this )
    this.box.beginFill( fillColor, fillAlpha )
    this.box.lineStyle( borderThickness, borderColor, borderAlpha )
    this.box.drawRoundedRect( 0, 0, width, height, edgeRadius )
    console.log( 'BOX', this.box )

    this.textObj = game.add.text( 0, 0, text, textStyle, this )
    this.textObj.setTextBounds( 0, 0, width, height )
  }


  set text ( text ) {
    this.textObj.text = text
  }


  get text () {
    return this.textObj.text
  }

}
