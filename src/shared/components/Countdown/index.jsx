/**
 * A standard countdown component.
 *
 */

import PT from 'prop-types';
import React from 'react';

import './style.scss';

/* We have to use state component, as we need to manipulate with DOM nodes to
 * access nuka-carousel state. */
export default class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elapsed: 0 };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 50);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    const { end } = this.props;
    const elapsed = end - (new Date());
    this.setState({ elapsed: (elapsed > 0) ? elapsed : 0 });
  }

  render() {
    let { elapsed } = this.state;
    const oneDay = 24 * 60 * 60;
    const oneHour = 60 * 60;
    elapsed = Math.floor(elapsed / 1000);
    let left = elapsed;
    const day = Math.floor(elapsed / oneDay);
    left -= day * oneDay;
    const hour = Math.floor(left / oneHour);
    left -= hour * oneHour;
    const minute = Math.floor(left / 60);
    left -= minute * 60;
    const second = left;

    const { title } = this.props;
    return (
      <div styleName="container">
        <div styleName="title"> {title} </div>
        <div styleName="title colon"> : </div>
        <div styleName="time-container">
          <div>
            <div styleName="time-value"> {day} </div>
            <div styleName="time-label"> days </div>
          </div>
          <div>
            <div styleName="time-value"> {hour} </div>
            <div styleName="time-label"> hours </div>
          </div>
          <div>
            <div styleName="time-value"> {minute} </div>
            <div styleName="time-label"> minutes </div>
          </div>
          <div styleName="time-second">
            <div styleName="time-value"> {second} </div>
            <div styleName="time-label"> seconds </div>
          </div>
        </div>
      </div>
    );
  }
}

Countdown.defaultProps = {
  title: 'Countdown to TCO19 Final',
};

Countdown.propTypes = {
  title: PT.string,
  end: PT.instanceOf(Date).isRequired,
};
