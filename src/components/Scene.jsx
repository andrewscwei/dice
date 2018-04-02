import * as FOV from 'fov';
import * as THREE from 'three';
import classNames from 'classnames';
import logging from '@/decorators/logging';
import styles from './Scene.pcss';
import CANNON from 'cannon';
import DiceType from '@/enums/DiceType';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createDiceByType } from '@/engine/mesh';
import { rng, randomVectorFromVector } from '@/utils/random';

const BOUNDS_SCALE_X = 0.93;
const BOUNDS_SCALE_Y = 0.93;

const DICE_FACE_RANGE = {
  [DiceType.D6]: [1, 6],
  [DiceType.D8]: [1, 8],
  [DiceType.D10]: [0, 9],
  [DiceType.D12]: [1, 12],
  [DiceType.D20]: [1, 20]
};

const DICE_MASS = {
  [DiceType.D6]: 300,
  [DiceType.D8]: 340,
  [DiceType.D10]: 350,
  [DiceType.D12]: 350,
  [DiceType.D20]: 400
};

const DICE_INERTIA = {
  [DiceType.D6]: 13,
  [DiceType.D8]: 10,
  [DiceType.D10]: 9,
  [DiceType.D12]: 8,
  [DiceType.D20]: 6
};

@logging(`Scene`)
export default class Scene extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    frameRate: PropTypes.number.isRequired,
    diceType: PropTypes.string.isRequired,
    diceScale: PropTypes.number.isRequired,
    diceCount: PropTypes.number.isRequired,
    diceColor: PropTypes.number.isRequired,
    diceLabelColor: PropTypes.number.isRequired,
    ambientLightColor: PropTypes.number.isRequired,
    spotLightColor: PropTypes.number.isRequired,
    planeColor: PropTypes.number.isRequired
  }

  // Light instance.
  light = null;

  // Camera instance.
  camera = null;

  // Desk instance.
  plane = null;

  // References to all generated dice.
  diceCollection = [];

  get rect() {
    if (!this.rootNode) return new FOV.Rect();
    return FOV.getRect(this.rootNode);
  }

  get scene() {
    if (this._scene) return this._scene;
    this._scene = new THREE.Scene();
    this._scene.add(new THREE.AmbientLight(this.props.ambientLightColor));
    return this._scene;
  }

  get timeStep() {
    return 1 / this.props.frameRate;
  }

  get planeMaterial() {
    if (this._planeMaterial) return this._planeMaterial;
    this._planeMaterial = new CANNON.Material();
    return this._planeMaterial;
  }

  get wallMaterial() {
    if (this._wallMaterial) return this._wallMaterial;
    this._wallMaterial = new CANNON.Material();
    return this._wallMaterial;
  }

  get diceMaterial() {
    if (this._diceMaterial) return this._diceMaterial;
    this._diceMaterial = new CANNON.Material();
    return this._diceMaterial;
  }

  get world() {
    if (this._world) return this._world;

    const w = this.rect.width / 2;
    const h = this.rect.height / 2;

    this._world = new CANNON.World();
    this._world.gravity.set(0, 0, -9.82 * 1000);
    this._world.broadphase = new CANNON.NaiveBroadphase();
    this._world.solver.iterations = 20;

    this._world.addContactMaterial(new CANNON.ContactMaterial(this.planeMaterial, this.diceMaterial, 0, 0.5));
    this._world.addContactMaterial(new CANNON.ContactMaterial(this.wallMaterial, this.diceMaterial, 0, 1.0));
    this._world.addContactMaterial(new CANNON.ContactMaterial(this.diceMaterial, this.diceMaterial, 0, 0.5));
    this._world.add(new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: this.planeMaterial }));

    const southWall = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: this.wallMaterial });
    southWall.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
    southWall.position.set(0, h * BOUNDS_SCALE_Y, 0);
    this._world.add(southWall);

    const northWall = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: this.wallMaterial });
    northWall.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    northWall.position.set(0, -h * BOUNDS_SCALE_Y, 0);
    this._world.add(northWall);

    const eastWall = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: this.wallMaterial });
    eastWall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
    eastWall.position.set(w * BOUNDS_SCALE_X, 0, 0);
    this._world.add(eastWall);

    const westWall = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: this.wallMaterial });
    westWall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    westWall.position.set(-w * BOUNDS_SCALE_X, 0, 0);
    this._world.add(westWall);

    return this._world;
  }

  get renderer() {
    if (this._renderer) return this._renderer;
    this._renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer({ antialias: true }) : new THREE.CanvasRenderer({ antialias: true });
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this._renderer.setClearColor(0xffffff, 1);
    return this._renderer;
  }

  constructor(props) {
    super(props);

    this.state = {
      iterations: 0
    };
  }

  componentDidMount() {
    this.rootNode.appendChild(this.renderer.domElement);
    this.reset();
  }

  componentWillUpdate(nextProps, nextState) {
    return false;
  }

  createTimestamp() {
    return (new Date()).getTime();
  }

  createLight() {
    this.log(`Creating new light for rect ${JSON.stringify(this.rect)}...`);

    const w = this.rect.width / 2;
    const h = this.rect.height / 2;
    const t = Math.max(w, h);

    const light = new THREE.SpotLight(this.props.spotLightColor, 2.0);
    light.position.set(-t / 2, t / 2, t * 3);
    light.target.position.set(0, 0, 0);
    light.distance = t * 5;
    light.castShadow = true;
    light.shadow.camera.near = t / 10;
    light.shadow.camera.far = t * 5;
    light.shadow.camera.fov = 20;
    light.shadow.bias = 0.002;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;

    return light;
  }

  createCamera() {
    this.log(`Creating new camera for rect ${JSON.stringify(this.rect)}...`);

    const w = this.rect.width / 2;
    const h = this.rect.height / 2;
    const wh = h / Math.tan(10 * Math.PI / 180);

    const camera = new THREE.PerspectiveCamera(20, w / h, 1, wh * 1.3);
    camera.position.z = wh;

    return camera;
  }

  createPlane() {
    this.log(`Creating new plane for rect ${JSON.stringify(this.rect)}...`);

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(this.rect.width, this.rect.height, 1, 1), new THREE.MeshPhongMaterial({ color: this.props.planeColor }));
    plane.receiveShadow = true;

    return plane;
  }

  createDie({ position, velocity, angle, axis }) {
    const die = createDiceByType(this.props.diceType, this.props.diceScale, this.props.diceColor, this.props.diceLabelColor);
    die.castShadow = true;
    die.body = new CANNON.Body({ mass: DICE_MASS[this.props.diceType], shape: die.geometry.cannonShape, material: this.diceMaterial });
    die.body.position.set(position.x, position.y, position.z);
    die.body.quaternion.setFromAxisAngle(new CANNON.Vec3(axis.x, axis.y, axis.z), axis.a * Math.PI * 2);
    die.body.angularVelocity.set(angle.x, angle.y, angle.z);
    die.body.velocity.set(velocity.x, velocity.y, velocity.z);
    die.body.linearDamping = 0.1;
    die.body.angularDamping = 0.1;
    this.diceCollection.push(die);
    this.scene.add(die);
    this.world.add(die.body);
  }

  createDice(diceProps) {
    this.clear();

    for (let i in diceProps) {
      const diceProp = diceProps[i];
      this.createDie(diceProp);
    }
  }

  generateDiceProps(position, acceleration) {
    const w = this.rect.width / 2;
    const h = this.rect.height / 2;

    if (!position) position = { x: (rng() * 2 - 1) * w, y: -(rng() * 2 - 1) * h };
    if (!acceleration) acceleration = (rng() + 3);

    this.log(`Generating ending positions with ${JSON.stringify(position)} and acceleration ${acceleration}`);

    const vector = Object.assign({}, position);
    const distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    acceleration *= distance;
    vector.x /= distance;
    vector.y /= distance;

    let o = [];

    for (let i = 0; i < this.props.diceCount; i++) {
      const v1 = randomVectorFromVector(vector);
      const position = {
        x: w * (v1.x > 0 ? -1 : 1) * 0.9,
        y: h * (v1.y > 0 ? -1 : 1) * 0.9,
        z: rng() * 200 + 200
      };

      const projector = Math.abs(v1.x / v1.y);

      if (projector > 1.0) {
        position.y /= projector;
      }
      else {
        position.x *= projector;
      }

      const v2 = randomVectorFromVector(vector);
      const velocity = { x: v2.x * acceleration, y: v2.y * acceleration, z: -10 };
      const inertia = DICE_INERTIA[this.props.diceType];
      const angle = { x: -(rng() * v1.y * 5 + inertia * v1.y), y: rng() * v1.x * 5 + inertia * v1.x, z: 0 };
      const axis = { x: rng(), y: rng(), z: rng(), a: rng() };

      o.push({ position, velocity, angle, axis });
    }

    return o;
  }

  getDieValue(die) {
    let vector = new THREE.Vector3(0, 0, 1);
    let closestFace = null;
    let closestAngle = Math.PI * 2;

    for (let i = 0, n = die.geometry.faces.length; i < n; i++) {
      const face = die.geometry.faces[i];

      if (face.materialIndex === 0) continue;

      const angle = face.normal.clone().applyQuaternion(die.body.quaternion).angleTo(vector);

      if (angle < closestAngle) {
        closestAngle = angle;
        closestFace = face;
      }
    }

    const materialIndex = closestFace.materialIndex - 1;
    return materialIndex;
  }

  getDiceValues() {
    let values = [];

    for (let i = 0, n = this.diceCollection.length; i < n; i++) {
      values.push(this.getDieValue(this.diceCollection[i]));
    }

    return values;
  }

  reset() {
    this.log(`Resetting the scene...`);

    this.renderer.setSize(this.rect.width, this.rect.height);

    if (this.camera) this.scene.remove(this.camera);
    this.camera = this.createCamera();

    if (this.light) this.scene.remove(this.light);
    this.light = this.createLight();
    this.scene.add(this.light);

    if (this.plane) this.scene.remove(this.plane);
    this.plane = this.createPlane();
    this.scene.add(this.plane);

    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.setState({
      iterations: 0
    });

    let die;

    while (this.diceCollection.length > 0) {
      die = this.diceCollection.pop();
      this.scene.remove(die);
      if (die.body) this.world.remove(die.body);
    }

    if (this.pane) this.scene.remove(this.pane);

    this.renderer.render(this.scene, this.camera);
  }

  simulateRoll() {
    while (this.isRolling()) {
      this.setState({ iterations: this.state.iterations + 1 });
      this.world.step(this.timeStep);
    }

    return this.getDiceValues();
  }

  roll(position, acceleration, fixedResults) {
    if (this.isRolling()) {
      this.log(`Dice is already rolling...`);
      return;
    }

    this.log(`Rolling dice...`);

    const diceProps = this.generateDiceProps(position, acceleration);

    this.createDice(diceProps);

    if (fixedResults && (fixedResults.length === this.props.diceCount)) {
      const res = this.simulateRoll();
      this.createDice(diceProps);

      for (let i in res) {
        this.playGameboy(this.diceCollection[i], fixedResults[i], res[i]);
      }
    }

    this.animate(this.createTimestamp());
  }

  isRolling() {
    let e = 6;

    if (this.state.iterations < 10 / this.timeStep) {
      for (let i = 0, n = this.diceCollection.length; i < n; i++) {
        const die = this.diceCollection[i];

        if (die.iterations === -1) continue;

        const a = die.body.angularVelocity;
        const v = die.body.velocity;

        if (Math.abs(a.x) < e && Math.abs(a.y) < e && Math.abs(a.z) < e && Math.abs(v.x) < e && Math.abs(v.y) < e && Math.abs(v.z) < e) {
          if (die.iterations > 0) {
            if (this.state.iterations - die.iterations > 3) {
              die.iterations = -1;
              continue;
            }
          }
          else {
            die.iterations = this.state.iterations;
          }

          return true;
        }
        else {
          die.iterations = 0;
          return true;
        }
      }
    }

    return false;
  }

  onRollComplete() {
    const result = this.getDiceValues();
    this.log(`Done rolling, showing result:`, result);
    dispatchEvent(new Event(`complete`));
  }

  playGameboy(die, value, result) {
    const range = DICE_FACE_RANGE[this.props.diceType];

    if (!(value >= range[0] && value <= range[1])) return;

    const num = value - result;
    const geom = die.geometry.clone();

    for (let i = 0, n = geom.faces.length; i < n; i++) {
      let materialIndex = geom.faces[i].materialIndex;
      if (materialIndex === 0) continue;
      materialIndex += num - 1;
      while (materialIndex > range[1]) materialIndex -= range[1];
      while (materialIndex < range[0]) materialIndex += range[1];
      geom.faces[i].materialIndex = materialIndex + 1;
    }

    die.geometry = geom;
  }

  animate(timestamp = this.createTimestamp()) {
    const newTimestamp = this.createTimestamp();

    let delta = (newTimestamp - timestamp) / 1000;
    if (delta > 3) delta = this.timeStep;

    this.setState({ iterations: this.state.iterations + 1 });
    this.world.step(this.timeStep);

    for (let i in this.scene.children) {
      const child = this.scene.children[i];

      if (child.body) {
        child.position.copy(child.body.position);
        child.quaternion.copy(child.body.quaternion);
      }
    }

    this.renderer.render(this.scene, this.camera);

    if (!this.isRolling()) {
      this.onRollComplete();
    }
    else {
      if (delta < (this.timeStep)) {
        setTimeout(() => {
          window.requestAnimationFrame(() => this.animate(newTimestamp));
        }, (this.timeStep - delta) * 1000);
      }
      else {
        window.requestAnimationFrame(() => this.animate(newTimestamp));
      }
    }
  }

  render() {
    const { className, style } = this.props;

    return (
      <div className={classNames(styles[`root`], className)} style={{ ...style || {} }} ref={el => this.rootNode = el}/>
    );
  }
}