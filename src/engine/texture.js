import * as THREE from 'three';

export function calculateTextureSize(approx) {
  return Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)));
}

export function createTextTexture(size, margin, text, color, backColor) {
  if (text === undefined) return null;

  const canvas = document.createElement(`canvas`);
  const context = canvas.getContext(`2d`);
  const ts = calculateTextureSize(size + size * 2 * margin) * 2;
  canvas.width = canvas.height = ts;
  context.font = ts / (1 + 2 * margin) + `pt Arial`;
  context.fillStyle = backColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.textAlign = `center`;
  context.textBaseline = `middle`;
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  if (text === `6` || text === `9`) {
    context.fillText(`  .`, canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}
