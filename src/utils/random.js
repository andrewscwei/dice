export function rng() {
  return Math.random();
}

export function randomVectorFromVector(vector) {
  const angle = rng() * Math.PI / 5 - Math.PI / 5 / 2;
  const out = {
    x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
    y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
  };

  if (out.x === 0) out.x = 0.01;
  if (out.y === 0) out.y = 0.01;

  return out;
}