import styles from '@/containers/Home.pcss';
import DiceType from '@/enums/DiceType';
import Footer from '@/components/Footer';
import Hammer from 'hammerjs';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Scene from '@/components/Scene';
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

    window.addEventListener(`resize`, this.onResize);
  }

  componentWillUnmount() {
    this.hammer.remove(`tap`);
    this.hammer = undefined;

    window.removeEventListener(`resize`, this.onResize);
  }

  onTap = (event) => {
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
          diceType={DiceType.D6}
          diceCount={5}
          ref={el => this.scene = el}
        />
        <Footer t={t} i18n={i18n}/>
      </div>
    );
  }
}
