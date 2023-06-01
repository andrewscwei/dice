import $$GitHubIcon from '!!raw-loader!@/assets/images/github-icon.svg';
import $$Logo from '!!raw-loader!@/assets/images/mu.svg';
import DiceType from '@/enums/DiceType';
import RollMethod from '@/enums/RollMethod';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
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

export default class Settings extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    maxDiceCount: PropTypes.number.isRequired,
    defaultDiceType: PropTypes.string.isRequired,
    defaultDiceCount: PropTypes.number.isRequired,
    defaultRollMethod: PropTypes.string.isRequired,
    defaultSoundEnabled: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      diceType: this.props.defaultDiceType,
      diceCount: this.props.defaultDiceCount,
      rollMethod: this.props.defaultRollMethod,
      soundEnabled: this.props.defaultSoundEnabled,
    };
  }

  componentDidUpdate() {
    if (this.props.onChange) this.props.onChange();
  }

  onDiceTypeChange = (event) => {
    this.setState({ diceType: event.target.value });
  }

  onDiceCountChange = (event) => {
    this.setState({ diceCount: Number(event.target.value) });
  }

  onRollMethodChange = (event) => {
    if (event.target.value === RollMethod.SHAKE || event.target.value === RollMethod.TAP_AND_SHAKE) {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission();
      }
    }

    this.setState({ rollMethod: event.target.value });
  }

  onSoundChange = (event) => {
    this.setState({ soundEnabled: event.target.value === 'Yes' ? true : false });
  }

  render() {
    const { className, style, onSave, maxDiceCount } = this.props;

    return (
      <div className={classNames(styles['root'], className)} style={{ ...style || {} }}>
        <main>
          <h1 className={styles['title']}>Settings</h1>
          <div className={styles['row']}>
            <h2 className={styles['option']}>Dice type</h2>
            <select className={styles['select']} onChange={this.onDiceTypeChange} value={this.state.diceType}>
              { Object.keys(DiceType).map(v => (
                <option value={DiceType[v]} key={v}>{DICE_TYPE[DiceType[v]]}</option>
              ))}
            </select>
          </div>
          <div className={styles['row']}>
            <h2 className={styles['option']}>No. of dice</h2>
            <select className={styles['select']} onChange={this.onDiceCountChange} value={this.state.diceCount}>
              <option value={0} key={0}>{0}</option>
              { Array.apply(null, { length: maxDiceCount }).map((v, i) => (
                <option value={i+1} key={i+1}>{i+1}</option>
              ))}
            </select>
          </div>
          <div className={styles['row']}>
            <h2 className={styles['option']}>Roll By</h2>
            <select className={styles['select']} onChange={this.onRollMethodChange} value={this.state.rollMethod}>
              { Object.keys(RollMethod).map(v => (
                <option value={RollMethod[v]} key={v}>{ROLL_METHOD[RollMethod[v]]}</option>
              ))}
            </select>
          </div>
          <div className={styles['row']}>
            <h2 className={styles['option']}>Sound</h2>
            <select className={styles['select']} onChange={this.onSoundChange} value={this.state.soundEnabled ? 'Yes' : 'No'}>
              <option value='Yes'>Yes</option>
              <option value='No'>No</option>
            </select>
          </div>
          <div className={styles['actions']}>
            <button className={styles['done-button']} onClick={(event) => onSave()}>Done</button>
          </div>
        </main>
        <div className={styles['footer']}>
          <a className={styles['monogram']} href='https://www.andr.mu' dangerouslySetInnerHTML={{ __html: $$Logo }}/>
          <a className={styles['button']} dangerouslySetInnerHTML={{ __html: $$GitHubIcon }} href='https://github.com/andrewscwei/dice'/>
        </div>
      </div>
    );
  }
}
