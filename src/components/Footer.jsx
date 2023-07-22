import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import $$SettingsIcon from '../assets/svgs/settings-icon.svg';
import styles from './Footer.pcss';

export default class Footer extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onSettingsButtonClick: PropTypes.func.isRequired,
  };

  render() {
    const { className, onSettingsButtonClick } = this.props;

    return (
      <footer className={classNames(styles['root'], className)}>
        <nav className={styles['nav']}>
          <button className={styles['button']} onClick={(event) => onSettingsButtonClick() } dangerouslySetInnerHTML={{ __html: $$SettingsIcon }}/>
        </nav>
      </footer>
    );
  }
}
