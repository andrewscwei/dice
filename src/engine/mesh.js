import * as geom from '@/engine/geom';
import * as THREE from 'three';
import DiceType from '@/enums/DiceType';
import { createD6Materials, createDiceNumberedMaterials } from '@/engine/material';

const GEOMS = {
  [DiceType.D6]: geom.createD6Geom($APP_CONFIG.preferences.scale * 0.9),
  [DiceType.D8]: geom.createD8Geom($APP_CONFIG.preferences.scale),
  [DiceType.D10]: geom.createD10Geom($APP_CONFIG.preferences.scale * 0.9),
  [DiceType.D12]: geom.createD12Geom($APP_CONFIG.preferences.scale * 0.9),
  [DiceType.D20]: geom.createD20Geom($APP_CONFIG.preferences.scale)
};

const MATERIALS = {
  [DiceType.D6]: new THREE.MeshFaceMaterial(createD6Materials($APP_CONFIG.preferences.scale / 2, 1.0)),
  [DiceType.D8]: new THREE.MeshFaceMaterial(createDiceNumberedMaterials($APP_CONFIG.preferences.scale / 2, 1.0)),
  [DiceType.D10]: new THREE.MeshFaceMaterial(createDiceNumberedMaterials($APP_CONFIG.preferences.scale / 2, 1.0)),
  [DiceType.D12]: new THREE.MeshFaceMaterial(createDiceNumberedMaterials($APP_CONFIG.preferences.scale / 2, 1.0)),
  [DiceType.D20]: new THREE.MeshFaceMaterial(createDiceNumberedMaterials($APP_CONFIG.preferences.scale / 2, 1.0))
};

export function createDiceByType(type) {
  switch (type) {
  case DiceType.D8: return createD8();
  case DiceType.D10: return createD10();
  case DiceType.D12: return createD12();
  case DiceType.D20: return createD20();
  default: return createD6();
  }
}

export function createD6() {
  return new THREE.Mesh(GEOMS[DiceType.D6], MATERIALS[DiceType.D6]);
}

export function createD8() {
  return new THREE.Mesh(GEOMS[DiceType.D8], MATERIALS[DiceType.D8]);
}

export function createD10() {
  return new THREE.Mesh(GEOMS[DiceType.D10], MATERIALS[DiceType.D10]);
}

export function createD12() {
  return new THREE.Mesh(GEOMS[DiceType.D12], MATERIALS[DiceType.D12]);
}

export function createD20() {
  return new THREE.Mesh(GEOMS[DiceType.D20], MATERIALS[DiceType.D20]);
}