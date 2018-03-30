import styles from '@/components/Footer.pcss';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class Footer extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  render() {
    return (
      <footer className={styles[`root`]}>
        <nav className={styles[`nav`]}>
          <a className={styles[`github-button`]} href='https://github.com/andrewscwei/dice'/>
        </nav>
      </footer>
    );
  }
}