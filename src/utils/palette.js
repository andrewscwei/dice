export function toHexString(number) {
  return `0x${number.toString(16)}`;
}

export function toWebHexString(number) {
  return `#${number.toString(16)}`;
}
