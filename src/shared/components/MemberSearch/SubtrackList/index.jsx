import React from 'react';
import PropTypes from 'prop-types';
import SubtrackItem from './SubtrackItem';

import './style.scss';

const SubtrackList = ({ subtracks }) => (
  <div styleName="subtracks-list">
    {subtracks.map(s => <SubtrackItem key={s} subtrack={s} />)}
  </div>
);

SubtrackList.propTypes = {
  subtracks: PropTypes.shape([]).isRequired,
};

export default SubtrackList;
