import styles from '@/containers/Home.pcss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Scene from '@/components/Scene';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';

@translate()
export default class Home extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  componentDidMount() {
    window.addEventListener(`click`, this.onClick);
  }

  componentWillUnmount() {
    window.removeEventListener(`click`, this.onClick);
  }

  onClick = (event) => {
    this.scene.roll();
  }

  render() {
    const { t, i18n } = this.props;

    return (
      <div className={styles[`root`]} ref={el => this.rootNode = el}>
        {/* <Header t={t}/> */}
        <Scene
          className={styles[`canvas`]}
          frameRate={1/60}
          ambientLightColor={0xf0f5fb}
          spotLightColor={0xefdfd5}
          deskColor={0x111111}
          diceMass={{ d6: 300, d8: 340, d10: 350, d12: 350, d20: 400 }}
          diceInertia={{ d6: 13, d8: 10, d10: 9, d12: 8, d20: 6 }}
          diceType={`d6`}
          diceCount={5}
          ref={el => this.scene = el}
        />
        {/* <Footer t={t} i18n={i18n}/> */}
      </div>
    );
  }
}
