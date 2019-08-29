import * as THREE from 'three';
import { toWebHexString } from '@/utils/palette';

const FACE_LABELS = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

export function createDiceNumberedMaterials(scale, diceColor, labelColor) {
  let materials = [];

  for (let i = 0; i < FACE_LABELS.length; i++) {
    materials.push(new THREE.MeshPhongMaterial({
      map: createTextTexture(scale, FACE_LABELS[i], diceColor, labelColor),
      shininess: 6,
      flatShading: true,
    }));
  }

  return materials;
}

export function createD6Materials(scale, diceColor, labelColor) {
  let materials = [];

  for (let i = 0; i < 8; i++) {
    materials.push(new THREE.MeshPhongMaterial({
      map: createDotTexture(scale, i-1, diceColor, labelColor),
      shininess: 6,
      flatShading: true,
    }));
  }

  return materials;
}

export function calculateTextureSize(approx) {
  return Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)));
}

export function createTextTexture(scale, text, diceColor, labelColor) {
  if (text === undefined) return null;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const s = calculateTextureSize(scale + scale * 2) * 2;

  canvas.width = s;
  canvas.height = s;

  ctx.font = s / (1 + 2) + 'pt Roboto';
  ctx.fillStyle = toWebHexString(diceColor);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = toWebHexString(labelColor);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  if (text === '6' || text === '9') {
    ctx.fillText('  .', canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}

export function createDotTexture(scale, value, diceColor, labelColor) {
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

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}