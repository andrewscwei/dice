import $$GitHubIcon from '!!raw-loader!@/assets/images/github-icon.svg';
import $$Logo from '!!raw-loader!@/assets/images/mu.svg';
import $$SettingsIcon from '!!raw-loader!@/assets/images/settings-icon.svg';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styles from './Footer.pcss';

export default class Footer extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onSettingsButtonClick: PropTypes.func.isRequired,
  }

  render() {
    const { className, onSettingsButtonClick } = this.props;

    return (
      <footer className={classNames(styles['root'], className)}>
        <a className={styles['monogram']} href='https://www.andr.mu' dangerouslySetInnerHTML={{ __html: $$Logo }}/>
        <nav className={styles['nav']}>
          <button className={styles['button']} onClick={(event) => onSettingsButtonClick() } dangerouslySetInnerHTML={{ __html: $$SettingsIcon }}/>
          <a className={styles['button']} dangerouslySetInnerHTML={{ __html: $$GitHubIcon }} href='https://github.com/andrewscwei/dice'/>
        </nav>
      </footer>
    );
  }
}
