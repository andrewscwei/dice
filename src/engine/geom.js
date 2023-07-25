import CANNON from 'cannon';
import * as THREE from 'three';
import makeGeometry from './makeGeometry';

export function createShape(vertices, faces, radius) {
  const newVertices = vertices.map(({ x, y, z }) => new CANNON.Vec3(x * radius, y * radius, z * radius));
  const newFaces = faces.map(t => t.slice(0, t.length - 1));

  return new CANNON.ConvexPolyhedron(newVertices, newFaces);
}

export function chamferGeom(vertices, faces, chamfer) {
  const chamferPoints = [];
  const chamferFaces = [];
  const cornerFaces = vertices.map(t => []);

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    const numPoints = face.length - 1;
    const centerPoint = new THREE.Vector3();
    const newFace = new Array(numPoints);

    for (let j = 0; j < numPoints; j++) {
      const pointIdx = face[j];
      const point = vertices[pointIdx].clone();
      centerPoint.add(point);
      cornerFaces[pointIdx].push(newFace[j] = chamferPoints.push(point) - 1);
    }

    centerPoint.divideScalar(numPoints);

    for (let j = 0; j < numPoints; j++) {
      const point = chamferPoints[newFace[j]];
      point.subVectors(point, centerPoint).multiplyScalar(chamfer).addVectors(point, centerPoint);
    }

    newFace.push(face[numPoints]);
    chamferFaces.push(newFace);
  }

  for (let i = 0; i < faces.length - 1; i++) {
    for (let j = i + 1; j < faces.length; j++) {
      const pairs = [];
      const face = faces[i];

      let tmp = -1;

      for (let k = 0; k < face.length - 1; k++) {
        const pointIdx = faces[j].indexOf(face[k]);

        if (pointIdx >= 0 && pointIdx < faces[j].length - 1) {
          if (tmp >= 0 && k != tmp + 1) {
            pairs.unshift([i, k], [j, pointIdx]);
          }
          else {
            pairs.push([i, k], [j, pointIdx]);
          }

          tmp = k;
        }
      }

      if (pairs.length != 4) continue;

      chamferFaces.push([
        chamferFaces[pairs[0][0]][pairs[0][1]],
        chamferFaces[pairs[1][0]][pairs[1][1]],
        chamferFaces[pairs[3][0]][pairs[3][1]],
        chamferFaces[pairs[2][0]][pairs[2][1]],
        -1,
      ]);
    }
  }

  for (let i = 0; i < cornerFaces.length; i++) {
    const cornerFace = cornerFaces[i];
    const face = [cornerFace[0]];

    let tmp = cornerFace.length - 1;

    while (tmp) {
      for (let k = faces.length; k < chamferFaces.length; k++) {
        let pointIdx = chamferFaces[k].indexOf(face[face.length - 1]);

        if (pointIdx >= 0 && pointIdx < 4) {
          if (--pointIdx == -1) pointIdx = 3;

          let next_vertex = chamferFaces[k][pointIdx];

          if (cornerFace.indexOf(next_vertex) >= 0) {
            face.push(next_vertex);
            break;
          }
        }
      }

      --tmp;
    }

    face.push(-1);
    chamferFaces.push(face);
  }

  return {
    vertices: chamferPoints,
    faces: chamferFaces,
  };
}

export function createGeom(vertices, faces, radius, tab, af, chamfer) {
  const newVertices = vertices.map(t => (new THREE.Vector3()).fromArray(t).normalize());
  const cg = chamferGeom(newVertices, faces, chamfer);
  const geom = makeGeometry(cg.vertices, cg.faces, radius, tab, af);
  geom.cannonShape = createShape(newVertices, faces, radius);

  return geom;
}

export function createD6Geom(radius) {
  const vertices = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
  ];

  const faces = [
    [0, 3, 2, 1, 1], [1, 2, 6, 5, 2], [0, 1, 5, 4, 3],
    [3, 7, 6, 2, 4], [0, 4, 7, 3, 5], [4, 5, 6, 7, 6],
  ];

  return createGeom(vertices, faces, radius, 0.1, Math.PI / 4, 0.96);
}

export function createD8Geom(radius) {
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

export function createD10Geom(radius) {
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

export function createD12Geom(radius) {
  const p = (1 + Math.sqrt(5)) / 2, q = 1 / p;
  const vertices = [
    [0, q, p], [0, q, -p], [0, -q, p], [0, -q, -p],
    [p, 0, q], [p, 0, -q], [-p, 0, q], [-p, 0, -q],
    [q, p, 0], [q, -p, 0], [-q, p, 0], [-q, -p, 0],
    [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
    [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
  ];

  const faces = [
    [2, 14, 4, 12, 0, 1], [15, 9, 11, 19, 3, 2], [16, 10, 17, 7, 6, 3],
    [6, 7, 19, 11, 18, 4], [6, 18, 2, 0, 16, 5], [18, 11, 9, 14, 2, 6],
    [1, 17, 10, 8, 13, 7], [1, 13, 5, 15, 3, 8], [13, 8, 12, 4, 5, 9],
    [5, 4, 14, 9, 15, 10], [0, 12, 8, 10, 16, 11], [3, 19, 7, 17, 1, 12],
  ];

  return createGeom(vertices, faces, radius, 0.2, -Math.PI / 4 / 2, 0.968);
}

export function createD20Geom(radius) {
  const t = (1 + Math.sqrt(5)) / 2;

  const vertices = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];

  var faces = [
    [0, 11, 5, 1], [0, 5, 1, 2], [0, 1, 7, 3], [0, 7, 10, 4], [0, 10, 11, 5],
    [1, 5, 9, 6], [5, 11, 4, 7], [11, 10, 2, 8], [10, 7, 6, 9], [7, 1, 8, 10],
    [3, 9, 4, 11], [3, 4, 2, 12], [3, 2, 6, 13], [3, 6, 8, 14], [3, 8, 9, 15],
    [4, 9, 5, 16], [2, 4, 11, 17], [6, 2, 10, 18], [8, 6, 7, 19], [9, 8, 1, 20],
  ];

  return createGeom(vertices, faces, radius, -0.2, -Math.PI / 4 / 2, 0.955);
}
