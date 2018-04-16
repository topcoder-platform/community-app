/**
 * Badges Popup Component.  Renders a tooltip to show the date a badge was earned.
 */
import React from 'react';
import PT from 'prop-types';
import moment from 'moment-timezone';

import './styles.scss';

const Popup = ({ date, name }) => (
  <div styleName="container">
    <div styleName="name">{name}</div>
    <div styleName="date">
      { date ? `Earned on ${moment.tz(date, 'America/New_York').format('MMM DD, YYYY')}` : 'Not Earned Yet' }
    </div>
  </div>
);

Popup.defaultProps = {
  date: '',
};

Popup.propTypes = {
  date: PT.string,
  name: PT.string.isRequired,
};

export default Popup;
