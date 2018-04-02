export function rng(positiveOnly = true) {
  if (positiveOnly) {
    return Math.random();
  }
  else {
    return Math.random() * 2 - 1;
  }
}

export function randomVectorFromVector(vector) {
  const angle = rng() * Math.PI / 5 - Math.PI / 5 / 2;
  const out = {
    x: vector.x * Math.cos(angle) - vector.x * Math.sin(angle),
    y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
  };

  return out;
}

export function randomVector3FromVector3(vector3) {
  const angle = rng() * Math.PI / 5 - Math.PI / 5 / 2;
  const out = {
    x: vector3.x * Math.cos(angle) - vector3.x * Math.sin(angle),
    y: vector3.x * Math.sin(angle) + vector3.y * Math.cos(angle),
    z: vector3.z * Math.sin(angle) + vector3.z * Math.cos(angle)
  };

  return out;
}