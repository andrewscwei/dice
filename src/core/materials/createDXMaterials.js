import { MeshPhongMaterial, Texture } from 'three';
import { toWebHexString } from '../../utils/palette';
import { calculateTextureSize } from '../../utils/texture';

const FACE_LABELS = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

export default function createDXMaterials(scale, diceColor, labelColor) {
  let materials = [];

  for (let i = 0; i < FACE_LABELS.length; i++) {
    materials.push(new MeshPhongMaterial({
      map: createTextTexture(scale, FACE_LABELS[i], diceColor, labelColor),
      shininess: 6,
      flatShading: true,
    }));
  }

  return materials;
}

function createTextTexture(scale, text, diceColor, labelColor) {
  if (text === undefined) return null;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const s = calculateTextureSize(scale + scale * 2) * 2;

  canvas.width = s;
  canvas.height = s;

  ctx.font = s / (3.6) + 'pt monospace';
  ctx.fillStyle = toWebHexString(diceColor);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = toWebHexString(labelColor);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  if (text === '6' || text === '9') {
    ctx.fillText('  .', canvas.width / 2, canvas.height / 2);
  }

  const texture = new Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}
