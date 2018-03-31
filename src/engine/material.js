import * as THREE from 'three';
import { createTextTexture } from '@/engine/texture';
import { toWebHexString } from '@/utils/palette';

const MATERIAL_OPTIONS = {
  specular: 0x172022,
  color: 0xf0f0f0,
  shininess: 40,
  shading: THREE.FlatShading
};

export function createDiceMaterials(faceLabels, size, margin) {
  let materials = [];

  for (var i = 0; i < faceLabels.length; i++) {
    materials.push(new THREE.MeshPhongMaterial({
      map: createTextTexture(size, margin, faceLabels[i], toWebHexString($APP_CONFIG.preferences.labelColor), toWebHexString($APP_CONFIG.preferences.diceColor)),
      ...MATERIAL_OPTIONS
    }));
  }

  return materials;
}
