import styles from './Footer.pcss';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class Footer extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    onSettingsButtonClick: PropTypes.func.isRequired
  }

  render() {
    const { onSettingsButtonClick } = this.props;

    return (
      <footer className={styles[`root`]}>
        <a className={styles[`monogram`]} href='https://www.andr.mu' dangerouslySetInnerHTML={{ __html: require(`!raw-loader!@/assets/images/mu.svg`) }}/>
        <nav className={styles[`nav`]}>
          <button className={styles[`button`]} onClick={(event) => onSettingsButtonClick() } dangerouslySetInnerHTML={{ __html: require(`!raw-loader!@/assets/images/settings-icon.svg`) }}/>
          {/* <a className={styles[`button`]} dangerouslySetInnerHTML={{ __html: require(`!raw-loader!@/assets/images/github-icon.svg`) }} href='https://github.com/andrewscwei/dice'/> */}
        </nav>
      </footer>
    );
  }
}