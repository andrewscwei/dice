import CANNON from 'cannon';
import { Face3, Geometry, Sphere, Vector2, Vector3 } from 'three';

export default function createGeom(vectors, faces, radius, tab, af, chamferMod) {
  const vertices = vectors.map(t => (new Vector3()).fromArray(t).normalize());
  const { vectors: newVectors, faces: newFaces } = chamferGeom(vertices, faces, chamferMod);
  const geom = makeGeom(newVectors, newFaces, radius, tab, af);
  geom.cannonShape = createShape(vertices, faces, radius);

  return geom;
}

function chamferGeom(vectors, faceDescriptors, mod) {
  const tmp = vectors.map(t => []);
  const newVectors = [];
  const newFaces = [];

  for (const face of faceDescriptors) {
    const n = face.length - 1;
    const centerPoint = new Vector3();
    const newFace = new Array(n);
    const mat = face[n];

    for (let i = 0; i < n; i++) {
      const vecIdx = face[i];
      const vec = vectors[vecIdx].clone();
      newVectors.push(vec);

      centerPoint.add(vec);
      newFace[i] = newVectors.length - 1;
      tmp[vecIdx].push(newFace[i]);
    }

    centerPoint.divideScalar(n);

    for (let i = 0; i < n; i++) {
      const vec = newVectors[newFace[i]];
      vec.subVectors(vec, centerPoint).multiplyScalar(mod).addVectors(vec, centerPoint);
    }

    newFace.push(mat);
    newFaces.push(newFace);
  }

  for (let i = 0; i < faceDescriptors.length - 1; i++) {
    for (let j = i + 1; j < faceDescriptors.length; j++) {
      let pairs = [];
      let lastm = -1;

      for (let m = 0; m < faceDescriptors[i].length - 1; m++) {
        const n = faceDescriptors[j].indexOf(faceDescriptors[i][m]);

        if (n >= 0 && n < faceDescriptors[j].length - 1) {
          if (lastm >= 0 && m != lastm + 1) {
            pairs.unshift([i, m], [j, n]);
          }
          else {
            pairs.push([i, m], [j, n]);
          }

          lastm = m;
        }
      }

      if (pairs.length != 4) continue;

      newFaces.push([
        newFaces[pairs[0][0]][pairs[0][1]],
        newFaces[pairs[1][0]][pairs[1][1]],
        newFaces[pairs[3][0]][pairs[3][1]],
        newFaces[pairs[2][0]][pairs[2][1]],
        -1,
      ]);
    }
  }

  for (let i = 0; i < tmp.length; i++) {
    let cf = tmp[i];
    let face = [cf[0]];
    let count = cf.length - 1;

    while (count) {
      for (let m = faceDescriptors.length; m < newFaces.length; m++) {
        let index = newFaces[m].indexOf(face[face.length - 1]);

        if (index >= 0 && index < 4) {
          if (--index == -1) index = 3;

          const nextVertex = newFaces[m][index];

          if (cf.indexOf(nextVertex) >= 0) {
            face.push(nextVertex);
            break;
          }
        }
      }

      --count;
    }

    face.push(-1);
    newFaces.push(face);
  }

  return {
    vectors: newVectors,
    faces: newFaces,
  };
}

function makeGeom(vectors, faceDescriptors, radius, tab, af) {
  const geom = new Geometry();
  const vertices = vectors.map(t => t.multiplyScalar(radius));

  for (const descriptor of faceDescriptors) {
    const face = descriptor.slice(0, -1);
    const mat = descriptor.at(-1) + 1;
    const n = face.length;
    const aa = Math.PI * 2 / n;

    for (let i = 0; i < n - 2; i++) {
      const a = face[0];
      const b = face[i + 1];
      const c = face[i + 2];

      geom.faces.push(new Face3(a, b, c, [vertices[a], vertices[b], vertices[c]], 0, mat));
      geom.faceVertexUvs[0].push([
        new Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab), (Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
        new Vector2((Math.cos(aa * (i + 1) + af) + 1 + tab) / 2 / (1 + tab), (Math.sin(aa * (i + 1) + af) + 1 + tab) / 2 / (1 + tab)),
        new Vector2((Math.cos(aa * (i + 2) + af) + 1 + tab) / 2 / (1 + tab), (Math.sin(aa * (i + 2) + af) + 1 + tab) / 2 / (1 + tab)),
      ]);
    }
  }

  geom.boundingSphere = new Sphere(new Vector3(), radius);
  geom.vertices = vertices;
  geom.computeFaceNormals();

  return geom;
}

function createShape(vectors, faceDescriptors, radius) {
  const faces = faceDescriptors.map(t => t.slice(0, -1));
  const points = vectors.map(t => new CANNON.Vec3(t.x * radius, t.y * radius, t.z * radius));

  return new CANNON.ConvexPolyhedron(points, faces);
}
