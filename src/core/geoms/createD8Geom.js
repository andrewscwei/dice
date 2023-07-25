import createGeom from './createGeom';

export default function createD8Geom(radius) {
  const vertices = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0],
    [0, -1, 0], [0, 0, 1], [0, 0, -1],
  ];

  const faces = [
    [0, 2, 4, 1], [0, 4, 3, 2], [0, 3, 5, 3], [0, 5, 2, 4],
    [1, 3, 4, 5], [1, 4, 2, 6], [1, 2, 5, 7], [1, 5, 3, 8],
  ];

  return createGeom(vertices, faces, radius, 0, -Math.PI / 4 / 2, 0.965);
}
