import React from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import SubtrackItem from './SubtrackItem';

import './style.scss';

const SubtrackList = ({ subtracks }) => (
  <div styleName="subtracks-list">
    {subtracks.map(s => <SubtrackItem key={shortId()} subtrack={s} />)}
  </div>
);

SubtrackList.propTypes = {
  subtracks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default SubtrackList;
