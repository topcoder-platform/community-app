/**
 * A standard countdown component.
 *
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import { fixStyle } from 'utils/contentful';

import defaultTheme from './themes/style.scss';
import TCO21 from './themes/TCO21.scss';

const THEMES = {
  Default: defaultTheme,
  TCO21,
};

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
    const { themeName } = this.props;
    const theme = THEMES[themeName];
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

    const { title, extraStylesForContainer } = this.props;
    const styles = _.merge(
      fixStyle(extraStylesForContainer),
      { backgroundImage: `url(${extraStylesForContainer['background-image']})` },
    );
    return (
      <div
        className={theme.container}
        style={styles}
      >
        <div className={theme.title}> {title} </div>
        <div className={theme['time-container']}>
          <div>
            <div className={theme['time-value']}> {day} </div>
            <div className={theme['time-label']}> days </div>
          </div>
          <div>
            <div className={theme['time-value']}> {hour} </div>
            <div className={theme['time-label']}> hours </div>
          </div>
          <div>
            <div className={theme['time-value']}> {minute} </div>
            <div className={theme['time-label']}> minutes </div>
          </div>
          <div className={theme['time-second']}>
            <div className={theme['time-value']}> {second} </div>
            <div className={theme['time-label']}> seconds </div>
          </div>
        </div>
      </div>
    );
  }
}

Countdown.defaultProps = {
  title: 'Countdown to TCO19 Final',
  extraStylesForContainer: {},
  themeName: 'Default',
};

Countdown.propTypes = {
  title: PT.string,
  end: PT.instanceOf(Date).isRequired,
  extraStylesForContainer: PT.shape(),
  themeName: PT.string,
};
