import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  getSubtrackAbbreviation,
  getRoundedPercentage,
  numberWithCommas,
} from '../../helpers';
import TrophyIcon from '../../icons/TrophyIcon';


import './style.scss';

const SubtrackItem = ({ subtrack }) => {
  const subtrackStyles = classNames(
    'subtrack-item',
    `track-${subtrack.track}`,
  );

  const statType = subtrack.stat.type;
  let statValue = subtrack.stat.value;

  statValue = statType === 'fulfillment'
    ? getRoundedPercentage(statValue)
    : numberWithCommas(statValue);

  const trophyIcon = statType === 'wins' ? <TrophyIcon /> : null;

  return (
    <span styleName={subtrackStyles}>
      <span styleName="subtrack-wins">
        {trophyIcon}

        <span>{statValue}</span>
      </span>

      <span styleName="track-code">{getSubtrackAbbreviation(subtrack.name)}</span>
    </span>
  );
};

SubtrackItem.propTypes = {
  subtrack: PropTypes.shape({
    track: PropTypes.string,
    stat: PropTypes.shape({
      type: PropTypes.string,
      value: PropTypes.number,
    }),
    name: PropTypes.string,
  }).isRequired,
};

export default SubtrackItem;
