import * as THREE from 'three';
import { createTextTexture } from '@/engine/texture';
import { toWebHexString } from '@/utils/palette';

const MATERIAL_OPTIONS = {
  specular: 0x111111,
  color: 0xf0f0f0,
  // color: 0x1d2f31,
  shininess: 6,
  shading: THREE.FlatShading
};

export function createDiceMaterials(faceLabels, size, margin) {
  let materials = [];

  for (var i = 0; i < faceLabels.length; i++) {
    materials.push(new THREE.MeshPhongMaterial({
      map: createTextTexture(size, margin, faceLabels[i], toWebHexString(0xffffff), toWebHexString(0x202020)),
      ...MATERIAL_OPTIONS
    }));
  }

  return materials;
}
