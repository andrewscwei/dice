import { Mesh } from 'three';
import DiceType from '../enums/DiceType';
import { createD10Geom, createD12Geom, createD20Geom, createD6Geom, createD8Geom } from './geoms';
import { createD6Materials, createDXMaterials } from './materials';

const DICE_COLOR = 0x202020;
const LABEL_COLOR = 0xffffff;

export default function createDiceByType(type, scale, diceColor = DICE_COLOR, labelColor = LABEL_COLOR) {
  switch (type) {
  case DiceType.D8: return createD8(scale, diceColor, labelColor);
  case DiceType.D10: return createD10(scale, diceColor, labelColor);
  case DiceType.D12: return createD12(scale, diceColor, labelColor);
  case DiceType.D20: return createD20(scale, diceColor, labelColor);
  default: return createD6(scale, diceColor, labelColor);
  }
}

function createD6(scale, diceColor, labelColor) {
  const geoms = createD6Geom(scale);
  const materials = createD6Materials(scale / 2, diceColor, labelColor);
  return new Mesh(geoms, materials);
}

function createD8(scale, diceColor, labelColor) {
  const geoms = createD8Geom(scale);
  const materials = createDXMaterials(scale / 2, diceColor, labelColor);
  return new Mesh(geoms, materials);
}

function createD10(scale, diceColor, labelColor) {
  const geoms = createD10Geom(scale);
  const materials = createDXMaterials(scale / 2, diceColor, labelColor);
  return new Mesh(geoms, materials);
}

function createD12(scale, diceColor, labelColor) {
  const geoms = createD12Geom(scale);
  const materials = createDXMaterials(scale / 2, diceColor, labelColor);
  return new Mesh(geoms, materials);
}

function createD20(scale, diceColor, labelColor) {
  const geoms = createD20Geom(scale);
  const materials = createDXMaterials(scale / 2, diceColor, labelColor);
  return new Mesh(geoms, materials);
}
