import * as THREE from 'three';
import { toWebHexString } from '@/utils/palette';

const FACE_LABELS = [` `, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `17`, `18`, `19`, `20`];

export function createDiceNumberedMaterials(size, margin) {
  let materials = [];

  for (let i = 0; i < FACE_LABELS.length; i++) {
    materials.push(new THREE.MeshPhongMaterial({
      map: createTextTexture(size, margin, FACE_LABELS[i], toWebHexString(0xffffff), toWebHexString(0x202020)),
      specular: 0x111111,
      color: 0xf0f0f0,
      shininess: 6,
      flatShading: true
    }));
  }

  return materials;
}

export function createD6Materials(size, margin) {
  let materials = [null, null];

  for (let i = 0; i < 6; i++) {
    materials.push(new THREE.MeshBasicMaterial({
      map: createDotTexture(i+1)
    }));
  }

  return materials;
}

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

export function createDotTexture(value) {
  return THREE.ImageUtils.loadTexture(require(`@/assets/images/face-${value}.svg`));
}