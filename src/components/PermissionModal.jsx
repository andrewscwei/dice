import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './PermissionModal.pcss';

export default function PermissionModal({ className, onRequest, onDismiss }) {
  return (
    <div className={classNames(styles['root'], className)}>
      <div className={styles['background']}/>
      <div className={styles['modal']}>
        <h1 className={styles['title']}>Shake?</h1>
        <div>To support dice shaking the app requires permission to access your device accelerometer. You can disable shake later in settings.</div>
        <div className={styles['actions']}>
          <button className={styles['request-button']} onClick={() => onRequest()}>Allow Access</button>
          <button className={styles['dismiss-button']} onClick={() => onDismiss()}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}

PermissionModal.propTypes = {
  className: PropTypes.string,
  onRequest: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};
