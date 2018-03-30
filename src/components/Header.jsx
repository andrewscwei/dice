import styles from '@/components/Header.pcss';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  render() {
    const { t } = this.props;

    return (
      <header className={styles[`root`]}>
        <Link className={styles[`link`]} to='/'>{t(`home`)}</Link>
      </header>
    );
  }
}
