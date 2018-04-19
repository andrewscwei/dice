import classNames from 'classnames';
import styles from './Home.pcss';
import Footer from '@/components/Footer';
import Hammer from 'hammerjs';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import RollMethod from '@/enums/RollMethod';
import Scene from '@/components/Scene';
import Settings from '@/components/Settings';
import Shake from 'shake.js';
import { translate } from 'react-i18next';

@translate()
export default class Home extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      areSettingsVisible: false,
      diceType: $APP_CONFIG.preferences.defaultDiceType,
      diceCount: $APP_CONFIG.preferences.defaultDiceCount,
      rollMethod: $APP_CONFIG.preferences.defaultRollMethod
    };
  }

  componentDidMount() {
    this.touchHandler = new Hammer(this.scene.rootNode);
    this.touchHandler.on(`tap`, this.onTap);

    this.shakeHandler = new Shake({
      threshold: 5,
      timeout: 200
    });

    this.shakeHandler.start();

    document.body.addEventListener(`touchmove`, this.onTouchMove);
    window.addEventListener(`resize`, this.onResize);
    window.addEventListener(`shake`, this.onShake);

    this.scene.roll(undefined, undefined, window.__GAMEBOY__);
  }

  componentWillUnmount() {
    document.body.removeEventListener(`touchmove`, this.onTouchMove);
    window.removeEventListener(`shake`, this.onShake);
    window.removeEventListener(`resize`, this.onResize);

    this.shakeHandler.stop();
    this.shakeHandler = undefined;

    this.touchHandler.remove(`tap`);
    this.touchHandler = undefined;
  }

  openSettings = () => {
    this.setState({ areSettingsVisible: true });
  }

  closeSettings = () => {
    this.setState({ areSettingsVisible: false });
  }

  updateSettings = () => {
    if (!this.settings) return;

    this.setState({
      diceType: this.settings.state.diceType,
      diceCount: this.settings.state.diceCount,
      rollMethod: this.settings.state.rollMethod
    });
  }

  onResize = (event) => {
    this.scene.reset();
  }

  onTouchMove = (event) => {
    event.preventDefault();
  }

  onShake = (event) => {
    if (this.state.areSettingsVisible === true) return;
    if (this.state.rollMethod === RollMethod.TAP) return;
    this.scene.roll(undefined, undefined, window.__GAMEBOY__);
  }

  onTap = (event) => {
    if (this.state.areSettingsVisible === true) return;
    if (this.state.rollMethod === RollMethod.SHAKE) return;
    this.scene.roll(undefined, undefined, window.__GAMEBOY__);
  }

  render() {
    const { t, i18n } = this.props;

    return (
      <div className={styles[`root`]} ref={el => this.rootNode = el}>
        <Scene
          className={styles[`scene`]}
          frameRate={60}
          ambientLightColor={0xf0f5fb}
          spotLightColor={0xefdfd5}
          planeColor={0x111111}
          diceScale={54}
          diceColor={0x202020}
          diceLabelColor={0xffffff}
          diceType={this.state.diceType}
          diceCount={this.state.diceCount}
          shakeIntensity={150}
          ref={el => this.scene = el}
        />
        <Footer className={styles[`footer`]} onSettingsButtonClick={this.openSettings} t={t} i18n={i18n}/>
        <Settings
          className={classNames(styles[`settings`], this.state.areSettingsVisible && styles[`settings--reveal`] )}
          onSave={this.closeSettings}
          onChange={this.updateSettings}
          defaultDiceType={$APP_CONFIG.preferences.defaultDiceType}
          defaultDiceCount={$APP_CONFIG.preferences.defaultDiceCount}
          defaultRollMethod={$APP_CONFIG.preferences.defaultRollMethod}
          maxDiceCount={$APP_CONFIG.preferences.maxDiceCount}
          ref={el => this.settings = el}
          t={t}
        />
      </div>
    );
  }
}
