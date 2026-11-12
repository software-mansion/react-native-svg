export function playTouchSound() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../fabric/NativeSvgSoundModule').default.playTouchSound();
}
