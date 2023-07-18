import { assignValue } from './common.js'

const { delayedCall } = gsap

const HEAD = 'head'
const BODY = 'body'
const EYEBALL = 'eyeball'
const IRIS = 'iris'
const EYE_CLOSED = 'eyeClosed'

const eyeballHitTestPoints = {
  full: [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => getPointOnCircle({ angle, radius: 0.5 })),
  half: [
    { x: -0.25, y: 0 },
    { x: 0, y: 0 },
    { x: 0.25, y: 0 },
    ...[0, 45, 90, 135, 180].map((angle) => {
      const point = getPointOnCircle({ angle, radius: 0.5 })
      point.y *= 2 // because the half open eye height equals the radius of the circle the point y must me multiplied by 2
      return point
    }),
  ],
}

function getPointOnCircle(opt = {}) {
  const { radius = 1, angle = 0 } = opt

  const radian = (angle * Math.PI) / 180
  const x = radius * Math.cos(radian)
  const y = radius * Math.sin(radian)
  return { x, y }
}

const bodyPartDefaults = {
  head: {
    atlasKey: 'alien-1',
    anchorX: 0.5,
    anchorY: 0.9,
    neckWidth: 0.3,
    neckHeight: 0.1,
    neckOffsetX: 0,
    neckOffsetY: 0,
  },
  body: { atlasKey: 'alien-1', anchorX: 0.5, anchorY: 0, neckWidth: 0.5, neckHeight: 0.25 },
  eyeball: { atlasKey: 'alien-1', anchorX: 0.5, anchorY: 0.5, hitTestPoints: eyeballHitTestPoints.full },
  iris: { atlasKey: 'alien-1', anchorX: 0.5, anchorY: 0.5 },
  eyeClosed: { atlasKey: 'alien-1', anchorX: 0.5, anchorY: 0.5 },
}

const bodyPartProps = {
  heads: [
    // 0
    {
      anchorY: 0.9,
      neckWidth: 0.3,
      neckHeight: 0.22,
      neckOffsetY: -0.11,
      combinations: {
        body1: { anchorY: 0.7, neckWidth: 0.5, neckHeight: 0.25, neckOffsetY: -0.125 },
        body2: { anchorY: 0.7, neckWidth: 0.5, neckHeight: 0.25 },
        body3: { anchorX: 0.48, anchorY: 0.79 },
        body4: { anchorY: 0.8 },
        body5: { anchorY: 0.8 },
        body6: { anchorY: 0.82, neckWidth: 0.2 },
        body7: { anchorY: 0.7 },
        body8: { anchorY: 0.5 },
        body9: { anchorY: 0.7 },
        body10: { anchorX: 0.51, anchorY: 0.6 },
        body11: { anchorY: 0.75 },
        body12: { anchorY: 0.7 },
        body13: { anchorX: 0.62, anchorY: 0.7, neckWidth: 0.25 },
        body14: { anchorY: 0.55 },
        body15: { anchorY: 0.8 },
        body16: { anchorY: 0.7 },
        body17: { anchorY: 0.6 },
        body18: { anchorX: 0.72, anchorY: 0.35 },
        body19: { anchorY: 0.2 },
        body20: { anchorY: 0.7 },
        body21: { anchorY: 0.7 },
      },
    },
    // 1
    {
      anchorY: 0.84,
      neckWidth: 0.4,
      neckHeight: 0.1,
      neckOffsetY: -0.05,
      combinations: {
        body1: { neckWidth: 0.7, neckHeight: 0.15, neckOffsetY: -0.075 },
        body8: { anchorX: 0.6, anchorY: 0.65 },
        body10: { anchorX: 0.52, anchorY: 0.7 },
        body13: { anchorX: 0.65, neckWidth: 0.3 },
        body14: { anchorY: 0.7 },
        body18: { anchorX: 0.85, anchorY: 0.4 },
      },
    },
    // 2
    {
      anchorY: 0.9,
      neckWidth: 0.5,
      neckHeight: 0.1,
      neckOffsetY: -0.05,
      combinations: {
        body6: { anchorX: 0.55, neckOffsetX: 0.05 },
        body8: { anchorX: 0.55, anchorY: 0.7 },
        body10: { anchorX: 0.51, anchorY: 0.7, neckWidth: 0.42 },
        body12: { anchorY: 0.7 },
        body13: { anchorX: 0.67, neckWidth: 0.3 },
        body14: { anchorY: 0.75 },
        body17: { anchorY: 0.8 },
        body18: { anchorX: 0.86, anchorY: 0.38 },
        body19: { anchorY: 0.67 },
        body21: { anchorY: 0.7 },
      },
    },
    // 3
    {
      anchorY: 0.85,
      neckWidth: 0.3,
      neckHeight: 0.1,
      neckOffsetY: -0.025,
      combinations: {
        body1: { neckWidth: 0.5, neckHeight: 0.07 },
        body7: { neckWidth: 0.5 },
        body8: { anchorX: 0.55, anchorY: 0.6 },
        body10: { anchorX: 0.515, anchorY: 0.7 },
        body13: { anchorX: 0.63, anchorY: 0.7, neckWidth: 0.2 },
        body14: { anchorY: 0.65 },
        body18: { anchorX: 0.8, anchorY: 0.35 },
        body19: { anchorY: 0.4 },
        body21: { anchorY: 0.5 },
      },
    },
    // 4
    {
      anchorX: 0.49,
      anchorY: 0.73,
      neckWidth: 0.3,
      neckHeight: 0.2,
      neckOffsetY: -0.1,
      combinations: {
        body1: { neckWidth: 0.65, neckHeight: 0.25, neckOffsetY: -0.125 },
        body3: { anchorY: 0.8 },
        body6: { neckWidth: 0.2 },
        body7: { anchorY: 0.9 },
        body8: { anchorX: 0.55, anchorY: 0.45 },
        body10: { anchorX: 0.51, anchorY: 0.6 },
        body13: { anchorX: 0.63, anchorY: 0.7, neckWidth: 0.2 },
        body14: { anchorY: 0.5 },
        body18: { anchorX: 0.8, anchorY: 0.3 },
        body19: { anchorY: 0.5 },
        body21: { anchorY: 0.5 },
      },
    },
    // 5
    {
      anchorY: 0.8,
      neckWidth: 0.5,
      neckHeight: 0.15,
      neckOffsetY: -0.075,
      combinations: {
        body8: { anchorX: 0.6, anchorY: 0.6 },
        body10: { anchorX: 0.52, anchorY: 0.7, neckWidth: 0.3 },
        body13: { anchorX: 0.65, neckWidth: 0.3 },
        body14: { anchorY: 0.65 },
        body17: { anchorY: 0.5 },
        body18: { anchorX: 0.85, anchorY: 0 },
        body19: { anchorY: 0.5 },
        body21: { anchorY: 0.6 },
      },
    },
    // 6
    {
      anchorY: 0.9,
      neckWidth: 0.6,
      neckHeight: 0.1,
      combinations: {
        body8: { anchorX: 0.6, anchorY: 0.7 },
        body10: { anchorX: 0.52, anchorY: 0.7, neckWidth: 0.3 },
        body11: { neckWidth: 0.4 },
        body12: { anchorY: 0.7 },
        body13: { anchorX: 0.68, neckWidth: 0.3 },
        body14: { anchorY: 0.7 },
        body17: { anchorY: 0.8 },
        body18: { anchorX: 0.85, anchorY: 0.3 },
        body19: { anchorY: 0.7 },
        body21: { anchorY: 0.8 },
      },
    },
    // 7
    {
      anchorY: 0.9,
      neckWidth: 0.6,
      neckHeight: 0.14,
      neckOffsetY: -0.07,
      combinations: {
        body8: { anchorX: 0.6, anchorY: 0.6 },
        body9: { anchorY: 0.7 },
        body10: { anchorX: 0.52, anchorY: 0.7, neckWidth: 0.3 },
        body11: { anchorY: 0.8, neckWidth: 0.4 },
        body12: { anchorY: 0.7 },
        body13: { anchorX: 0.66, neckWidth: 0.3 },
        body14: { anchorY: 0.7 },
        body15: { anchorY: 0.7 },
        body16: { anchorY: 0.8 },
        body17: { anchorY: 0.7 },
        body18: { anchorX: 0.86, anchorY: 0.1 },
        body19: { anchorY: 0.7 },
        body20: { anchorY: 0.8 },
        body21: { anchorY: 0.7 },
      },
    },
    // 8
    {
      anchorY: 0.7,
      neckWidth: 0,
      neckHeight: 0,
      combinations: {
        body3: { anchorX: 0.48, anchorY: 0.63 },
        body8: { anchorY: 0.45 },
        body9: { anchorY: 0.6 },
        body13: { anchorX: 0.65 },
        body14: { anchorY: 0.3 },
        body16: { anchorY: 0.5 },
        body17: { anchorY: 0.4 },
        body18: { anchorX: 0.9, anchorY: 0.2 },
        body19: { anchorY: 0.4 },
        body21: { anchorY: 0.4 },
      },
    },
    // 9
    {
      anchorY: 0.9,
      neckWidth: 0,
      combinations: {
        body8: { anchorX: 0.56, anchorY: 0.65 },
        body9: { anchorY: 0.7 },
        body11: { anchorX: 0.545, anchorY: 0.64 },
        body14: { anchorY: 0.72 },
        body15: { anchorY: 0.75 },
        body16: { anchorY: 0.83 },
        body18: { anchorX: 0.65, anchorY: 0.27 },
        body21: { anchorY: 0.61 },
      },
      // speial combinations: body10, body12, body13, body17, body18 (?), body19, body20
    },
    // 10
    {
      anchorY: 0.9,
      neckWidth: 0.3,
      neckHeight: 0.1,
      neckOffsetY: -0.05,
      combinations: {
        body8: { anchorX: 0.6, anchorY: 0.7 },
        body10: { anchorX: 0.52, anchorY: 0.75, neckWidth: 0.3 },
        body13: { anchorX: 0.65, neckWidth: 0.2 },
        body14: { anchorY: 0.7 },
        body18: { anchorX: 0.77, anchorY: 0.45 },
        body19: { anchorY: 0.8 },
      },
    },
    // 11
    {
      anchorX: 0.49,
      anchorY: 0.88,
      neckWidth: 0.4,
      neckHeight: 0.1,
      neckOffsetY: -0.05,
      combinations: {
        body8: { anchorX: 0.6, anchorY: 0.7 },
        body10: { anchorX: 0.52, anchorY: 0.75, neckWidth: 0.3 },
        body13: { anchorX: 0.7, neckWidth: 0.4 },
        body14: { anchorY: 0.7 },
        body18: { anchorX: 0.88, anchorY: 0.51, neckWidth: 0.35 },
      },
    },
    // 12
    {
      anchorY: 0.9,
      neckWidth: 0.5,
      neckHeight: 0.1,
      neckOffsetY: -0.05,
      combinations: {
        body8: { anchorX: 0.52, anchorY: 0.69 },
        body9: { anchorY: 0.7 },
        body10: { anchorX: 0.52, anchorY: 0.75, neckWidth: 0.2 },
        body11: { anchorX: 0.53, anchorY: 0.8 },
        body12: { anchorY: 0.7 },
        body13: { anchorX: 0.63, neckWidth: 0.2 },
        body14: { anchorY: 0.65 },
        body15: { anchorY: 0.7 },
        body16: { anchorY: 0.77 },
        body17: { anchorY: 0.67 },
        body18: { anchorX: 0.7, anchorY: 0.25, neckWidth: 0.25 },
        body19: { anchorY: 0.7, neckWidth: 0.4 },
        body20: { anchorY: 0.8 },
        body21: { anchorY: 0.7 },
      },
    },
    // 13
    {
      anchorY: 0.9,
      neckWidth: 0,
      combinations: {
        body8: { anchorY: 0.7 },
        body9: { anchorY: 0.93 },
        body11: { anchorX: 0.49, anchorY: 0.95 },
        body12: { anchorX: 0.45, anchorY: 0.7 },
        body14: { anchorY: 0.7 },
        body15: { anchorX: 0.43, anchorY: 0.94 },
        body16: { anchorY: 0.85 },
        body17: { anchorX: 0.42, anchorY: 0.93 },
        body19: { anchorX: 0.45, anchorY: 0.5 },
        body20: { anchorX: 0.45, anchorY: 0.85 },
        body21: { anchorX: 0.435, anchorY: 0.9 },
      },
      // special combinations: body10, body13, body18, body19 (?)
    },
    // 14
    {
      anchorX: 0.48,
      anchorY: 0.9,
      neckWidth: 0.4,
      neckHeight: 0.1,
      combinations: {
        body8: { anchorX: 0.6, anchorY: 0.7 },
        body10: { anchorX: 0.52, anchorY: 0.75, neckWidth: 0.3 },
        body11: { anchorX: 0.53, anchorY: 0.8 },
        body12: { anchorY: 0.7 },
        body13: { anchorX: 0.65, neckWidth: 0.2 },
        body14: { anchorY: 0.65 },
        body17: { anchorY: 0.85 },
        body18: { anchorX: 0.78, anchorY: 0.4, neckWidth: 0.25 },
        body19: { anchorY: 0.7, neckWidth: 0.4 },
        body21: { anchorY: 0.7 },
      },
    },
    // -----------> new heads from here, check properties <-----------------
    // 15
    {
      anchorY: 0.94,
      neckWidth: 0.263,
      neckHeight: 0.15,
      combinations: {
        body1: { anchorY: 1.37 },
        body2: { anchorY: 1.45 },
        body7: { anchorX: 0.52, anchorY: 1.15 },
        body8: { anchorX: 0.51, anchorY: 0.93 },
        body10: { anchorX: 0.52, anchorY: 0.87 },
        body11: { anchorX: 0.53, anchorY: 0.945 },
        body13: { anchorX: 0.645 },
        body14: { anchorY: 0.69 },
        body18: { anchorX: 0.73, anchorY: 0.28 },
        body21: { anchorY: 0.9 },
      },
      // special combinations: body3, body4, body6
    },
    // 16
    {
      atlasKey: 'alien-2',
      anchorY: 0.96,
      neckWidth: 0.265,
      neckHeight: 0.1,
      combinations: {
        body1: { anchorY: 1.25 },
        body2: { anchorY: 1.31 },
        body7: { anchorX: 0.52, anchorY: 1.1 },
        body8: { anchorX: 0.51, anchorY: 0.98 },
        body10: { anchorX: 0.52, anchorY: 0.91 },
        body11: { anchorX: 0.53, anchorY: 0.99 },
        body13: { anchorX: 0.645, anchorY: 0.99 },
        body14: { anchorY: 0.8 },
        body18: { anchorX: 0.73, anchorY: 0.51 },
      },
      // special combinations: body3, body4, body6
    },
    // 17
    {
      atlasKey: 'alien-2',
      anchorY: 0.9,
      neckWidth: 0.48,
      neckHeight: 0.08,
      neckOffsetX: -0.05,
      neckOffsetY: -0.04,
      combinations: {
        body1: { anchorY: 1.05 },
        body2: { anchorY: 1.1 },
        body6: { anchorX: 0.42, neckOffsetX: -0.11 },
        body7: { anchorY: 1.02 },
        body8: { anchorY: 0.87 },
        body9: { anchorY: 0.925 },
        body10: { anchorX: 0.42, anchorY: 0.88, neckWidth: 0.4, neckOffsetX: -0.1 },
        body13: { anchorX: 0.59, anchorY: 0.93, neckWidth: 0.3, neckOffsetX: -0.15 },
        body14: { anchorY: 0.8 },
        body17: { anchorX: 0.45, anchorY: 0.85 },
        body18: { anchorX: 0.8, anchorY: 0.5 },
        body19: {
          anchorX: 0.47,
          anchorY: 0.8,
        },
      },
      // special combinations: body3,
    },
    // 18
    {
      atlasKey: 'alien-2',
      anchorY: 0.87,
      neckWidth: 0.3,
      neckHeight: 0.1,
      neckOffsetY: -0.1,
      combinations: {
        body8: { anchorY: 0.6 },
        body10: { anchorX: 0.52, anchorY: 0.82 },
        body11: { anchorY: 0.78 },
        body13: { anchorX: 0.67, anchorY: 0.85 },
        body14: { anchorY: 0.7 },
        body17: { anchorY: 0.83 },
        body18: { anchorX: 0.85, anchorY: 0.35 },
        body19: { anchorY: 0.83 },
        body21: { anchorY: 0.83 },
      },
    },
    // 19
    {
      atlasKey: 'alien-2',
      anchorY: 0.83,
      neckWidth: 0.3,
      neckHeight: 0.1,
      neckOffsetY: -0.15,
      combinations: {
        body8: { anchorX: 0.46, anchorY: 0.65 },
        body10: { anchorX: 0.52, anchorY: 0.82 },
        body13: { anchorX: 0.67, anchorY: 0.83 },
        body14: { anchorY: 0.69 },
        body18: { anchorX: 0.85, anchorY: 0.35 },
      },
    },
  ],
  bodies: [
    // 0
    { anchorY: 0, neckWidth: 0.4 },
    // 1
    { anchorY: 0.25, neckWidth: 0.6 },
    // 2
    { anchorY: 0.3, neckWidth: 0.6 },
    // 3
    { anchorX: 0.52, anchorY: 0, neckWidth: 0.8 },
    // 4
    { anchorY: 0, neckWidth: 0.5 },
    // 5
    { anchorY: 0, neckWidth: 0.6 },
    // 6
    { anchorX: 0.64, anchorY: 0, neckWidth: 0 },
    // 7
    { anchorY: 0.2, neckWidth: 0.8 },
    // 8
    { anchorY: 0, neckWidth: 0.8 },
    // -----------> new bodies from here, check properties <-----------------
    // 9
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 10
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 11
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 12
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 13
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 14
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 15
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 16
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 17
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 18
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 19
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 20
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
    // 21
    { atlasKey: 'alien-2', anchorY: 0, neckWidth: 0.8 },
  ],
  eyeballs: [
    // 0
    { anchorY: 0.5, hitTestPoints: eyeballHitTestPoints.full },
    // 1
    { anchorY: 0.5, hitTestPoints: eyeballHitTestPoints.full },
    // 2
    { anchorY: 0.5, hitTestPoints: eyeballHitTestPoints.full },
    // 3
    { anchorY: 0, hitTestPoints: eyeballHitTestPoints.half },
    // 4
    { anchorY: 0, hitTestPoints: eyeballHitTestPoints.half },
    // 5
    { anchorY: 0, hitTestPoints: eyeballHitTestPoints.half },
  ],
  irises: [
    // 0
    { anchorY: 0.5 },
    // 1
    { anchorY: 0.5 },
    // 2
    { anchorY: 0.5 },
    // 3
    { anchorY: -0.2 },
    // 4
    { anchorY: -0.33 },
    // 5
    { anchorY: -0.6 },
  ],
  eyesClosed: [
    // 0
    { anchorY: 0.15 },
    // 1
    { anchorY: 0.075 },
    // 2
    { anchorY: 0.06 },
    // 3
    { anchorY: 0 },
    // 4
    { anchorY: 0 },
    // 5
    { anchorY: 0 },
  ],
}

export default class Alien extends Phaser.Group {
  constructor(opt = {}) {
    const {
      game,
      parent,
      x = 0,
      y = 0,
      atlasKey = 'alien',
      atlasKeyCombinations = ['alien-combinations-1', 'alien-combinations-2'],
      validColors,
      dna,
      groundY = 0.6,
      withBMD = false,
      eyeCheck = _.isNil(opt.withBMD) ? false : opt.withBMD,
      logDNAChange = false,
      onDNAChange,
      enabled,
      pixelPerfectAlpha,
      pixelPerfectClick,
      pixelPerfectOver,
      useHandCursor,
      onClick,
    } = opt

    const textStyle = assignValue(
      {
        font: 'BC Alphapipe, sans-serif',
        fontSize: '56px',
        fill: '#ffffff',
        align: 'left',
        boundsAlignH: 'center',
        boundsAlignV: 'middle',
      },
      opt.textStyle,
    )

    const traitProperties = assignValue(
      {
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
        textStyle,
      },
      opt.traitProperties,
    )

    super(game, parent, 'alien')

    this.position.set(x, y)

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

    this.combinations = this.makeCombinations({
      atlasKeys: atlasKeyCombinations,
      withBMD,
    })
    this.bodies = bodyPartProps.bodies.map((props, index) =>
      this.makeItem({
        ...bodyPartDefaults.body,
        ...props,
        parent: this,
        type: BODY,
        index,
        withBMD,
      }),
    )
    this.heads = bodyPartProps.heads.map((props, index) =>
      this.makeItem({
        ...bodyPartDefaults.head,
        ...props,
        parent: this,
        type: HEAD,
        index,
        withBMD,
      }),
    )

    this.eyes = []

    this.mapping = {
      body: this.bodies,
      head: this.heads,
      eye: this.eyes,
    }

    this.dna = assignValue({ name: '', trait1: '', trait2: '' }, dna)

    if (dna == null) {
      this.randomize()
    } else {
      this.make(dna)
    }

    this.makeTraits(this.traitProperties)

    if (onClick != null)
      this.setupClick({
        enabled,
        pixelPerfectAlpha,
        pixelPerfectClick,
        pixelPerfectOver,
        useHandCursor,
        onClick,
      })
  }

  fixDNAPropertyTypes(opt = {}) {
    const { dna, numberTypes = ['id', 'headID', 'bodyID', 'color', 'index', 'x', 'y'] } = opt

    if (dna == null) return

    const toNumber = (value, key, obj) => {
      if (numberTypes.includes(key)) obj[key] = Number(value)
    }

    _.forOwn(dna, toNumber)
    dna.eyes?.forEach((eye) => _.forOwn(eye, toNumber))
  }

  sampleArrayIndex(array) {
    return _.sample(_.range(array.length))
  }

  toLocal(opt = {}) {
    const { x = 0, y = 0, from } = opt

    return this.toLocal({ x, y }, from)
  }

  makeCombinations({ atlasKeys, withBMD }) {
    let combinations = []

    atlasKeys?.forEach((atlasKey) => {
      const frameNames = Object.keys(this.game.cache.getFrameData(atlasKey)._frameNames)

      frameNames.forEach((frameName) => {
        const parts = frameName.split('-')
        const bodyID = _.toNumber(_.trimStart(parts[0], 'body'))
        const headID = _.toNumber(_.trimStart(parts[1], 'head'))
        const image = this.game.add.sprite(0, 0, atlasKey, frameName, this)
        image.visible = false
        image.anchor.set(0.5, 0.5)
        const combination = { headID, bodyID, image }

        if (withBMD) {
          image.bmd = this.makeBitmapData({ sourceImage: image })
          image.bmd.inputEnabled = true
        }

        combinations.push(combination)
      })
    })

    return combinations
  }

  randomize() {
    const bodyID = this.sampleArrayIndex(this.bodies)
    const headID = this.sampleArrayIndex(this.heads)
    const color = this.getRandomColor()

    this.make({ bodyID, headID, color })
  }

  // returns false if the eye is overlapping another eye or if it exceeds the body
  eyeTest({ eye }) {
    eye.inputEnabled = true
    eye.pixelPerfectOver = true
  }

  destroyEyes() {
    this.eyes?.forEach((eye) => {
      eye.killBlinking()
      eye.destroy()
    })

    this.eyes = []
    this.dna.eyes = []
  }

  getRandomColor() {
    return this.validColors != null ? _.sample(this.validColors).color : _.random(0, 0xffffff)
  }

  make(dna = {}) {
    this.fixDNAPropertyTypes({ dna })

    const {
      bodyID = this.dna.bodyID,
      headID = this.dna.headID,
      color = this.dna.color,
      eyes = Array.isArray(this.dna.eyes) ? this.dna.eyes : [],
      positionOnGround = true,
      logDNA = this.logDNAChange,
    } = dna

    this.hideCombinations()

    this.combination = this.getCombination({ headID, bodyID })

    if (this.combination == null) {
      const body = this.showItem({
        type: BODY,
        id: bodyID,
        combinationID: `${HEAD}${headID}`,
      })
      const head = this.showItem({
        type: HEAD,
        id: headID,
        combinationID: `${BODY}${bodyID}`,
      })

      this.neck?.destroy()
      const width = Math.min(head.neckWidth * head.width, body.neckWidth * body.width)
      const height = head.neckHeight * head.height
      this.neck = this.makeNeck({ width, height })
      this.neck.x = this.neck.width + (0.5 - head.anchor.x + head.neckOffsetX) * head.width
      this.neck.y = head.height - (head.anchor.y - head.neckOffsetY) * head.height

      head.addChild(this.neck)

      if (positionOnGround) this.y = this.game.world.height * this.groundY - body.height + body.height * body.anchor.y
    } else {
      this.hideHeads()
      this.hideBodies()

      this.combination.tint = color
      this.combination.visible = true
      this.dna.headID = headID
      this.dna.bodyID = bodyID

      if (positionOnGround)
        this.y = this.game.world.height * this.groundY - this.combination.height * this.combination.anchor.y
    }

    this.destroyEyes()

    eyes?.forEach((eyeProps) => this.makeEye(eyeProps))

    this.tint({ color })

    if (this.onDNAChange != null) this.onDNAChange({ dna: this.dna })

    if (logDNA) this.logDNA()

    // anything with bitmapdata is expensive performance-wise, so only use this if necessary (i.e. only for the editor)
    if (this.eyeCheck && this.withBMD) requestAnimationFrame(() => this.hideAndDestroyOutOfBodyEyes())

    if (this.enabled) this.enable()
  }

  // segments Japanese words for potential line breaks with the TinySegmenter module.
  // We use a zero-width space unicode character \u200b to declare potential line breaks.
  // This zero-width unicode character is not supported by the Phaser word wrap functions, so
  // we need to overwrite Phaser.Text.prototype.basicWordWrap to also split words at /\u200B/.
  // In basicWordWrap we also run the text through advancedWordWrap to break long words that
  // would otherwise exceed the wordWrapWidth.
  // See phaser-extensions.js
  segmentJapaneseText(opt = {}) {
    const {
      string,
      separator = '\u200b', // zero-width space unicode character
    } = opt

    const segmenter = new TinySegmenter()
    const segments = segmenter.segment(string)
    return segments.join(separator)
  }

  makeTraits(opt = {}) {
    const { x1, x2, yMargin1, yMargin2, width, height, padding, edgeRadius, color, textStyle } = opt

    this.trait1 = this.makeTrait({
      text: this.dna.trait1,
      x: x1,
      yMargin: yMargin1,
      width,
      height,
      padding,
      edgeRadius,
      color,
      textStyle,
    })
    this.trait2 = this.makeTrait({
      text: this.dna.trait2,
      x: x2,
      yMargin: yMargin2,
      width,
      height,
      padding,
      edgeRadius,
      color,
      textStyle,
    })
  }

  makeTrait(opt = {}) {
    const { text, x, yMargin, width, height, padding, edgeRadius, color, textStyle } = opt

    const group = this.game.add.group(this)
    group.alpha = 0

    const textWidth = width - 2 * padding
    const textHeight = height - 2 * padding

    group.pivot.set(width / 2, height / 2)

    const box = this.game.add.graphics(0, 0, group)
    box.beginFill(color)
    box.drawRoundedRect(0, 0, width, height, edgeRadius)

    textStyle.wordWrap = true
    textStyle.wordWrapWidth = textWidth

    const textObj = this.game.add.text(padding, padding, '', textStyle, group)
    textObj.setTextBounds(0, 0, textWidth, textHeight)
    textObj.originFontSize = textObj.fontSize

    group.updatePosition = () => {
      const y = this.top - this.y + yMargin
      group.position.set(x, y)
      group.targetPosition = { x, y }
      return group
    }

    group.setText = (text) => {
      if (text == null) return

      textObj.text = this.segmentJapaneseText({ string: text })
      textObj.fontSize = textObj.originFontSize
      this.fitTextToBounds({ textObj })
      return group
    }

    group.setText(text)
    group.updatePosition()

    return group
  }

  updateTraits() {
    ;['trait1', 'trait2'].forEach((key) => {
      const trait = this[key]
      const text = this.dna[key]
      trait.setText(text)
      trait.updatePosition()
    })
  }

  showTraits(opt = {}) {
    const {
      duration = 1,
      fromScale = this.traitProperties.fromScale,
      fromYOffset = this.traitProperties.fromYOffset,
      sway = true,
      onComplete,
    } = opt

    const tl = new TimelineMax()
      .set([this.trait1, this.trait2], {
        alpha: 0,
        y: this.trait1.targetPosition.y + fromYOffset,
      })
      .set(this.trait1.scale, { x: fromScale, y: fromScale })
      .set(this.trait2.scale, { x: fromScale, y: fromScale })
      .to(
        this.trait1,
        {
          duration,
          y: this.trait1.targetPosition.y,
          alpha: 1,
          ease: Power2.easeIn,
        },
        0,
      )
      .to(this.trait1.scale, { duration, x: 1, y: 1, ease: Power2.easeOut }, 0)
      .to(
        this.trait2,
        {
          duration,
          y: this.trait2.targetPosition.y,
          alpha: 1,
          ease: Power2.easeIn,
        },
        duration / 2,
      )
      .to(this.trait2.scale, { duration, x: 1, y: 1, ease: Power2.easeOut }, duration / 2)
      .call(() => (this.traitsVisible = true))

    if (onComplete != null) tl.call(onComplete)
    if (sway) tl.call(() => this.swayTraits({ duration: duration * 2 }))

    this.showTraitsTl = tl
  }

  hideTraits(opt = {}) {
    const {
      duration = 0.4,
      toScale = this.traitProperties.toScale,
      toYOffset = this.traitProperties.toYOffset,
      onComplete,
    } = opt

    const tl = new TimelineMax()
      .to(
        this.trait1,
        {
          duration,
          y: this.trait1.targetPosition.y + toYOffset,
          alpha: 0,
          ease: Power2.easeIn,
        },
        0,
      )
      .to(this.trait1.scale, { duration, x: toScale, y: toScale, ease: Back.easeIn }, 0)
      .to(
        this.trait2,
        {
          duration,
          y: this.trait2.targetPosition.y + toYOffset,
          alpha: 0,
          ease: Power2.easeIn,
        },
        duration / 2,
      )
      .to(this.trait2.scale, { duration, x: toScale, y: toScale, ease: Back.easeIn }, duration / 2)
      .call(() => (this.traitsVisible = false))

    if (this.swayTl != null) tl.call(() => this.swayTl.kill())
    if (onComplete != null) tl.call(onComplete)

    this.hideTraitsTl = tl
  }

  toggleTraits() {
    if (this.traitsVisible && (this.hideTraitsTl == null || this.hideTraitsTl.progress() === 1)) {
      this.hideTraits()
    } else if (this.showTraitsTl == null || this.showTraitsTl.progress() === 1) {
      this.showTraits()
    }
  }

  swayTraits(opt = {}) {
    const {
      duration = 2,
      horizontalSway = this.traitProperties.horizontalSway,
      verticalSway = this.traitProperties.verticalSway,
    } = opt

    if (this.swayTl != null) this.swayTl.kill()

    this.swayTl = new TimelineMax()
      .to(
        this.trait1,
        {
          duration: duration,
          y: this.trait1.targetPosition.y + verticalSway,
          ease: Power1.easeInOut,
          repeat: -1,
          yoyo: true,
        },
        0,
      )
      .to(
        this.trait2,
        {
          duration: duration,
          y: this.trait2.targetPosition.y + verticalSway,
          ease: Power1.easeInOut,
          repeat: -1,
          yoyo: true,
        },
        0,
      )
      .to(
        this.trait1,
        {
          duration: duration,
          x: this.trait1.targetPosition.x + horizontalSway,
          ease: Power1.easeInOut,
          repeat: -1,
          yoyo: true,
        },
        0,
      )
      .to(
        this.trait2,
        {
          duration: duration,
          x: this.trait2.targetPosition.x - horizontalSway,
          ease: Power1.easeInOut,
          repeat: -1,
          yoyo: true,
        },
        0,
      )
  }

  get isShowingTraits() {
    return this.trait1.alpha > 0 || this.trait2.alpha > 0
  }

  fitTextToBounds(opt = {}) {
    const { textObj, minFontSize = 24 } = opt

    if (textObj.height <= textObj.textBounds.height) return

    while (textObj.height > textObj.textBounds.height && textObj.fontSize > minFontSize) {
      textObj.fontSize -= 1
    }
  }

  hideCombinations() {
    this.combinations.forEach((combination) => {
      combination.image.visible = false
    })
  }

  hideHeads() {
    this.heads?.forEach((head) => {
      head.visible = false
    })
  }

  hideBodies() {
    this.bodies.forEach((body) => {
      body.visible = false
    })
  }

  getCombination({ headID, bodyID }) {
    const combination = _.find(this.combinations, { headID, bodyID })
    if (combination != null) return combination.image
  }

  tint(opt = {}) {
    const { color = this.dna.color || 0xffffff, setDNA = true } = opt

    if (setDNA) this.dna.color = color

    if (this.body != null) this.body.tint = color
    if (this.head != null) this.head.tint = color
    if (this.combination != null) this.combination.tint = color

    const irisColor = this.getIrisColor({ color })

    this.eyes?.forEach((eye) => {
      eye.iris.tint = irisColor
    })

    if (this.neck != null) this.neck.tint = color
    this.isTintAdjusted = false
  }

  adjustTintLuminosity(opt = {}) {
    if (this.isTintAdjusted) return // performance improvement

    const hsl = this.colorToHSL({ color: this.dna.color })

    const { adjustment = (1 - hsl.l) / 2 } = opt

    const luminosity = Math.min(1, hsl.l + adjustment)
    const rgb = Phaser.Color.HSLtoRGB(hsl.h, hsl.s, luminosity)
    this.tint({ color: rgb.color, setDNA: false })
    this.isTintAdjusted = true
  }

  getIrisColor(opt = {}) {
    const { luminosityThreshold = 0.95, color = this.dna.color } = opt

    // when luminosity is very high, tint the iris black
    const hsl = this.colorToHSL({ color })
    return hsl.l > luminosityThreshold ? 0x000000 : color
  }

  colorToHSL({ color }) {
    const rgb = Phaser.Color.valueToColor(color)
    return Phaser.Color.RGBtoHSL(rgb.r, rgb.g, rgb.b)
  }

  setEye({ eye }) {
    this.head.addChild(eye)
    eye.y = -this.head.anchor.y * this.head.height + this.head.height / 2
  }

  makeNeck(opt = {}) {
    const { width = 0, height = 50 } = opt

    const graphics = this.game.add.graphics(width, height)
    graphics.beginFill(0xffffff)
    graphics.drawRect(-width * 1.5, -height / 2, width, height)

    return graphics
  }

  setColor(opt = {}) {
    const { color = this.dna.color == null ? 0xffffff : this.dna.color } = opt

    this.make({ color })
  }

  showItem({ type, id, combinationID }) {
    this.mapping[type]?.forEach((item) => {
      item.visible = false
    })

    const item = this.mapping[type][id]

    // check for special combinations and adjust props
    if (
      item.defaultProps != null &&
      item.defaultProps.combinations != null &&
      item.defaultProps.combinations[combinationID] != null
    ) {
      const props = _.merge(_.clone(item.defaultProps), item.defaultProps.combinations[combinationID])
      this.setItemProps({ item, props })
    } else if (item.defaultProps != null) {
      this.setItemProps({ item })
    }

    item.visible = true
    item.scale.set(1)
    this.dna[`${type}ID`] = id

    return item
  }

  setItemProps({ item, props }) {
    const { anchorX, anchorY, neckWidth, neckHeight, neckOffsetX, neckOffsetY } = props || item.defaultProps

    item.anchor.set(anchorX, anchorY)
    Object.assign(item, { neckWidth, neckHeight, neckOffsetX, neckOffsetY })
  }

  makeItem(opt = {}) {
    const {
      parent,
      type,
      index,
      withBMD,
      atlasKey,
      anchorX,
      anchorY,
      neckWidth,
      neckHeight,
      neckOffsetX,
      neckOffsetY,
      combinations,
      hitTestPoints,
    } = opt

    const item = this.game.add.sprite(0, 0, atlasKey, `${type}${index}`)
    parent?.addChild(item)
    item.defaultProps = {
      anchorX,
      anchorY,
      neckWidth,
      neckHeight,
      neckOffsetX,
      neckOffsetY,
      combinations,
      hitTestPoints,
    }
    this.setItemProps({ item })
    if (withBMD) {
      item.bmd = this.makeBitmapData({ sourceImage: item })
      item.bmd.inputEnabled = true
    }
    return item
  }

  makeEye(opt = {}) {
    const { parent = this, index = 0, x = 0, y = 0, blink = true, attach = true } = opt

    const eye = this.game.add.sprite()
    parent?.addChild(eye)
    eye.index = index
    eye.eyeball = this.makeItem({
      ...bodyPartDefaults.eyeball,
      parent: eye,
      type: EYEBALL,
      index,
      prop: bodyPartProps.eyeballs[index],
      withBMD: this.withBMD,
    })
    eye.iris = this.makeItem({
      ...bodyPartDefaults.iris,
      parent: eye,
      type: IRIS,
      index,
      prop: bodyPartProps.irises[index],
    })
    eye.closed = this.makeItem({
      ...bodyPartDefaults.eyeClosed,
      parent: eye,
      type: EYE_CLOSED,
      index,
      prop: bodyPartProps.eyesClosed[index],
    })
    eye.closingFrame = `eyeClosing${index}`
    eye.closedFrame = `eyeClosed${index}`
    eye.hitTestPoints = bodyPartProps.eyeballs[index].hitTestPoints
    eye.iris.tint = this.getIrisColor()
    eye.addChild(eye.eyeball)
    eye.addChild(eye.iris)
    eye.addChild(eye.closed)
    eye.position.set(x, y)

    eye.attach = () => this.attachEye({ eye })
    eye.detach = () => this.detachEye({ eye })
    eye.startBlinking = () => this.startBlinking({ eye })
    eye.stopBlinking = () => this.stopBlinking({ eye })
    eye.resumeBlinking = () => this.resumeBlinking({ eye })
    eye.killBlinking = () => this.killBlinking({ eye })
    eye.open = () => this.openEye({ eye })
    eye.close = () => this.closeEye({ eye })
    eye.reset = () => this.resetEye({ eye })
    eye.hideAndDestroy = () => this.hideAndDestroyEye({ eye })

    eye.reset()

    if (blink) eye.startBlinking()
    if (attach) eye.attach()

    return eye
  }

  attachEye(opt = {}) {
    const { eye, logDNA = this.logDNAChange } = opt

    this.eyes.push(eye)
    const { index, x, y } = eye
    const eyeDNA = { index, x, y }
    eyeDNA.eye = eye // we won't need to save this but need it if we want to remove the eye from the DNA

    const existingEyeDNA = this.dna.eyes.find((eyeDNA) => eyeDNA.eye === eye)

    if (existingEyeDNA != null) {
      _.pull(this.dna.eyes, existingEyeDNA)
    }

    this.dna.eyes.push(eyeDNA)

    if (this.onDNAChange != null) this.onDNAChange({ dna: this.dna })
    if (logDNA) this.logDNA()
  }

  detachEye({ eye }) {
    _.pull(this.eyes, eye)
  }

  hasEyes() {
    return this.dna.eyes.length > 0
  }

  hitTest({ item, x, y }) {
    if (item.bmd == null || !item.bmd.inputEnabled)
      return console.warn("Hittest target doesn't have bitmap data attached or the bitmap data is not input enabled.")

    const { bmd } = item
    const localPos = item.toLocal({
      x: x + item.anchor.x * item.width,
      y: y + item.anchor.y * item.height,
    })
    const rgb = bmd.getPixelRGB(Math.round(localPos.x), Math.round(localPos.y))

    return rgb.a === 255
  }

  // TO DO: There's a bug where eyes can be on top of each other if hit test points don't register or so.
  // Does the eye to eye hit test have some logical error with checking for overlap?
  eyeToEyeHitTest({ eye, offsetX, offsetY }) {
    const otherEyes = this.eyes.filter((_eye) => _eye != eye)

    otherEyes.forEach((otherEye) => {
      if (eye.eyeball.overlap(otherEye.eyeball)) {
        eye.hitTestPoints.forEach((hitTestPoint) => {
          const x = eye.eyeball.x + hitTestPoint.x * eye.eyeball.width + (offsetX || 0)
          const y = eye.eyeball.y + hitTestPoint.y * eye.eyeball.height + (offsetY || 0)
          const globalPos = eye.eyeball.toGlobal({ x, y })
          const hit = this.hitTest({
            item: otherEye.eyeball,
            x: globalPos.x,
            y: globalPos.y,
          })

          if (hit) {
            // eye.iris.tint = 0xff0000 // DEV test
            return true
          }
        })
      }
    })

    // eye.iris.tint = this.getIrisColor() // DEV test
    return false
  }

  eyeToBodyHitTest({ eye }) {
    if (this.combination == null) {
      if (eye.eyeball.overlap(this.head) || eye.eyeball.overlap(this.body)) {
        let hitsNeeded = eye.hitTestPoints.length

        hitPointCheck: for (const hitTestPoint of eye.hitTestPoints) {
          const x = eye.eyeball.x + hitTestPoint.x * eye.eyeball.width
          const y = eye.eyeball.y + hitTestPoint.y * eye.eyeball.height
          const globalPos = eye.eyeball.toGlobal({ x, y })

          for (const item of [this.head, this.body]) {
            const hit = this.hitTest({ item, x: globalPos.x, y: globalPos.y })

            if (hit) {
              --hitsNeeded
              continue hitPointCheck
            }
          }
        }

        return hitsNeeded < 1
      }
    } else {
      if (eye.eyeball.overlap(this.combination)) {
        eye.hitTestPoints.forEach((hitTestPoint) => {
          const x = eye.eyeball.x + hitTestPoint.x * eye.eyeball.width
          const y = eye.eyeball.y + hitTestPoint.y * eye.eyeball.height
          const globalPos = eye.eyeball.toGlobal({ x, y })
          const hit = this.hitTest({
            item: this.combination,
            x: globalPos.x,
            y: globalPos.y,
          })

          if (!hit) {
            return false
          }
        })
      } else {
        return false
      }
      // we only return true if all hitTestPoint tests are true (the entire eye is in the body)
      return true
    }
  }

  makeBitmapData({ sourceImage }) {
    const currentFrame = sourceImage.animations.currentFrame
    const bmd = this.game.add.bitmapData(currentFrame.width, currentFrame.height)
    bmd.draw(
      sourceImage,
      -currentFrame.spriteSourceSizeX + currentFrame.width * sourceImage.anchor.x,
      -currentFrame.spriteSourceSizeY + currentFrame.height * sourceImage.anchor.y,
    )
    bmd.update() // necessary to getPixelRGB()
    const sprite = bmd.addToWorld()
    sprite.anchor.set(sourceImage.anchor.x, sourceImage.anchor.y)
    sprite.alpha = 0
    sourceImage.parent.addChild(sprite)
    return bmd
  }

  get body() {
    return this.bodies[this.dna.bodyID]
  }

  get head() {
    return this.heads[this.dna.headID]
  }

  // total width of head and body or combination, whichever applies
  get totalWidth() {
    if (this.combination == null) {
      return Math.max(this.head.width, this.body.width)
    } else {
      return this.combination.width
    }
  }

  // total height of head and body or combination, whichever applies
  get totalHeight() {
    if (this.combination == null) {
      return this.head.height * this.head.anchor.y + this.body.height * (1 - this.body.anchor.y)
    } else {
      return this.combination.height
    }
  }

  // the x position from the left canvas edge
  get left() {
    if (this.combination == null) {
      return this.x - Math.max(this.head.width * this.head.anchor.x, this.body.width * this.body.anchor.x)
    } else {
      return this.x - this.combination.width / 2
    }
  }

  // the y position from the top canvas edge
  get top() {
    if (this.combination == null) {
      return this.y - this.head.height * this.head.anchor.y
    } else {
      return this.y - this.combination.height / 2
    }
  }

  showNextItem({ type }) {
    const id = this.mapping[type][++this.dna[`${type}ID`]] == null ? 0 : this.dna[`${type}ID`]
    const dna = { [`${type}ID`]: id }
    this.make(dna)
  }

  showPreviousItem({ type }) {
    const id =
      this.mapping[type][--this.dna[`${type}ID`]] == null ? this.mapping[type].length - 1 : this.dna[`${type}ID`]
    const dna = { [`${type}ID`]: id }
    this.make(dna)
  }

  startBlinking(opt = {}) {
    const { eye, minInterval = 2, maxInterval = 4, closeDuration = 0.4 } = opt

    if (eye.blinkTL != null) {
      eye.blinkTL.play()
      return
    }

    const interval = Math.max(closeDuration, _.random(minInterval, maxInterval, true))

    eye.blinkTL = new TimelineMax({ repeat: -1, delay: interval })
    eye.blinkTL.call(eye.close)
    eye.blinkTL.call(eye.open, null, closeDuration)
    eye.blinkTL.to({}, interval, {})
  }

  killBlinking({ eye }) {
    this.stopBlinking({ eye })

    if (eye.blinkTL != null) {
      eye.blinkTL.kill()
      eye.blinkTL = null
    }

    eye.reset()
  }

  killAllBlinking() {
    this.eyes?.forEach((eye) => eye.killBlinking())
  }

  stopBlinking({ eye }) {
    if (eye.blinkTL != null) {
      eye.blinkTL.pause().progress(0)
    }

    if (eye.closeDelayedCall != null) {
      eye.closeDelayedCall.kill()
      eye.closeDelayedCall = null
    }

    if (eye.openDelayedCall != null) {
      eye.openDelayedCall.kill()
      eye.openDelayedCall = null
    }

    eye.reset()
  }

  stopAllBlinking() {
    this.eyes?.forEach((eye) => eye.stopBlinking())
  }

  resumeBlinking({ eye }) {
    eye.blinkTL?.play()
  }

  resumeAllBlinking() {
    this.eyes?.forEach((eye) => eye.resumeBlinking())
  }

  closeEye({ eye }) {
    eye.closed.frameName = eye.closingFrame
    eye.closed.visible = true
    eye.eyeball.visible = false
    eye.iris.visible = false

    eye.closeDelayedCall = delayedCall(0.03, () => {
      if (eye != null && eye.closed != null && eye.closedFrame != null) eye.closed.frameName = eye.closedFrame
    })
  }

  openEye({ eye }) {
    eye.closed.frameName = eye.closingFrame
    eye.closed.visible = true
    eye.eyeball.visible = false
    eye.iris.visible = false

    eye.openDelayedCall = delayedCall(0.03, () => {
      if (eye != null && eye.closed != null) {
        eye.closed.visible = false
        eye.eyeball.visible = true
        eye.iris.visible = true
      }
    })
  }

  resetEye({ eye }) {
    eye.closed.visible = false
    eye.eyeball.visible = true
    eye.iris.visible = true
  }

  hideAndDestroyEye({ eye }) {
    const existingEyeDNA = this.dna.eyes.find((eyeDNA) => eyeDNA.eye === eye)
    _.pull(this.dna.eyes, existingEyeDNA)

    if (this.onDNAChange != null) this.onDNAChange({ dna: this.dna })

    eye.stopBlinking()

    const tl = new TimelineMax()
    tl.to(eye.scale, 0.5, { x: 0, y: 0, ease: Back.easeOut })
    tl.call(() => {
      this.detachEye({ eye })
      eye.destroy()
      eye = null
    })
  }

  hideAndDestroyOutOfBodyEyes() {
    this.eyes?.filter((eye) => !this.eyeToBodyHitTest({ eye })).forEach((eye) => eye.hideAndDestroy())
  }

  destroyAttachedEyes() {
    this.eyes?.forEach((eye) => {
      eye.detach()
      eye.destroy()
    })
  }

  setupClick(opt = {}) {
    const {
      enabled = true,
      pixelPerfectAlpha = 1,
      pixelPerfectClick = true,
      pixelPerfectOver = true,
      useHandCursor = true,
      onClick,
    } = opt

    const items = [...this.heads, ...this.bodies, ...this.combinations.map((combination) => combination.image)]

    items.forEach((item) => {
      if (item == null) return
      item.inputEnabled = true
      item.input.enabled = false
      item.input.pixelPerfectAlpha = pixelPerfectAlpha
      item.input.pixelPerfectClick = pixelPerfectClick
      item.input.pixelPerfectOver = pixelPerfectOver
      item.input.useHandCursor = useHandCursor
      if (onClick != null) item.events.onInputDown.add(() => onClick(this))
    })

    if (enabled) this.enable()
  }

  // this enables clicks if setupClick was run before; it also updates event listeners when the alien dna is changed
  enable() {
    this.disable()
    if (this.head != null) this.head.input.enabled = true
    if (this.body != null) this.body.input.enabled = true
    if (this.combination != null) this.combination.input.enabled = true
    this.enabled = true
  }

  disable() {
    const items = [...this.heads, ...this.bodies, ...this.combinations.map((combination) => combination.image)]

    items.forEach((item) => {
      item.input.enabled = false
    })

    this.enabled = false
  }

  logDNA() {
    console.log('ALIEN DNA:', this.dna)
  }
}
