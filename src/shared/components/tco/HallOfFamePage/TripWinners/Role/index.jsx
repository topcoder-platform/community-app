/**
 * Role Component.  Renders the role and list of trip winner.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';

import defaultStyles from './styles.scss';

const Role = ({ count, data, theme }) => (
  <div className={theme.container}>
    <div className={theme.role}>{data.role}</div>
    {
      data.winners.map(handle => (
        <div key={handle} className={theme.winner}>{handle}</div>
      ))
    }
    { _.range(data.winners.length, count).map(i => <div className={theme.empty} key={i} />) }
  </div>
);

Role.defaultProps = {
  count: 3,
  // role: 'TRACK',
};

Role.propTypes = {
  count: PT.number,
  data: PT.shape().isRequired,
  theme: PT.shape().isRequired,
};

export default themr('tco-hall-of-fame-role', defaultStyles)(Role);
