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
    window.addEventListener(`mouseup`, this.onClick);
  }

  componentWillUnmount() {
    window.removeEventListener(`mouseup`, this.onClick);
  }

  onClick = (event) => {
    this.scene.roll();
  }

  render() {
    const { t, i18n } = this.props;

    return (
      <div className={styles[`root`]} ref={el => this.rootNode = el}>
        <Header t={t}/>
        <Scene
          className={styles[`canvas`]}
          width={1024}
          height={768}
          ambientLightColor={0xf0f5fb}
          spotLightColor={0xefdfd5}
          deskColor={0xdfdfdf}
          ref={el => this.scene = el}
        />
        <Footer t={t} i18n={i18n}/>
      </div>
    );
  }
}
