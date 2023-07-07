import Alien from './alien.js'

const aliens = []
let dnaPool
let autoTraits
const margin = 0 // the margin from the edge where aliens are spawned
const aliensURL = './aliens/'

const body = $('body')[0]
const sizeFactor = 2 // this creates game dimensions sizeFactor the size of the dom body; keeping this at 1 creates quite a pixelated result, not very nice

const game = new Phaser.Game({
  width: body.clientWidth * sizeFactor || 1600,
  height: body.clientHeight * sizeFactor || 1600,
  renderer: Phaser.WEBGL,
  parent: 'viewer',
  transparent: true,
  antialias: true,
  multiTexture: true,
  scaleMode: Phaser.ScaleManager.EXACT_FIT, // EXACT_FIT only works here because we resize the world, otherwise this isn't recommended; RESIZE would be a nice option if it didn't pixelate things so much
  preserveDrawingBuffer: true,
  state: {
    preload,
    create,
    update,
  },
})

function preload() {
  game.load.atlas('alien', 'assets/alien.png', 'assets/alien.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
  game.load.atlas(
    'alien-combinations-1',
    'assets/alien-combinations-1.png',
    'assets/alien-combinations-1.json',
    Phaser.Loader.TEXTURE_ATLAS_JSON_HASH,
  )
  game.load.atlas(
    'alien-combinations-2',
    'assets/alien-combinations-2.png',
    'assets/alien-combinations-2.json',
    Phaser.Loader.TEXTURE_ATLAS_JSON_HASH,
  )
}

function create() {
  showLogo()

  game.onBlur.add(handleBlur)
  game.onFocus.add(handleFocus)

  game.input.maxPointers = 1
  game.scale.onSizeChange.add(handleResize)

  loadDNAs({ num: 100, onLoaded: handleLoaded })
}

function showLogo() {
  gsap
    .timeline({ delay: 0.5 })
    .set([$('.logo')], { scale: 1, y: '+=10em' })
    .set([$('.uco')], { scale: 2, y: '+=4em' })
    .to($('.logo'), { duration: 1, opacity: 1, scale: 2 }, 0)
    .to($('.logo'), { duration: 1, y: '-=10em', ease: 'back.out' }, 0)
    .to($('.uco'), { duration: 1, opacity: 1 }, 1)

    .to($('.logo'), { duration: 0.5, scale: 2.25, ease: 'power1.inOut' }, 2.5)
    .to($('.uco'), { duration: 0.5, scale: 2.25, y: '+=1em', ease: 'power1.inOut' }, 2.5)

    .to($('.logo'), { duration: 1, scale: 1, ease: 'power1.inOut' }, 3)
    .to($('.uco'), { duration: 1, scale: 1, y: '-=5em', ease: 'power1.inOut' }, 3)

    .to($('.join'), { duration: 1, opacity: 1 }, 4.5)

    .call(() => {
      if (aliens.length) {
        for (const alien of aliens) {
          alien.tl.play()
        }
        //   gsap.to( gsap.globalTimeline, { duration: 8, timeScale: 12, repeat: 1, yoyo: true, ease: 'back.out' } )
        gsap.to(aliens, { duration: 0.5, alpha: 1, stagger: 10 / aliens.length })

        autoTraits = gsap.timeline({ repeat: -1 })
        autoTraits.call(
          () => {
            const visibleAliens = _.filter(
              aliens,
              (alien) =>
                alien.alpha === 1 && alien.y > 300 && alien.y < game.world.height - 500 && !alien.isShowingTraits,
            )
            const alien = _.sample(visibleAliens)
            showAndHideTraits(alien)
          },
          null,
          5,
        )

        // const tl = gsap.timeline()

        // aliens.forEach( ( alien, i ) => {
        //   const delay = 1 / aliens.length * i
        //   tl.fromTo( alien, { alpha: 0 }, { duration: 0.25, alpha: 0.5, delay, ease: 'power4.in' } )
        //   tl.to( alien, { duration: 0.25, alpha: 0.1, delay, ease: 'power4.out' } )
        //   tl.to( alien, { duration: 0.5, alpha: 1, delay, ease: 'bounce.out' } )
        // } )
      }
    })

    .to($('footer'), { duration: 1, opacity: 1 }, 5.5)
}

function handleResize(scaleManager, width, height) {
  // the game.world dimensions change with a window resize
  game.scale.setGameSize(width * sizeFactor, height * sizeFactor)

  const scale = getAlienScale()

  for (const alien of aliens) {
    alien.scale.set(scale)
  }
}

function loadDNAs({ num, onLoaded }) {
  $.ajax({
    type: 'POST',
    url: 'load-multiple',
    data: { num },
  }).done(function (response) {
    try {
      const responseObj = JSON.parse(response)
      console.log('LOADING COMPLETE, SERVER RESPONSE:', responseObj)

      if (responseObj.success) {
        if (onLoaded !== undefined) onLoaded(responseObj.dnas)
      } else {
        // notice.show( { text: 'Oops. We encountered an error.\nThe alien could not be loaded.\nPlease reload the page\nto try again.', y: alien.y + 150, persistent: true } )
      }
    } catch (e) {
      console.warn(`Aliens don't exist :'(`, e)
    }
  })
}

function handleBlur() {
  gsap.globalTimeline.pause()
}

function handleFocus() {
  gsap.globalTimeline.play()
}

function getNumAliens(squarePixelsPerAlien = 275) {
  return Math.round((game.world.width * game.world.height) / squarePixelsPerAlien ** 2)
}

function getAlienScale(opt) {
  const { min, max, squarePixelsPerAlien } = _.defaults(opt || {}, {
    min: 0.3,
    max: 0.5,
    squarePixelsPerAlien: 275,
  })

  return _.clamp(Math.round((game.world.width * game.world.height) / squarePixelsPerAlien ** 2) / 100, min, max)
}

function handleLoaded(dnas) {
  dnaPool = _.cloneDeep(dnas)
  const numAliens = Math.min(dnas.length, getNumAliens())

  // console.log( 'MAX ALIENS', numAliens, ', NUM ALIENS', dnas.length )
  // console.log( 'SCALE', getAlienScale() )

  for (const i of _.range(numAliens)) {
    const alien = new Alien({
      game,
      groundY: 1,
      dna: dnas[i],
      onClick: (alien) => handleClick(alien),
      textStyle: {
        fontSize: '60px',
        fill: 0xffffff,
      },
      traitProperties: {
        width: 800,
        height: 200,
        padding: 10,
        edgeRadius: 25,
        x1: -50,
        x2: 50,
        yMargin1: -370,
        yMargin2: -150,
        color: 0xffffff,
        fromYOffset: 250,
        fromScale: 0.5,
        toYOffset: 0,
        toScale: 0.5,
        horizontalSway: 30,
        verticalSway: 30,
      },
    })

    setAlienPivotToBottom(alien)
    positionAlien(alien)
    moveAlien(alien)
    alien.alpha = 0
    alien.tl.progress(Math.random())
    alien.tl.pause()
    aliens.push(alien)
  }
}

function setAlienPivotToBottom(alien) {
  alien.pivot.set(0, alien.body.height * (1 - alien.body.anchor.y))
}

function getAvailableDNAs() {
  return _.differenceBy(dnaPool, _.map(aliens, 'dna'), 'id')
}

function getAvailableDNA() {
  return _.sample(getAvailableDNAs())
}

function positionAlien(alien) {
  alien.position.set(_.random(margin, game.world.width - margin), margin)
}

function moveAlien(alien) {
  const duration = 40
  const minX = margin

  const animation = (opt) => {
    const { alien, delay } = opt

    const scale = getAlienScale()
    alien.scale.set(scale)

    // on resize game.world.width can change, so we keep this inside the animation function
    const maxX = game.world.width - margin
    const maxY = (game.world.height - margin) * 1.5

    // keep the area around the logo free of aliens
    const maxXLeft = game.world.centerX - 200
    const maxXRight = game.world.centerX + 200

    const x1 = _.random(minX, maxX)
    const x2 = x1 < game.world.centerX ? _.random(minX, maxXLeft) : _.random(maxXRight, maxX)
    const x3 = x1 < game.world.centerX ? _.random(minX, maxXLeft) : _.random(maxXRight, maxX)
    const x4 = x1 < game.world.centerX ? _.random(minX, maxXRight) : _.random(maxXLeft, maxX)

    alien.tl = gsap
      .timeline({ delay })
      .to(alien, { duration: duration * 0.5, x: x1, ease: 'power1.inOut' })
      .to(alien, { duration: duration * 0.05, x: x2, ease: 'power1.inOut' })
      .to(alien, { duration: duration * 0.1, x: x3, ease: 'power1.inOut' })
      .to(alien, { duration: duration * 0.15, x: x4, ease: 'power1.inOut' })
      .to(alien, { duration: duration * 0.2, x: _.random(minX, maxX), ease: 'power1.inOut' })
      .to(alien, { duration, y: maxY, ease: 'power1.in' }, 0)
      .call(() => {
        const dna = _.cloneDeep(getAvailableDNA())

        if (dna !== undefined) {
          alien.make(dna)
          alien.trait1.setText(dna.trait1)
          alien.trait2.setText(dna.trait2)
          setAlienPivotToBottom(alien)
        }

        alien.y = 0
        animation({ alien })
      })
  }

  animation({ alien, delay: _.random(duration, true) })
}

function handleClick(alien) {
  if (alien.isShowingTraits) {
    window.location.href = `${aliensURL}${alien.dna.id}/`
  } else {
    showAndHideTraits(alien)
  }
}

function showAndHideTraits(alien) {
  alien.showTraits()
  gsap.delayedCall(4, () => alien.hideTraits())
}

function update() {
  const scaleFactor = 0.5
  _.sortBy(aliens, 'y').forEach((alien, i) => {
    alien.parent.setChildIndex(alien, i)

    // const positionYFactor = gsap.parseEase( 'power1.out' )( _.clamp( alien.y / game.world.height, 0, 1 ) ) // change this to gsap eases

    // alien.scale.set( positionYFactor * scaleFactor )

    // const rgb = Phaser.Color.getRGB( alien.dna.color )
    // const hsl = Phaser.Color.RGBtoHSL( rgb.r, rgb.g, rgb.b )
    // const tint = Phaser.Color.HSLtoRGB( hsl.h, hsl.s, hsl.l * positionYFactor ).color
    // alien.tint( { color: tint, setDNA: false } )
  })
}
