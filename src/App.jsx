import classNames from 'classnames';
import Hammer from 'hammerjs';
import React, { createRef, PureComponent } from 'react';
import Shake from 'shake.js';
import styles from './App.pcss';
import DeviceMotionAlert from './components/DeviceMotionAlert';
import Footer from './components/Footer';
import Scene from './components/Scene';
import Settings from './components/Settings';
import logging from './decorators/logging';
import RollMethod from './enums/RollMethod';
import { hasRequestedDeviceMotionPermission, requestDeviceMotionPermission } from './utils/deviceMotion';

const CACHE_KEY_SETTINGS = 'settings';

@logging('App')
export default class App extends PureComponent {
  static propTypes = {};

  nodeRefs = {
    scene: createRef(),
  };

  constructor(props) {
    super(props);

    const defaultSettings = JSON.parse(localStorage.getItem(CACHE_KEY_SETTINGS) ?? '{}');
    const { diceType: defaultDiceType, diceCount: defaultDiceCount, rollMethod: defaultRollMethod, soundEnabled: defaultSoundEnabled } = defaultSettings;

    this.state = {
      areSettingsVisible: false,
      diceCount: defaultDiceCount ?? $APP_CONFIG.preferences.defaultDiceCount,
      diceType: defaultDiceType ?? $APP_CONFIG.preferences.defaultDiceType,
      isDeviceMotionAlertVisible: false,
      rollMethod: defaultRollMethod ?? $APP_CONFIG.preferences.defaultRollMethod,
      soundEnabled: defaultSoundEnabled ?? $APP_CONFIG.preferences.defaultSoundEnabled,
    };
  }

  componentDidMount() {
    this.touchHandler = new Hammer(this.nodeRefs.scene.current?.nodeRefs.root.current);
    this.touchHandler.on('tap', this.onTap);

    document.body.addEventListener('touchmove', this.onTouchMove);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(document.documentElement);

    this.shakeHandler = new Shake({
      threshold: 5,
      timeout: 200,
    });

    this.shakeHandler.start();

    window.addEventListener('shake', this.onShake);

    this.nodeRefs.scene.current?.roll(undefined, undefined, window.__GAMEBOY__);

    requestDeviceMotionPermission().then(status => {
      if (status !== 'notDetermined') return;

      this.setState({ isDeviceMotionAlertVisible: !hasRequestedDeviceMotionPermission() });
    });
  }

  componentWillUnmount() {
    document.body.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('shake', this.onShake);

    this.resizeObserver.unobserve(document.documentElement);
    this.resizeObserver = undefined;

    this.shakeHandler?.stop();
    this.shakeHandler = undefined;

    this.touchHandler.remove('tap');
    this.touchHandler = undefined;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.diceType !== prevState.diceType || this.state.diceCount !== prevState.diceCount) {
      this.log('Dice changed');
      this.nodeRefs.scene.current?.clear();
      this.nodeRefs.scene.current?.roll(undefined, undefined, window.__GAMEBOY__);
    }
  }

  onOpenSettings = () => {
    this.setState({ areSettingsVisible: true });
  };

  onDismissSettings = () => {
    this.setState({ areSettingsVisible: false });
  };

  onChangeSettings = ({ diceType, diceCount, rollMethod, soundEnabled }) => {
    const newSettings = { diceType, diceCount, rollMethod, soundEnabled };

    localStorage.setItem(CACHE_KEY_SETTINGS, JSON.stringify(newSettings));

    this.setState({ ...newSettings });
  };

  onDismissPermissionModal = () => {
    this.setState({ isDeviceMotionAlertVisible: false });
  };

  onResize = () => {
    this.nodeRefs.scene.current?.reset();
  };

  onTouchMove = (event) => {
    event.preventDefault();
  };

  onShake = (event) => {
    if (this.state.areSettingsVisible === true) return;
    if (this.state.rollMethod === RollMethod.TAP) return;
    this.nodeRefs.scene.current?.roll(undefined, undefined, window.__GAMEBOY__, true);
  };

  onTap = (event) => {
    if (this.state.areSettingsVisible === true) return;
    if (this.state.rollMethod === RollMethod.SHAKE) return;
    this.nodeRefs.scene.current?.roll(undefined, undefined, window.__GAMEBOY__, true);
  };

  render() {
    return (
      <div className={styles['root']}>
        <Scene
          className={styles['scene']}
          ambientLightColor={0xf0f5fb}
          diceColor={0x202020}
          diceCount={this.state.diceCount}
          diceLabelColor={0xffffff}
          diceScale={54}
          diceType={this.state.diceType}
          frameRate={60}
          planeColor={0x111111}
          ref={this.nodeRefs.scene}
          shakeIntensity={500}
          soundEnabled={this.state.soundEnabled}
          spotLightColor={0xefdfd5}
        />
        <Footer
          className={styles['footer']}
          onOpenSettings={this.onOpenSettings}
        />
        <Settings
          className={styles['settings']}
          isActive={this.state.areSettingsVisible}
          diceCount={this.state.diceCount}
          diceType={this.state.diceType}
          maxDiceCount={$APP_CONFIG.preferences.maxDiceCount}
          rollMethod={this.state.rollMethod}
          soundEnabled={this.state.soundEnabled}
          onChange={this.onChangeSettings}
          onDismiss={this.onDismissSettings}
        />
        <DeviceMotionAlert
          className={classNames(styles['permission'], { active: this.state.isDeviceMotionAlertVisible })}
          onDismiss={this.onDismissPermissionModal}
        />
      </div>
    );
  }
}
