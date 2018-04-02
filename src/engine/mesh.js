import * as geom from '@/engine/geom';
import * as material from '@/engine/material';
import * as THREE from 'three';
import DiceType from '@/enums/DiceType';

export function createDiceByType(type, scale, diceColor = 0x202020, labelColor = 0xffffff) {
  switch (type) {
  case DiceType.D8: return createD8(scale, diceColor, labelColor);
  case DiceType.D10: return createD10(scale, diceColor, labelColor);
  case DiceType.D12: return createD12(scale, diceColor, labelColor);
  case DiceType.D20: return createD20(scale, diceColor, labelColor);
  default: return createD6(scale, diceColor, labelColor);
  }
}

export function createD6(scale, diceColor, labelColor) {
  const geoms = geom.createD6Geom(scale);
  const materials = material.createD6Materials(scale / 2, diceColor, labelColor);
  return new THREE.Mesh(geoms, materials);
}

export function createD8(scale, diceColor, labelColor) {
  const geoms = geom.createD8Geom(scale);
  const materials = material.createDiceNumberedMaterials(scale / 2, diceColor, labelColor);
  return new THREE.Mesh(geoms, materials);
}

export function createD10(scale, diceColor, labelColor) {
  const geoms = geom.createD10Geom(scale);
  const materials = material.createDiceNumberedMaterials(scale / 2, diceColor, labelColor);
  return new THREE.Mesh(geoms, materials);
}

export function createD12(scale, diceColor, labelColor) {
  const geoms = geom.createD12Geom(scale);
  const materials = material.createDiceNumberedMaterials(scale / 2, diceColor, labelColor);
  return new THREE.Mesh(geoms, materials);
}

export function createD20(scale, diceColor, labelColor) {
  const geoms = geom.createD20Geom(scale);
  const materials = material.createDiceNumberedMaterials(scale / 2, diceColor, labelColor);
  return new THREE.Mesh(geoms, materials);
}