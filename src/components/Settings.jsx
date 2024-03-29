import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import $$GitHubIcon from '../assets/svgs/github-icon.svg';
import $$Logo from '../assets/svgs/mu.svg';
import DiceType from '../enums/DiceType';
import RollMethod from '../enums/RollMethod';
import { getDeviceMotionPermission, needsDeviceMotionPermission, requestDeviceMotionPermission } from '../utils/deviceMotion';
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
  isActive,
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
  const [deviceMotionStatus, setDeviceMotionStatus] = useState(getDeviceMotionPermission());

  useEffect(() => {
    onChange?.({ diceType, diceCount, rollMethod, soundEnabled });
  }, [diceType, diceCount, rollMethod, soundEnabled]);

  useEffect(() => {
    setDeviceMotionStatus(getDeviceMotionPermission());
  }, [isActive]);

  const onReset = () => {
    setDiceType($APP_CONFIG.preferences.defaultDiceType);
    setDiceCount($APP_CONFIG.preferences.defaultDiceCount);
    setRollMethod($APP_CONFIG.preferences.defaultRollMethod);
    setSoundEnabled($APP_CONFIG.preferences.defaultSoundEnabled);
  };

  const renderDeviceMotionStatus = () => {
    if (rollMethod === 'tap') return <></>;

    switch (deviceMotionStatus) {
    case 'denied': return <p className={styles['request-status']}>⚠ You have previously denied access to the device motion, please restart the browser to retry.</p>;
    case 'notDetermined': return <button className={styles['request-button']} onClick={() => requestDeviceMotionPermission().then(setDeviceMotionStatus)}>⚠ Request device motion access</button>;
    default: return <></>;
    }
  };

  return (
    <div className={classNames(styles['root'], className, { active: isActive })}>
      <div className={styles['background']} onClick={() => onDismiss()}/>
      <main>
        <div className={styles['title']}>
          <h1>Settings</h1>
          <span>{$APP_CONFIG.version}</span>
        </div>
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
                { Object.keys(RollMethod).map(v => (
                  <option value={RollMethod[v]} key={v}>{ROLL_METHOD[RollMethod[v]]}</option>
                )) }
              </select>
              {needsDeviceMotionPermission() && deviceMotionStatus !== 'granted' && rollMethod !== 'tap' && <figure>⚠</figure>}
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
  isActive: PropTypes.bool.isRequired,
  maxDiceCount: PropTypes.number.isRequired,
  rollMethod: PropTypes.string.isRequired,
  soundEnabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};
