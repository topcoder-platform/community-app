import React from 'react';
import PropTypes from 'prop-types';

const RobotIcon = ({ width, height }) => (
  <svg width={width || '86px'} height={height || '86px'} viewBox="0 0 86 86" version="1.1">
    <g id="Profile-Web" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Profile-User-Main-Completely-Empty" transform="translate(-645.000000, -636.000000)" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <g id="robot" transform="translate(646.000000, 637.000000)">
          <path d="M84,25.375 C84,20.7492083 80.2382,17 75.6,17 L8.4,17 C3.7604,17 0,20.7492083 0,25.375 L0,75.625 C0,80.2507917 3.7604,84 8.4,84 L75.6,84 C80.2382,84 84,80.2507917 84,75.625 L84,25.375 L84,25.375 Z" id="Stroke-387" fill="#F0F0F0" />
          <path d="M11,17 L11,7" id="Stroke-389" />
          <path d="M72,17 L72,7" id="Stroke-391" />
          <path d="M21,0 L1,0 L1,7 L21,7 L21,0 Z" id="Stroke-393" />
          <path d="M83,0 L63,0 L63,7 L83,7 L83,0 Z" id="Stroke-395" />
          <path d="M70,46 L14,46 L14,57.1111111 L14,71 L70,71 L70,46 L70,46 Z" id="Stroke-396" fill="#FFFFFF" />
          <circle id="Oval-5" fill="#FFFFFF" cx="31" cy="32" r="4" />
          <circle id="Oval-5" fill="#FFFFFF" cx="53" cy="32" r="4" />
          <path d="M25,71 L25,46" id="Stroke-399" />
          <path d="M36,71 L36,46" id="Stroke-400" />
          <path d="M47,71 L47,46" id="Stroke-401" />
          <path d="M58,71 L58,46" id="Stroke-402" />
          <path d="M70,58 L14,58" id="Stroke-540" />
        </g>
      </g>
    </g>
  </svg>
);

RobotIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
};

RobotIcon.defaultProps = {
  width: '',
  height: '',
};

export default RobotIcon;
