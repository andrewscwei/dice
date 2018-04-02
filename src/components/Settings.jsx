import classNames from 'classnames';
import styles from './Settings.pcss';
import DiceType from '@/enums/DiceType';
import PropTypes from 'prop-types';
import RollMethod from '@/enums/RollMethod';
import React, { Component } from 'react';

export default class Settings extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    maxDiceCount: PropTypes.number.isRequired,
    defaultDiceType: PropTypes.string.isRequired,
    defaultDiceCount: PropTypes.number.isRequired,
    defaultRollMethod: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      diceType: this.props.defaultDiceType,
      diceCount: this.props.defaultDiceCount,
      rollMethod: this.props.defaultRollMethod
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
    this.setState({ rollMethod: event.target.value });
  }

  render() {
    const { t, className, style, onSave, maxDiceCount } = this.props;

    return (
      <div className={classNames(styles[`root`], className)} style={{ ...style || {} }}>
        <main>
          <h1 className={styles[`title`]}>{t(`settings`)}</h1>
          <div className={styles[`row`]}>
            <h2 className={styles[`option`]}>{t(`dice-type`)}</h2>
            <select className={styles[`select`]} onChange={this.onDiceTypeChange} value={this.state.diceType}>
              { Object.keys(DiceType).map(v => (
                <option value={DiceType[v]} key={v}>{t(DiceType[v])}</option>
              ))}
            </select>
          </div>
          <div className={styles[`row`]}>
            <h2 className={styles[`option`]}>{t(`dice-count`)}</h2>
            <select className={styles[`select`]} onChange={this.onDiceCountChange} value={this.state.diceCount}>
              <option value={0} key={0}>{0}</option>
              { Array.apply(null, { length: maxDiceCount }).map((v, i) => (
                <option value={i+1} key={i+1}>{i+1}</option>
              ))}
            </select>
          </div>
          <div className={styles[`row`]}>
            <h2 className={styles[`option`]}>{t(`how-to-roll`)}</h2>
            <select className={styles[`select`]} onChange={this.onRollMethodChange} value={this.state.rollMethod}>
              { Object.keys(RollMethod).map(v => (
                <option value={RollMethod[v]} key={v}>{t(RollMethod[v])}</option>
              ))}
            </select>
          </div>
          <div className={styles[`actions`]}>
            <button className={styles[`done-button`]} onClick={(event) => onSave()}>{t(`done`)}</button>
          </div>
        </main>
      </div>
    );
  }
}