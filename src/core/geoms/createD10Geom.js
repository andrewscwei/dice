import createGeom from './createGeom';

export default function createD10Geom(radius) {
  const a = Math.PI * 2 / 10;
  const h = 0.105, v = -1;

  let vertices = [];

  for (let i = 0, b = 0; i < 10; i++, b += a) {
    vertices.push([Math.cos(b), Math.sin(b), h * (i % 2 ? 1 : -1)]);
  }

  vertices.push([0, 0, -1]); vertices.push([0, 0, 1]);

  const faces = [
    [5, 7, 11, 0], [4, 2, 10, 1], [1, 3, 11, 2], [0, 8, 10, 3], [7, 9, 11, 4],
    [8, 6, 10, 5], [9, 1, 11, 6], [2, 0, 10, 7], [3, 5, 11, 8], [6, 4, 10, 9],
    [1, 0, 2, v], [1, 2, 3, v], [3, 2, 4, v], [3, 4, 5, v], [5, 4, 6, v],
    [5, 6, 7, v], [7, 6, 8, v], [7, 8, 9, v], [9, 8, 0, v], [9, 0, 1, v],
  ];

  return createGeom(vertices, faces, radius, 0, Math.PI * 6 / 5, 0.945);
}
