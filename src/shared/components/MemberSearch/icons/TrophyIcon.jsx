import React from 'react';
import PropTypes from 'prop-types';

const TrophyIcon = ({ fill }) => (
  <svg width="10px" height="10px" viewBox="0 0 10 10" version="1.1">
    <g id="Member-List" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="List-cards-members-desktop" transform="translate(-1762.000000, -752.000000)" fill={fill || '#FFFFFF'}>
        <path d="M1762,755 C1762,755.790924 1763.0023,757.5 1765,757.5 C1764.80361,758.330917 1765.43166,758.486626 1766,759 C1766.1325,759.331619 1765.92624,760.065224 1766,761 L1764,761 L1764,762 L1770,762 L1770,761 L1768,761 C1768.07376,760.065224 1767.8675,759.331619 1768,759 C1768.56834,758.486626 1769.19639,758.330917 1769,757.5 C1770.99246,757.5 1772,755.794863 1772,755 L1772,752 L1762,752 L1762,755 Z M1763,755 L1763,753 L1764,753 L1764,756 C1763.44873,756 1763,755.32727 1763,755 L1763,755 Z M1771,755 C1771,755.32727 1770.55127,756 1770,756 L1770,753 L1771,753 L1771,755 L1771,755 Z" id="trophy-cup" />
      </g>
    </g>
  </svg>
);

TrophyIcon.propTypes = {
  fill: PropTypes.string,
};

TrophyIcon.defaultProps = {
  fill: '',
};

export default TrophyIcon;
