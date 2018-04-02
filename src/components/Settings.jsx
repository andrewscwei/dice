import classNames from 'classnames';
import styles from './Settings.pcss';
import DiceType from '@/enums/DiceType';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Settings extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    onCloseButtonClick: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    maxDiceCount: PropTypes.number.isRequired,
    defaultDiceType: PropTypes.string.isRequired,
    defaultDiceCount: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      diceType: this.props.defaultDiceType,
      diceCount: this.props.defaultDiceCount
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

  render() {
    const { t, className, style, onCloseButtonClick, maxDiceCount } = this.props;

    return (
      <div className={classNames(styles[`root`], className)} style={{ ...style || {} }}>
        <button className={styles[`close-button`]} onClick={(event) => onCloseButtonClick() }dangerouslySetInnerHTML={{ __html: require(`!raw-loader!@/assets/images/close-icon.svg`) }}/>
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
              { Array.apply(null, { length: maxDiceCount }).map((v, i) => (
                <option value={i+1} key={i}>{i+1}</option>
              ))}
            </select>
          </div>
        </main>
      </div>
    );
  }
}