import classNames from 'classnames';
import styles from '@/containers/Home.pcss';
import DiceType from '@/enums/DiceType';
import Footer from '@/components/Footer';
import Hammer from 'hammerjs';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
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
      showSettings: false,
      diceType: DiceType.D6,
      diceCount: 5
    };
  }

  componentDidMount() {
    this.hammer = new Hammer(this.scene.rootNode);
    this.hammer.on(`tap`, this.rollDice);

    this.shake = new Shake({
      threshold: 6
    });

    this.shake.start();

    window.addEventListener(`resize`, this.onResize);
    window.addEventListener(`shake`, this.rollDice);
  }

  componentWillUnmount() {
    window.removeEventListener(`shake`, this.rollDice);
    window.removeEventListener(`resize`, this.onResize);

    this.shake.stop();
    this.shake = undefined;

    this.hammer.remove(`tap`);
    this.hammer = undefined;
  }

  openSettings = () => {
    this.setState({ showSettings: true });
  }

  closeSettings = () => {
    this.setState({ showSettings: false });
  }

  rollDice = () => {
    if (this.state.showSettings === true) return;
    this.scene.roll();
  }

  onSettingsChange = () => {
    if (!this.settings) return;

    this.setState({
      diceType: this.settings.state.diceType,
      diceCount: this.settings.state.diceCount
    });
  }

  onResize = (event) => {
    this.scene.reset();
  }

  render() {
    const { t, i18n } = this.props;

    return (
      <div className={styles[`root`]} ref={el => this.rootNode = el}>
        <Scene
          className={styles[`canvas`]}
          frameRate={1/60}
          ambientLightColor={0xf0f5fb}
          spotLightColor={0xefdfd5}
          planeColor={0x111111}
          diceScale={54}
          diceType={this.state.diceType}
          diceColor={0x202020}
          diceLabelColor={0xffffff}
          diceCount={this.state.diceCount}
          ref={el => this.scene = el}
        />
        <Footer onSettingsButtonClick={this.openSettings} t={t} i18n={i18n}/>
        <Settings
          className={classNames(styles[`settings`], this.state.showSettings && styles[`settings--reveal`] )}
          maxDiceCount={20}
          onCloseButtonClick={this.closeSettings}
          onChange={this.onSettingsChange}
          defaultDiceType={DiceType.D6}
          defaultDiceCount={5}
          ref={el => this.settings = el}
          t={t}
        />
      </div>
    );
  }
}
