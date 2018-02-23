/**
 * TCO Hall of Fame Page.  Allow user to select a TCO event and view the winners, contestants
 * and other information about the event.
 */
// import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import events from 'utils/hall-of-fame';

import './styles.scss';

const HallOfFamePage = ({ eventId }) => (
  <div styleName="outer-container">
    <div styleName="page">
      Hall Of Fame Page for <strong>TCO{eventId}</strong><br />
      <img src={events[eventId].logo} alt="TCO Event Logo" />
      <img src={events[eventId].banner} alt="TCO Event Logo" />
      <img src={events[eventId].algorithm.portrait} alt="TCO Event Logo" />
      <img src={events[eventId].marathon.portrait} alt="TCO Event Logo" />
      <img src={events[eventId].development.portrait} alt="TCO Event Logo" />
      <img src={events[eventId].first2finish.portrait} alt="TCO Event Logo" />
      <img src={events[eventId].uiDesign.portrait} alt="TCO Event Logo" />
      <img src={events[eventId].uiPrototype.portrait} alt="TCO Event Logo" />
    </div>
  </div>
);

HallOfFamePage.defaultProps = {
  eventId: '17',
};

HallOfFamePage.propTypes = {
  eventId: PT.string,
};

export default HallOfFamePage;
