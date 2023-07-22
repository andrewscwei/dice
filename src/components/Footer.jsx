import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import $$SettingsIcon from '../assets/svgs/settings-icon.svg';
import styles from './Footer.pcss';

export default function Footer({ className, onOpenSettings }) {
  return (
    <footer className={classNames(styles['root'], className)}>
      <nav className={styles['nav']}>
        <button className={styles['button']} onClick={(event) => onOpenSettings() } dangerouslySetInnerHTML={{ __html: $$SettingsIcon }}/>
      </nav>
    </footer>
  );
}

Footer.propTypes = {
  className: PropTypes.string,
  onOpenSettings: PropTypes.func.isRequired,
};
