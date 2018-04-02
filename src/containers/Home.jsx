import styles from '@/containers/Home.pcss';
import DiceType from '@/enums/DiceType';
import Footer from '@/components/Footer';
import Hammer from 'hammerjs';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Scene from '@/components/Scene';
import Shake from 'shake.js';
import { translate } from 'react-i18next';

@translate()
export default class Home extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.hammer = new Hammer(this.scene.rootNode);
    this.hammer.on(`tap`, this.onTap);

    this.shake = new Shake({
      threshold: 6
    });

    this.shake.start();

    window.addEventListener(`resize`, this.onResize);
    window.addEventListener(`shake`, this.onShake);
  }

  componentWillUnmount() {
    window.removeEventListener(`shake`, this.onShake);
    window.removeEventListener(`resize`, this.onResize);

    this.shake.stop();
    this.shake = undefined;

    this.hammer.remove(`tap`);
    this.hammer = undefined;
  }

  onTap = (event) => {
    this.scene.roll();
  }

  onShake = (event) => {
    this.scene.roll();
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
          diceType={DiceType.D6}
          diceColor={0x202020}
          diceLabelColor={0xffffff}
          diceCount={5}
          ref={el => this.scene = el}
        />
        <Footer t={t} i18n={i18n}/>
      </div>
    );
  }
}
