import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import $$GitHubIcon from '../assets/svgs/github-icon.svg';
import $$Logo from '../assets/svgs/mu.svg';
import DiceType from '../enums/DiceType';
import RollMethod from '../enums/RollMethod';
import { hasAccelerometer, isAccelerometerPermissionGranted, isAcclerometerPermissionDenied, requestAccelerometerPermission } from '../utils/deviceMotion';
import styles from './Settings.pcss';

const DICE_TYPE = {
  d6: 'D6',
  d8: 'D8',
  d10: 'D10',
  d12: 'D12',
  d20: 'D20',
};

const ROLL_METHOD = {
  tap: 'Tap Only',
  shake: 'Shake Only',
  tapAndShake: 'Tap & Shake',
};

export default function Settings({
  className,
  diceCount: defaultDiceCount,
  diceType: defaultDiceType,
  maxDiceCount,
  rollMethod: defaultRollMethod,
  soundEnabled: defaultSoundEnabled,
  onChange,
  onDismiss,
}) {
  const [diceType, setDiceType] = useState(defaultDiceType);
  const [diceCount, setDiceCount] = useState(defaultDiceCount);
  const [rollMethod, setRollMethod] = useState(defaultRollMethod);
  const [soundEnabled, setSoundEnabled] = useState(defaultSoundEnabled);

  useEffect(() => {
    onChange?.({ diceType, diceCount, rollMethod, soundEnabled });
  }, [diceType, diceCount, rollMethod, soundEnabled]);

  const onReset = () => {
    setDiceType($APP_CONFIG.preferences.defaultDiceType);
    setDiceCount($APP_CONFIG.preferences.defaultDiceCount);
    setRollMethod($APP_CONFIG.preferences.defaultRollMethod);
    setSoundEnabled($APP_CONFIG.preferences.defaultSoundEnabled);
  };

  const renderDeviceMotionStatus = () => {
    if (!hasAccelerometer() || isAccelerometerPermissionGranted()) return (<></>);

    if (isAcclerometerPermissionDenied()) {
      return (<p className={styles['request-status']}>You have previously denied access to the accelerometer, please restart the browser to retry.</p>);
    }
    else {
      return (<button className={styles['request-button']} onClick={() => requestAccelerometerPermission()}>Request Accelerometer Access</button>);
    }
  };

  return (
    <div className={classNames(styles['root'], className)}>
      <div className={styles['background']} onClick={() => onDismiss()}/>
      <main>
        <h1 className={styles['title']}>Settings</h1>
        <div className={styles['columns']}>
          <div>
            <div className={styles['row']}>
              <h2 className={styles['option']}>Dice type</h2>
              <select className={styles['select']} onChange={e => setDiceType(e.target.value)} value={diceType}>
                { Object.keys(DiceType).map(v => (
                  <option value={DiceType[v]} key={v}>{DICE_TYPE[DiceType[v]]}</option>
                ))}
              </select>
            </div>
            <div className={styles['row']}>
              <h2 className={styles['option']}>No. of dice</h2>
              <select className={styles['select']} onChange={e => setDiceCount(Number(e.target.value))} value={diceCount}>
                <option value={0} key={0}>{0}</option>
                { Array.apply(null, { length: maxDiceCount }).map((v, i) => (
                  <option value={i+1} key={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className={styles['row']}>
              <h2 className={styles['option']}>Roll By</h2>
              <select className={styles['select']} onChange={e => setRollMethod(e.target.value)} value={rollMethod}>
                { Object.keys(RollMethod).map(v => {
                  const method = RollMethod[v];

                  if (method === RollMethod.TAP || (hasAccelerometer() && (method === RollMethod.SHAKE || method === RollMethod.TAP_AND_SHAKE))) {
                    return (<option value={RollMethod[v]} key={v}>{ROLL_METHOD[RollMethod[v]]}</option>);
                  }
                  else {
                    return (<></>);
                  }
                }) }
              </select>
            </div>
            <div className={styles['row']}>
              <h2 className={styles['option']}>Sound</h2>
              <select className={styles['select']} onChange={e => setSoundEnabled(e.target.value === 'Yes')} value={soundEnabled ? 'Yes' : 'No'}>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles['actions']}>
          <button onClick={() => onReset()}>Reset</button>
          <button onClick={() => onDismiss()}>Done</button>
        </div>
        {renderDeviceMotionStatus()}
      </main>
      <div className={styles['footer']}>
        <a className={styles['monogram']} href='https://andr.mu' dangerouslySetInnerHTML={{ __html: $$Logo }}/>
        <a className={styles['button']} dangerouslySetInnerHTML={{ __html: $$GitHubIcon }} href='https://github.com/andrewscwei/dice'/>
      </div>
    </div>
  );
}

Settings.propTypes = {
  className: PropTypes.string,
  diceCount: PropTypes.number.isRequired,
  diceType: PropTypes.string.isRequired,
  maxDiceCount: PropTypes.number.isRequired,
  rollMethod: PropTypes.string.isRequired,
  soundEnabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};
