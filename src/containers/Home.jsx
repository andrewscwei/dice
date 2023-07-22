import Footer from '@/components/Footer';
import Scene from '@/components/Scene';
import Settings from '@/components/Settings';
import logging from '@/decorators/logging';
import RollMethod from '@/enums/RollMethod';
import classNames from 'classnames';
import Hammer from 'hammerjs';
import React, { createRef, PureComponent } from 'react';
import Shake from 'shake.js';
import styles from './Home.pcss';

@logging('Home')
export default class Home extends PureComponent {
  static propTypes = {}

  nodeRefs = {
    scene: createRef(),
    settings: createRef(),
  };

  constructor(props) {
    super(props);

    this.state = {
      areSettingsVisible: false,
      diceType: $APP_CONFIG.preferences.defaultDiceType,
      diceCount: $APP_CONFIG.preferences.defaultDiceCount,
      rollMethod: $APP_CONFIG.preferences.defaultRollMethod,
      soundEnabled: $APP_CONFIG.preferences.defaultSoundEnabled,
    };
  }

  componentDidMount() {
    this.touchHandler = new Hammer(this.nodeRefs.scene.current?.nodeRefs.root.current);
    this.touchHandler.on('tap', this.onTap);

    this.shakeHandler = new Shake({
      threshold: 5,
      timeout: 200,
    });

    this.shakeHandler.start();

    document.body.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('shake', this.onShake);

    this.nodeRefs.scene.current?.roll(undefined, undefined, window.__GAMEBOY__);
  }

  componentWillUnmount() {
    document.body.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('shake', this.onShake);
    window.removeEventListener('resize', this.onResize);

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

  openSettings = () => {
    this.setState({ areSettingsVisible: true });
  }

  closeSettings = () => {
    this.setState({ areSettingsVisible: false });
  }

  updateSettings = () => {
    if (!this.nodeRefs.settings.current) return;

    this.setState({
      diceType: this.nodeRefs.settings.current.state.diceType,
      diceCount: this.nodeRefs.settings.current.state.diceCount,
      rollMethod: this.nodeRefs.settings.current.state.rollMethod,
      soundEnabled: this.nodeRefs.settings.current.state.soundEnabled,
    });
  }

  onResize = (event) => {
    this.nodeRefs.scene.current?.reset();
  }

  onTouchMove = (event) => {
    event.preventDefault();
  }

  onShake = (event) => {
    if (this.state.areSettingsVisible === true) return;
    if (this.state.rollMethod === RollMethod.TAP) return;
    this.nodeRefs.scene.current?.roll(undefined, undefined, window.__GAMEBOY__);
  }

  onTap = (event) => {
    if (this.state.areSettingsVisible === true) return;
    if (this.state.rollMethod === RollMethod.SHAKE) return;
    this.nodeRefs.scene.current?.roll(undefined, undefined, window.__GAMEBOY__);
  }

  render() {
    return (
      <div className={styles['root']}>
        <Scene
          className={styles['scene']}
          frameRate={60}
          ambientLightColor={0xf0f5fb}
          spotLightColor={0xefdfd5}
          planeColor={0x111111}
          diceScale={54}
          diceColor={0x202020}
          diceLabelColor={0xffffff}
          diceType={this.state.diceType}
          diceCount={this.state.diceCount}
          soundEnabled={this.state.soundEnabled}
          shakeIntensity={500}
          ref={this.nodeRefs.scene}
        />
        <Footer className={styles['footer']} onSettingsButtonClick={this.openSettings}/>
        <Settings
          className={classNames(styles['settings'], this.state.areSettingsVisible && styles['settings--reveal'] )}
          onSave={this.closeSettings}
          onChange={this.updateSettings}
          defaultDiceType={$APP_CONFIG.preferences.defaultDiceType}
          defaultDiceCount={$APP_CONFIG.preferences.defaultDiceCount}
          defaultRollMethod={$APP_CONFIG.preferences.defaultRollMethod}
          defaultSoundEnabled={$APP_CONFIG.preferences.defaultSoundEnabled}
          maxDiceCount={$APP_CONFIG.preferences.maxDiceCount}
          ref={this.nodeRefs.settings}
        />
      </div>
    );
  }
}
