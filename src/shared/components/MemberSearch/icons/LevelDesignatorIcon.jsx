import React from 'react';
import PropTypes from 'prop-types';
import { memberColorByLevel } from '../helpers';

const LevelDesignatorIcon = ({ width, height, level }) => {
  const fill = memberColorByLevel(level);

  return (
    <svg width={width || '20px'} height={height || '20px'} viewBox="0 0 20 20" version="1.1">
      <g id="Member-List" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="List-cards-members-desktop" transform="translate(-1787.000000, -747.000000)">
          <g id="level-designator-big" transform="translate(1788.000000, 748.000000)">
            <polygon id="background" stroke="#FFFFFF" fill={fill || '#9D9FA0'} transform="translate(9.250000, 8.934110) scale(-1, -1) translate(-9.250000, -8.934110) " points="7.5 0.676045494 18 3.36821993 14.5 12.5470132 7.5 17.1921745 0.5 12.5470132 0.5 4.80507775 " />
            <path d="M11.4649999,11.2229395 L13.6389129,12.3533743 L13.2041303,9.91859166 C13.1171738,9.6577221 13.2910868,9.30989601 13.4649999,9.13598297 L15.2041303,7.39685253 L12.7693477,7.04902645 C12.5084781,7.04902645 12.2476085,6.78815688 12.0736955,6.61424384 L11.0302172,4.35337427 L9.89978246,6.61424384 C9.81282594,6.8751134 9.55195638,7.04902645 9.29108681,7.04902645 L6.76934768,7.39685253 L8.50847811,9.13598297 C8.76934768,9.39685253 8.8563042,9.6577221 8.8563042,9.91859166 L8.42152159,12.3533743 L10.5954346,11.2229395 C10.8563042,11.0490264 11.2041303,11.0490264 11.4649999,11.2229395 L11.4649999,11.2229395 Z" id="Fill-1" fill="#FFFFFF" />
          </g>
        </g>
      </g>
    </svg>
  );
};

LevelDesignatorIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  level: PropTypes.number.isRequired,
};

LevelDesignatorIcon.defaultProps = {
  width: '',
  height: '',
};

export default LevelDesignatorIcon;
