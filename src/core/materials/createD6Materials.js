import { MeshPhongMaterial, Texture } from 'three';
import { toWebHexString } from '../../utils/palette';
import { calculateTextureSize } from '../../utils/texture';

export default function createD6Materials(scale, diceColor, labelColor) {
  let materials = [];

  for (let i = 0; i < 8; i++) {
    materials.push(new MeshPhongMaterial({
      map: createTexture(scale, i-1, diceColor, labelColor),
      shininess: 6,
      flatShading: true,
    }));
  }

  return materials;
}

function createTexture(scale, value, diceColor, labelColor) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const s = calculateTextureSize(scale + scale * 2) * 2;
  const r = scale * 0.25;
  const p = scale * 1.3;

  canvas.width = s;
  canvas.height = s;

  ctx.fillStyle = toWebHexString(diceColor);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = toWebHexString(labelColor);

  switch (value) {
  case 6:
    ctx.beginPath();
    ctx.arc(p + r, p + r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p + r, s/2, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s - p - r, p + r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p + r, s - p - r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s - p - r, s/2, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s - p - r, s - p - r, r, 0, 2 * Math.PI);
    ctx.fill();
    break;
  case 5:
    ctx.beginPath();
    ctx.arc(s/2, s/2, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p + r, p + r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s - p - r, p + r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p + r, s - p - r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s - p - r, s - p - r, r, 0, 2 * Math.PI);
    ctx.fill();
    break;
  case 4:
    ctx.beginPath();
    ctx.arc(p + r, p + r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s - p - r, p + r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p + r, s - p - r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s - p - r, s - p - r, r, 0, 2 * Math.PI);
    ctx.fill();
    break;
  case 3:
    ctx.beginPath();
    ctx.arc(s - p - r, p + r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s/2, s/2, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p + r, s - p - r, r, 0, 2 * Math.PI);
    ctx.fill();
    break;
  case 2:
    ctx.beginPath();
    ctx.arc(s - p - r, p + r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p + r, s - p - r, r, 0, 2 * Math.PI);
    ctx.fill();
    break;
  case 1:
    ctx.beginPath();
    ctx.arc(s/2, s/2, r, 0, 2 * Math.PI);
    ctx.fill();
    break;
  default:
    // Do nothing.
  }

  const texture = new Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}
