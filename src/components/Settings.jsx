import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import $$GitHubIcon from '../assets/svgs/github-icon.svg';
import $$Logo from '../assets/svgs/mu.svg';
import DiceType from '../enums/DiceType';
import RollMethod from '../enums/RollMethod';
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
  defaultDiceCount,
  defaultDiceType,
  defaultRollMethod,
  defaultSoundEnabled,
  maxDiceCount,
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
                { Object.keys(RollMethod).map(v => (
                  <option value={RollMethod[v]} key={v}>{ROLL_METHOD[RollMethod[v]]}</option>
                ))}
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
          <button className={styles['done-button']} onClick={(event) => onDismiss()}>Done</button>
        </div>
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
  style: PropTypes.object,
  onDismiss: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  maxDiceCount: PropTypes.number.isRequired,
  defaultDiceType: PropTypes.string.isRequired,
  defaultDiceCount: PropTypes.number.isRequired,
  defaultRollMethod: PropTypes.string.isRequired,
  defaultSoundEnabled: PropTypes.bool.isRequired,
};
