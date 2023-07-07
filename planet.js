export default class Planet extends Phaser.Group {
  constructor(opt) {
    const { game, parent, x, y, alpha, dayNightAlpha, atmosphereAlpha, atlasKey, duration, repeat } = _.defaults(
      opt || {},
      {
        x: 0,
        y: 0,
        alpha: 1,
        atmosphereAlpha: 0.5,
        dayNightAlpha: 0.8,
        atlasKey: 'assets',
        duration: 10,
        repeat: -1,
      },
    )

    super(game, parent, 'planet')

    this.position.set(x, y)
    this.alpha = alpha

    const atmosphere = game.add.image(0, 0, atlasKey, 'planetAtmosphere', this)
    atmosphere.alpha = atmosphereAlpha
    atmosphere.anchor.set(0.5)

    const planet = game.add.image(0, 0, atlasKey, 'planet', this)
    planet.anchor.set(0.5)

    const maskedGroup = game.add.group(this)
    const mask = game.add.graphics(0, 0, maskedGroup)
    mask.beginFill(0xff0000)
    mask.drawCircle(0, 0, 606)
    mask.anchor.set(0.5, 0.5)
    maskedGroup.mask = mask

    const continentsGroup = game.add.group(maskedGroup)
    const continents1 = game.add.image(15, 0, atlasKey, 'planetContinents', continentsGroup)
    const continents2 = game.add.image(615, 0, atlasKey, 'planetContinents', continentsGroup)
    continentsGroup.pivot.set(300, continents1.height / 2)

    const axisGroup = game.add.group(maskedGroup)
    axisGroup.angle = 23.5

    const dayNightGroup = game.add.group(axisGroup)
    const dayNight1 = game.add.image(-1200, 0, atlasKey, 'planetDayNight', dayNightGroup)
    const dayNight2 = game.add.image(0, 0, atlasKey, 'planetDayNight', dayNightGroup)
    dayNightGroup.pivot.set(300, dayNight1.height / 2)
    dayNightGroup.alpha = dayNightAlpha

    this.tl = new TimelineMax({ repeat })
      .fromTo(continentsGroup, { x: 0 }, { duration, x: -600, ease: 'linear', repeat: 1 }, 0)
      .fromTo(dayNightGroup, { x: 300 }, { duration: duration * 1.5, x: 1200, ease: 'linear' }, 0)
      .fromTo(dayNightGroup, { x: 0 }, { duration: duration * 0.5, x: 300, ease: 'linear' }, duration * 1.5)
  }
}
