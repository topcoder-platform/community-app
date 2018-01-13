import React from 'react';
import PT from 'prop-types';

export default function CheckmarkIcon({ color }) {
  return (
    <svg
      width="15px"
      height="13px"
      viewBox="0 0 15 13"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g
        id="Dashboard-Web"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Dashboard-Cards"
          transform="translate(-2383.000000, -407.000000)"
          fill={color}
        >
          <path
            d="M2386.84803,408.54609 L2383.55391,408.54609 L2383.55391,415.54609 L2397.55391,415.54609 L2397.55391,412.434979 L2386.84803,412.434979 L2386.84803,408.54609 Z"
            id="checkmark"
            transform="translate(2390.353910, 412.146090) rotate(-45.000000) translate(-2390.353910, -412.146090)"
          />
        </g>
      </g>
    </svg>
  );
}

CheckmarkIcon.defaultProps = {
  color: '#3d3d3d',
};

CheckmarkIcon.propTypes = {
  color: PT.string,
};
