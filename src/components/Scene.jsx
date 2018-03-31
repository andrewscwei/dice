import * as FOV from 'fov';
import * as THREE from 'three';
import classNames from 'classnames';
import logging from '@/decorators/logging';
import Cannon from 'cannon';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

@logging(`Scene`)
export default class Scene extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
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

  dices = [];
  useAdaptiveTimestep = true;
  animationSelector = true;

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

    const deskBodyMaterial = new Cannon.Material();
    const barrierBodyMaterial = new Cannon.Material();

    this._world = new Cannon.World();
    this._world.gravity.set(0, 0, -9.8 * 800);
    this._world.broadphase = new Cannon.NaiveBroadphase();
    this._world.solver.iterations = 16;

    this._world.addContactMaterial(new Cannon.ContactMaterial(deskBodyMaterial, this.diceBodyMaterial, 0.01, 0.5));
    this._world.addContactMaterial(new Cannon.ContactMaterial(barrierBodyMaterial, this.diceBodyMaterial, 0, 1.0));
    this._world.addContactMaterial(new Cannon.ContactMaterial(this.diceBodyMaterial, this.diceBodyMaterial, 0, 0.5));
    this._world.add(new Cannon.RigidBody(0, new Cannon.Plane(), this.deskBodyMaterial));

    const b1 = new Cannon.RigidBody(0, new Cannon.Plane(), barrierBodyMaterial);
    b1.quaternion.setFromAxisAngle(new Cannon.Vec3(1, 0, 0), Math.PI / 2);
    b1.position.set(0, this.h * 0.93, 0);
    this._world.add(b1);

    const b2 = new Cannon.RigidBody(0, new Cannon.Plane(), barrierBodyMaterial);
    b2.quaternion.setFromAxisAngle(new Cannon.Vec3(1, 0, 0), -Math.PI / 2);
    b2.position.set(0, -this.h * 0.93, 0);
    this._world.add(b2);

    const b3 = new Cannon.RigidBody(0, new Cannon.Plane(), barrierBodyMaterial);
    b3.quaternion.setFromAxisAngle(new Cannon.Vec3(0, 1, 0), -Math.PI / 2);
    b3.position.set(this.w * 0.93, 0, 0);
    this._world.add(b3);

    const b4 = new Cannon.RigidBody(0, new Cannon.Plane(), barrierBodyMaterial);
    b4.quaternion.setFromAxisAngle(new Cannon.Vec3(0, 1, 0), Math.PI / 2);
    b4.position.set(-this.w * 0.93, 0, 0);
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

  componentDidMount() {
    this.rootNode.appendChild(this.renderer.domElement);
    this.lastTime = 0;
    this.running = false;
    this.reset();
  }

  createLight() {
    this.log(`Creating new light...`);

    const cw = this.rect.width/2;
    const ch = this.rect.height/2;
    const mw = Math.max(cw, ch);

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
    this.log(`Creating new camera...`);

    const w = this.rect.width / 2;
    const h = this.rect.height / 2;
    const wh = h / this.aspectRatio / Math.tan(10 * Math.PI / 180);

    const camera = new THREE.PerspectiveCamera(20, w / h, 1, wh * 1.3);
    camera.position.z = wh;

    return camera;
  }

  createDesk() {
    this.log(`Creating new desk...`);

    const w = this.rect.width / 2;
    const h = this.rect.height / 2;

    const desk = new THREE.Mesh(new THREE.PlaneGeometry(w * 2, h * 2, 1, 1), new THREE.MeshPhongMaterial({ color: this.props.deskColor }));
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

  generateVectors(notation, vector, boost) {
    var vectors = [];
    for (var i in notation.set) {
      var vec = make_random_vector(vector);
      var pos = {
        x: this.w * (vec.x > 0 ? -1 : 1) * 0.9,
        y: this.h * (vec.y > 0 ? -1 : 1) * 0.9,
        z: rnd() * 200 + 200
      };
      var projector = Math.abs(vec.x / vec.y);
      if (projector > 1.0) pos.y /= projector; else pos.x *= projector;
      var velvec = make_random_vector(vector);
      var velocity = { x: velvec.x * boost, y: velvec.y * boost, z: -10 };
      var inertia = that.dice_inertia[notation.set[i]];
      var angle = {
        x: -(rnd() * vec.y * 5 + inertia * vec.y),
        y: rnd() * vec.x * 5 + inertia * vec.x,
        z: 0
      };
      var axis = { x: rnd(), y: rnd(), z: rnd(), a: rnd() };
      vectors.push({ set: notation.set[i], pos: pos, velocity: velocity, angle: angle, axis: axis });
    }
    return vectors;
  }

  createDice(type, pos, velocity, angle, axis) {
    var dice = that['create_' + type]();
    dice.castShadow = true;
    dice.dice_type = type;
    dice.body = new Cannon.RigidBody(that.dice_mass[type], dice.geometry.cannon_shape, this.dice_body_material);
    dice.body.position.set(pos.x, pos.y, pos.z);
    dice.body.quaternion.setFromAxisAngle(new Cannon.Vec3(axis.x, axis.y, axis.z), axis.a * Math.PI * 2);
    dice.body.angularVelocity.set(angle.x, angle.y, angle.z);
    dice.body.velocity.set(velocity.x, velocity.y, velocity.z);
    dice.body.linearDamping = 0.1;
    dice.body.angularDamping = 0.1;
    this.scene.add(dice);
    this.dices.push(dice);
    this.world.add(dice.body);
  }

  checkIfThrowIsFinished() {
    var res = true;
    var e = 6;
    if (this.iteration < 10 / that.frame_rate) {
      for (var i = 0; i < this.dices.length; ++i) {
        var dice = this.dices[i];
        if (dice.dice_stopped === true) continue;
        var a = dice.body.angularVelocity, v = dice.body.velocity;
        if (Math.abs(a.x) < e && Math.abs(a.y) < e && Math.abs(a.z) < e &&
          Math.abs(v.x) < e && Math.abs(v.y) < e && Math.abs(v.z) < e) {
          if (dice.dice_stopped) {
            if (this.iteration - dice.dice_stopped > 3) {
              dice.dice_stopped = true;
              continue;
            }
          }
          else dice.dice_stopped = this.iteration;
          res = false;
        }
        else {
          dice.dice_stopped = undefined;
          res = false;
        }
      }
    }
    return res;
  }

  emulateThrow() {
    while (!this.checkIfThrowIsFinished()) {
      ++this.iteration;
      this.world.step(that.frame_rate);
    }
    return get_dice_values(this.dices);
  }

  animate(threadid) {
    var time = (new Date()).getTime();
    var time_diff = (time - this.lastTime) / 1000;
    if (time_diff > 3) time_diff = that.frame_rate;
    ++this.iteration;
    if (this.useAdaptiveTimestep) {
      while (time_diff > that.frame_rate * 1.1) {
        this.world.step(that.frame_rate);
        time_diff -= that.frame_rate;
      }
      this.world.step(time_diff);
    }
    else {
      this.world.step(that.frame_rate);
    }
    for (var i in this.scene.children) {
      var interact = this.scene.children[i];
      if (interact.body != undefined) {
        interact.position.copy(interact.body.position);
        interact.quaternion.copy(interact.body.quaternion);
      }
    }
    this.renderer.render(this.scene, this.camera);
    this.lastTime = this.lastTime ? time : (new Date()).getTime();
    if (this.running == threadid && this.checkIfThrowIsFinished()) {
      this.running = false;
      if (this.callback) this.callback.call(this, get_dice_values(this.dices));
    }
    if (this.running == threadid) {
      (function (t, tid, uat) {
        if (!uat && time_diff < that.frame_rate) {
          setTimeout(function () { requestAnimationFrame(function () { t.animate(tid); }); },
            (that.frame_rate - time_diff) * 1000);
        }
        else requestAnimationFrame(function () { t.animate(tid); });
      })(this, threadid, this.useAdaptiveTimestep);
    }
  }

  clear() {
    this.running = false;
    var dice;
    while (dice = this.dices.pop()) {
      this.scene.remove(dice);
      if (dice.body) this.world.remove(dice.body);
    }
    if (this.pane) this.scene.remove(this.pane);
    this.renderer.render(this.scene, this.camera);
    var box = this;
    setTimeout(function () { box.renderer.render(box.scene, box.camera); }, 100);
  }

  prepareDicesForRoll(vectors) {
    this.clear();
    this.iteration = 0;
    for (var i in vectors) {
      this.createDice(vectors[i].set, vectors[i].pos, vectors[i].velocity,
        vectors[i].angle, vectors[i].axis);
    }
  }

  roll(vectors, values, callback) {
    this.prepareDicesForRoll(vectors);
    if (values != undefined && values.length) {
      this.useAdaptiveTimestep = false;
      var res = this.emulateThrow();
      this.prepareDicesForRoll(vectors);
      for (var i in res)
        shift_dice_faces(this.dices[i], values[i], res[i]);
    }
    this.callback = callback;
    this.running = (new Date()).getTime();
    this.lastTime = 0;
    this.animate(this.running);
  }

  selectorAnimate(threadid) {
    var time = (new Date()).getTime();
    var time_diff = (time - this.lastTime) / 1000;
    if (time_diff > 3) time_diff = that.frame_rate;
    var angle_change = 0.3 * time_diff * Math.PI * Math.min(24000 + threadid - time, 6000) / 6000;
    if (angle_change < 0) this.running = false;
    for (var i in this.dices) {
      this.dices[i].rotation.y += angle_change;
      this.dices[i].rotation.x += angle_change / 4;
      this.dices[i].rotation.z += angle_change / 10;
    }
    this.lastTime = time;
    this.renderer.render(this.scene, this.camera);
    if (this.running == threadid) {
      (function (t, tid) {
        requestAnimationFrame(function () { t.selectorAnimate(tid); });
      })(this, threadid);
    }
  }

  searchDiceByMouse(ev) {
    var m = $t.get_mouse_coords(ev);
    var intersects = (new THREE.Raycaster(this.camera.position,
      (new THREE.Vector3((m.x - this.cw) / this.aspectRatio,
        (m.y - this.ch) / this.aspectRatio, this.w / 9))
        .sub(this.camera.position).normalize())).intersectObjects(this.dices);
    if (intersects.length) return intersects[0].object.userData;
  }

  drawSelector() {
    this.clear();
    var step = this.w / 4.5;
    this.pane = new THREE.Mesh(new THREE.PlaneGeometry(this.w * 6, this.h * 6, 1, 1),
      new THREE.MeshPhongMaterial(that.selector_back_colors));
    this.pane.receiveShadow = true;
    this.pane.position.set(0, 0, 1);
    this.scene.add(this.pane);

    var mouse_captured = false;

    for (var i = 0, pos = -3; i < that.known_types.length; ++i, ++pos) {
      var dice = $t.dice['create_' + that.known_types[i]]();
      dice.position.set(pos * step, 0, step * 0.5);
      dice.castShadow = true;
      dice.userData = that.known_types[i];
      this.dices.push(dice); this.scene.add(dice);
    }

    this.running = (new Date()).getTime();
    this.lastTime = 0;
    if (this.animationSelector) this.selectorAnimate(this.running);
    else this.renderer.render(this.scene, this.camera);
  }

  bindMouse(container, notation_getter, before_roll, after_roll) {
    var box = this;
    $t.bind(container, ['mousedown', 'touchstart'], function (ev) {
      ev.preventDefault();
      box.mouse_time = (new Date()).getTime();
      box.mouse_start = $t.get_mouse_coords(ev);
    });
    $t.bind(container, ['mouseup', 'touchend'], function (ev) {
      if (box.rolling) return;
      if (box.mouse_start == undefined) return;
      ev.stopPropagation();
      var m = $t.get_mouse_coords(ev);
      var vector = { x: m.x - box.mouse_start.x, y: -(m.y - box.mouse_start.y) };
      box.mouse_start = undefined;
      var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
      if (dist < Math.sqrt(box.w * box.h * 0.01)) return;
      var time_int = (new Date()).getTime() - box.mouse_time;
      if (time_int > 2000) time_int = 2000;
      var boost = Math.sqrt((2500 - time_int) / 2500) * dist * 2;
      prepare_rnd(function () {
        throw_dices(box, vector, boost, dist, notation_getter, before_roll, after_roll);
      });
    });
  }

  bindThrow(button, notation_getter, before_roll, after_roll) {
    var box = this;
    $t.bind(button, ['mouseup', 'touchend'], function (ev) {
      ev.stopPropagation();
      box.startThrow(notation_getter, before_roll, after_roll);
    });
  }

  startThrow(notation_getter, before_roll, after_roll) {
    var box = this;
    if (box.rolling) return;
    prepare_rnd(function () {
      var vector = { x: (rnd() * 2 - 1) * box.w, y: -(rnd() * 2 - 1) * box.h };
      var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
      var boost = (rnd() + 3) * dist;
      throw_dices(box, vector, boost, dist, notation_getter, before_roll, after_roll);
    });
  }

  render() {
    const { className, style } = this.props;

    return (
      <canvas className={classNames(className)} style={{ ...style || {} }} ref={el => this.rootNode = el}/>
    );
  }
}