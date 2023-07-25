export function calculateTextureSize(approx) {
  return Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)));
}
