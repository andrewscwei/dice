import * as FOV from 'fov';
import * as THREE from 'three';
import classNames from 'classnames';
import logging from '@/decorators/logging';
import styles from './Scene.pcss';
import Cannon from 'cannon';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createDiceByType } from '@/engine/mesh';
import { rng, randomVectorFromVector } from '@/utils/random';

@logging(`Scene`)
export default class Scene extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    frameRate: PropTypes.number.isRequired,
    diceMass: PropTypes.object.isRequired,
    diceInertia: PropTypes.object.isRequired,
    diceType: PropTypes.string.isRequired,
    diceCount: PropTypes.number.isRequired,
    ambientLightColor: PropTypes.number.isRequired,
    spotLightColor: PropTypes.number.isRequired,
    deskColor: PropTypes.number.isRequired
  }

  // Light instance.
  light = null;

  // Camera instance.
  camera = null;

  // Desk instance.
  desk = null;

  // References to all generated dice.
  diceCollection = [];

  useAdaptiveTimestep = true;

  get diceBodyMaterial() { return new Cannon.Material(); }

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

  get scale() {
    const w = this.rect.width / 2;
    const h = this.rect.height / 2;
    return Math.sqrt(w * w + h * h) / 13;
  }

  get aspectRatio() { return 1; }

  get world() {
    if (this._world) return this._world;

    const w = this.rect.width / 2;
    const h = this.rect.height / 2;

    const deskBodyMaterial = new Cannon.Material();
    const barrierBodyMaterial = new Cannon.Material();

    this._world = new Cannon.World();
    this._world.gravity.set(0, 0, -9.8 * 800);
    this._world.broadphase = new Cannon.NaiveBroadphase();
    this._world.solver.iterations = 16;

    this._world.addContactMaterial(new Cannon.ContactMaterial(deskBodyMaterial, this.diceBodyMaterial, 0, 0.5));
    this._world.addContactMaterial(new Cannon.ContactMaterial(barrierBodyMaterial, this.diceBodyMaterial, 0, 1.0));
    this._world.addContactMaterial(new Cannon.ContactMaterial(this.diceBodyMaterial, this.diceBodyMaterial, 0, 0.5));
    this._world.add(new Cannon.Body({ mass: 0, shape: new Cannon.Plane(), material: this.deskBodyMaterial }));

    const b1 = new Cannon.Body({ mass: 0, shape: new Cannon.Plane(), material: barrierBodyMaterial });
    b1.quaternion.setFromAxisAngle(new Cannon.Vec3(1, 0, 0), Math.PI / 2);
    b1.position.set(0, h * 0.93, 0);
    this._world.add(b1);

    const b2 = new Cannon.Body({ mass: 0, shape: new Cannon.Plane(), material: barrierBodyMaterial });
    b2.quaternion.setFromAxisAngle(new Cannon.Vec3(1, 0, 0), -Math.PI / 2);
    b2.position.set(0, -h * 0.93, 0);
    this._world.add(b2);

    const b3 = new Cannon.Body({ mass: 0, shape: new Cannon.Plane(), material: barrierBodyMaterial });
    b3.quaternion.setFromAxisAngle(new Cannon.Vec3(0, 1, 0), -Math.PI / 2);
    b3.position.set(w * 0.93, 0, 0);
    this._world.add(b3);

    const b4 = new Cannon.Body({ mass: 0, shape: new Cannon.Plane(), material: barrierBodyMaterial });
    b4.quaternion.setFromAxisAngle(new Cannon.Vec3(0, 1, 0), Math.PI / 2);
    b4.position.set(-w * 0.93, 0, 0);
    this._world.add(b4);

    return this._world;
  }

  get renderer() {
    if (this._renderer) return this._renderer;
    this._renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer({ antialias: true }) : new THREE.CanvasRenderer({ antialias: true });
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFShadowMap;
    this._renderer.setClearColor(0xffffff, 1);
    return this._renderer;
  }

  constructor(props) {
    super(props);

    this.state = {
      isRolling: false,
      step: 0
    };
  }

  componentDidMount() {
    this.rootNode.appendChild(this.renderer.domElement);

    this.reset();
  }

  componentWillUpdate(nextProps, nextState) {
    return false;
  }

  createLight() {
    this.log(`Creating new light for rect ${JSON.stringify(this.rect)}...`);

    const w = this.rect.width / 2;
    const h = this.rect.height / 2;
    const mw = Math.max(w, h);

    const light = new THREE.SpotLight(this.props.spotLightColor, 2.0);
    light.position.set(-mw / 2, mw / 2, mw * 2);
    light.target.position.set(0, 0, 0);
    light.distance = mw * 5;
    light.castShadow = true;
    light.shadow.camera.near = mw / 10;
    light.shadow.camera.far = mw * 5;
    light.shadow.camera.fov = 50;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    return light;
  }

  createCamera() {
    this.log(`Creating new camera for rect ${JSON.stringify(this.rect)}...`);

    const w = this.rect.width / 2;
    const h = this.rect.height / 2;
    const wh = h / this.aspectRatio / Math.tan(10 * Math.PI / 180);

    const camera = new THREE.PerspectiveCamera(20, w / h, 1, wh * 1.3);
    camera.position.z = wh;

    return camera;
  }

  createDesk() {
    this.log(`Creating new desk for rect ${JSON.stringify(this.rect)}...`);

    const desk = new THREE.Mesh(new THREE.PlaneGeometry(this.rect.width, this.rect.height, 1, 1), new THREE.MeshPhongMaterial({ color: this.props.deskColor }));
    desk.receiveShadow = true;

    return desk;
  }

  reset() {
    if (!this.rootNode) return;

    this.log(`Resetting the scene...`);

    this.renderer.setSize(this.rect.width, this.rect.height);

    if (this.camera) this.scene.remove(this.camera);
    this.camera = this.createCamera();

    if (this.light) this.scene.remove(this.light);
    this.light = this.createLight();
    this.scene.add(this.light);

    if (this.desk) this.scene.remove(this.desk);
    this.desk = this.createDesk();
    this.scene.add(this.desk);

    this.log(`Rerender scene`);

    this.renderer.render(this.scene, this.camera);
  }

  createDice(position, velocity, angle, axis) {
    const dice = createDiceByType(this.props.diceType);
    dice.castShadow = true;
    dice.body = new Cannon.Body({ mass: this.props.diceMass[this.props.diceType], shape: dice.geometry.cannonShape, material: new Cannon.Material() });
    dice.body.position.set(position.x, position.y, position.z);
    dice.body.quaternion.setFromAxisAngle(new Cannon.Vec3(axis.x, axis.y, axis.z), axis.a * Math.PI * 2);
    dice.body.angularVelocity.set(angle.x, angle.y, angle.z);
    dice.body.velocity.set(velocity.x, velocity.y, velocity.z);
    dice.body.linearDamping = 0.1;
    dice.body.angularDamping = 0.1;
    this.diceCollection.push(dice);
    this.scene.add(dice);
    this.world.add(dice.body);
  }

  isRollingComplete() {
    let res = true;
    let e = 6;

    if (this.state.step < 10 / this.props.frameRate) {
      for (let i = 0, n = this.diceCollection.length; i < n; i++) {
        const die = this.diceCollection[i];

        if (die.isStopped === true) continue;

        const a = die.body.angularVelocity;
        const v = die.body.velocity;

        if (Math.abs(a.x) < e && Math.abs(a.y) < e && Math.abs(a.z) < e && Math.abs(v.x) < e && Math.abs(v.y) < e && Math.abs(v.z) < e) {
          if (die.isStopped) {
            if (this.state.step - die.isStopped > 3) {
              die.isStopped = true;
              continue;
            }
          }
          else {
            die.isStopped = this.state.step;
          }

          res = false;
        }
        else {
          die.isStopped = undefined;
          res = false;
        }
      }
    }

    return res;
  }

  simulateThrow() {
    while (!this.isRollingComplete()) {
      this.setState({ step: this.state.step + 1 });
      this.world.step(this.props.frameRate);
    }

    return this.getDiceValues();
  }

  animate(timestamp = (new Date()).getTime(), callback) {
    let time = (new Date()).getTime();
    let timeDiff = (time - timestamp) / 1000;
    if (timeDiff > 3) timeDiff = this.props.frameRate;

    this.setState({ step: this.state.step + 1 });

    if (this.useAdaptiveTimestep) {
      while (timeDiff > this.props.frameRate * 1.1) {
        this.world.step(this.props.frameRate);
        timeDiff -= this.props.frameRate;
      }

      this.world.step(timeDiff);
    }
    else {
      this.world.step(this.props.frameRate);
    }

    for (let i in this.scene.children) {
      let child = this.scene.children[i];

      if (child.body) {
        child.position.copy(child.body.position);
        child.quaternion.copy(child.body.quaternion);
      }
    }

    this.renderer.render(this.scene, this.camera);
    const t = timestamp > 0 ? time : (new Date()).getTime();

    if (this.isRollingComplete()) {
      if (callback) callback(this.getDiceValues());
    }
    else {
      if (!this.useAdaptiveTimestep && timeDiff < this.props.frameRate) {
        setTimeout(() => {
          window.requestAnimationFrame(() => this.animate(t, callback));
        }, (this.props.frameRate - timeDiff) * 1000);
      }
      else {
        window.requestAnimationFrame(() => this.animate(t, callback));
      }
    }

  }

  clear() {
    this.setState({
      step: 0
    });

    let die;

    while (this.diceCollection.length > 0) {
      die = this.diceCollection.pop();
      this.scene.remove(die);
      if (die.body) this.world.remove(die.body);
    }

    if (this.pane) this.scene.remove(this.pane);

    this.renderer.render(this.scene, this.camera);

    setTimeout(() => { this.renderer.render(this.scene, this.camera); }, 100);
  }

  setupDice(positions) {
    this.clear();

    for (let i in positions) {
      const p = positions[i];
      this.createDice(p.position, p.velocity, p.angle, p.axis);
    }
  }

  roll(startingPosition, acceleration, fixedResults = [1, 2, 3, 4, 5]) {
    if (this.state.isRolling) {
      this.log(`Dice is in the middle of rolling...`);
      return;
    }

    this.log(`Rolling dice...`);

    const uat = this.useAdaptiveTimestep;
    const endingPositions = this.generateEndingPositions(startingPosition, acceleration);

    this.setState({ isRolling: true });
    this.setupDice(endingPositions);

    if (fixedResults && (fixedResults.length === this.props.diceCount)) {
      this.useAdaptiveTimestep = false;
      const res = this.simulateThrow();
      this.setupDice(endingPositions);

      for (let i in res) {
        this.playGameboy(this.diceCollection[i], fixedResults[i], res[i]);
      }
    }

    this.animate(undefined, result => {
      this.log(`Done rolling, showing result:`, result);
      this.setState({ isRolling: false });
      this.useAdaptiveTimestep = uat;
    });
  }

  playGameboy(dice, value, result) {

  }

  generateEndingPositions(startingPosition, acceleration) {
    const w = this.rect.width / 2;
    const h = this.rect.height / 2;

    if (!startingPosition) startingPosition = { x: (rng() * 2 - 1) * w, y: -(rng() * 2 - 1) * h };
    if (!acceleration) acceleration = (rng() + 3);

    this.log(`Generating ending positions with ${JSON.stringify(startingPosition)} and acceleration ${acceleration}`);

    const vector = Object.assign({}, startingPosition);
    const distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    acceleration *= distance;
    vector.x /= distance;
    vector.y /= distance;

    let endingPositions = [];

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
      const inertia = this.props.diceInertia[this.props.diceType];
      const angle = { x: -(rng() * v1.y * 5 + inertia * v1.y), y: rng() * v1.x * 5 + inertia * v1.x, z: 0 };
      const axis = { x: rng(), y: rng(), z: rng(), a: rng() };

      endingPositions.push({ position, velocity, angle, axis });
    }

    return endingPositions;
  }

  getDiceValue(dice) {
    let vector = new THREE.Vector3(0, 0, 1);
    let closestFace = null;
    let closestAngle = Math.PI * 2;

    for (let i = 0, n = dice.geometry.faces.length; i < n; i++) {
      const face = dice.geometry.faces[i];

      if (face.materialIndex === 0) continue;

      const angle = face.normal.clone().applyQuaternion(dice.body.quaternion).angleTo(vector);

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
      values.push(this.getDiceValue(this.diceCollection[i]));
    }

    return values;
  }

  render() {
    const { className, style } = this.props;

    return (
      <div className={classNames(styles[`root`], className)} style={{ ...style || {} }} ref={el => this.rootNode = el}/>
    );
  }
}