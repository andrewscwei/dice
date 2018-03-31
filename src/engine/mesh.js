import * as geom from '@/engine/geom';
import * as THREE from 'three';
import { createDiceMaterials } from 'material';

const FACE_LABELS = [` `, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `17`, `18`, `19`, `20`];

const GEOMS = {
  d6: geom.createD6Geom($APP_CONFIG.preferences.scale * 0.9),
  d8: geom.createD8Geom($APP_CONFIG.preferences.scale),
  d10: geom.createD10Geom($APP_CONFIG.preferences.scale * 0.9),
  d12: geom.createD12Geom($APP_CONFIG.preferences.scale * 0.9),
  d20: geom.createD20Geom($APP_CONFIG.preferences.scale)
};

const MATERIALS = {
  d6: new THREE.MeshFaceMaterial(createDiceMaterials(FACE_LABELS, $APP_CONFIG.preferences.scale / 2, 1.0)),
  d8: new THREE.MeshFaceMaterial(createDiceMaterials(FACE_LABELS, $APP_CONFIG.preferences.scale / 2, 1.2)),
  d10: new THREE.MeshFaceMaterial(createDiceMaterials(FACE_LABELS, $APP_CONFIG.preferences.scale / 2, 1.0)),
  d12: new THREE.MeshFaceMaterial(createDiceMaterials(FACE_LABELS, $APP_CONFIG.preferences.scale / 2, 1.0)),
  d20: new THREE.MeshFaceMaterial(createDiceMaterials(FACE_LABELS, $APP_CONFIG.preferences.scale / 2, 1.0))
};

export function createD6() {
  return new THREE.Mesh(GEOMS.d6, MATERIALS.d6);
}

export function createD8() {
  return new THREE.Mesh(GEOMS.d6, MATERIALS.d6);
}

export function createD10() {
  return new THREE.Mesh(GEOMS.d10, MATERIALS.d10);
}

export function createD12() {
  return new THREE.Mesh(GEOMS.d12, MATERIALS.d12);
}

export function createD20() {
  return new THREE.Mesh(GEOMS.d20, MATERIALS.d20);
}