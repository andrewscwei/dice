import Cannon from 'cannon';

export function createShape(vertices, faces, radius) {
  let cv = new Array(vertices.length);
  let cf = new Array(faces.length);

  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i];
    cv[i] = new Cannon.Vec3(v.x * radius, v.y * radius, v.z * radius);
  }

  for (let i = 0; i < faces.length; i++) {
    cf[i] = faces[i].slice(0, faces[i].length - 1);
  }

  return new Cannon.ConvexPolyhedron(cv, cf);
}
