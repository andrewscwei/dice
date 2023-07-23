import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { rememberDeviceMotionRequestDate, requestDeviceMotionPermission } from '../utils/deviceMotion';
import styles from './DeviceMotionAlert.pcss';

export default function DeviceMotionAlert({ className, onDismiss }) {
  const request = async () => {
    rememberDeviceMotionRequestDate();
    await requestDeviceMotionPermission();
    onDismiss();
  };

  const dismiss = async () => {
    rememberDeviceMotionRequestDate();
    onDismiss();
  };

  return (
    <div className={classNames(styles['root'], className)}>
      <div className={styles['background']}/>
      <div className={styles['modal']}>
        <h1 className={styles['title']}>Shake?</h1>
        <div>To support dice shaking, the app requires permission to access your device motion.</div>
        <div className={styles['actions']}>
          <button className={styles['request-button']} onClick={() => request()}>Allow Access</button>
          <button className={styles['dismiss-button']} onClick={() => dismiss()}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}

DeviceMotionAlert.propTypes = {
  className: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
};
