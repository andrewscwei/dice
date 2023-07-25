import { Face3, Geometry, Sphere, Vector2, Vector3 } from 'three';

export default function makeGeometry(vertices, faces, radius, tab, af) {
  const geom = new Geometry();
  const vectors = vertices.map(t => t.multiplyScalar(radius));

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    const fl = face.length - 1;

    for (let j = 0; j < fl - 2; j++) {
      const a = face[0];
      const b = face[j + 1];
      const c = face[j + 2];

      geom.faces.push(new Face3(a, b, c, [geom.vertices[a], geom.vertices[b], geom.vertices[c]], 0, face[fl] + 1));
    }
  }

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    const fl = face.length - 1;
    const aa = Math.PI * 2 / fl;

    for (let j = 0; j < fl - 2; j++) {
      geom.faceVertexUvs[0].push([
        new Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab), (Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
        new Vector2((Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab), (Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)),
        new Vector2((Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab), (Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab)),
      ]);
    }
  }

  geom.vertices = vectors;
  geom.computeFaceNormals();
  geom.boundingSphere = new Sphere(new Vector3(), radius);

  return geom;
}
