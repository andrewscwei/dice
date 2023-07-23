import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { cancelRequestAccelerometerPermission, requestAccelerometerPermission } from '../utils/deviceMotion';
import styles from './PermissionModal.pcss';

export default function PermissionModal({ className, onDismiss }) {
  return (
    <div className={classNames(styles['root'], className)}>
      <div className={styles['background']}/>
      <div className={styles['modal']}>
        <h1 className={styles['title']}>Shake?</h1>
        <div>To support dice shaking the app requires permission to access your device accelerometer. You can disable shake later in settings.</div>
        <div className={styles['actions']}>
          <button className={styles['request-button']} onClick={() => requestAccelerometerPermission().then(() => onDismiss())}>Allow Access</button>
          <button className={styles['dismiss-button']} onClick={() => cancelRequestAccelerometerPermission().then(() => onDismiss())}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}

PermissionModal.propTypes = {
  className: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
};
