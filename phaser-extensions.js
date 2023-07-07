Phaser.Text.prototype.basicWordWrap = function (text) {
  const wrap = ({ text, separator, replacement }) => {
    if (replacement === undefined) replacement = separator

    let result = ''
    const lines = text.split('\n')

    for (var i = 0; i < lines.length; i++) {
      let spaceLeft = this.style.wordWrapWidth
      const words = lines[i].split(separator)

      for (let j = 0; j < words.length; j++) {
        const wordWidth = this.context.measureText(words[j]).width
        const wordWidthWithSpace = wordWidth + this.context.measureText(replacement).width

        if (wordWidthWithSpace > spaceLeft) {
          // Skip printing the newline if it's the first word of the line that is greater than the word wrap width.
          if (j > 0) {
            result += '\n'
          }
          result += words[j] + replacement
          spaceLeft = this.style.wordWrapWidth - wordWidth
        } else {
          spaceLeft -= wordWidthWithSpace
          result += words[j] + replacement
        }
      }

      if (i < lines.length - 1) {
        result += '\n'
      }
    }

    return result
  }

  // we use both regular space and zero-width space characters as potential line break characters
  text = wrap({ text, separator: ' ' })
  text = wrap({ text, separator: /\u200B/, replacement: '' })

  return text

  // just to make sure and also break really long words that would exceed the max wordWrapWidth we run this through advancedWordWrap
  // TO DO: this cuts off part of the last letter of a long line of text, try to fix this
  // return this.advancedWordWrap( text )
}
