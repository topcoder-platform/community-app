import React from 'react'

const ArrowsMoveVertical = ({ className, width, height }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    xlinkHref="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    width={width || '16px'}
    height={height || '16px'}
    viewBox={`0 0 ${width || 16} ${height || 16}`}
  >
    <g><polygon points="13,11 11.6,9.6 9,12.2 9,3.8 11.6,6.4 13,5 8,0 3,5 4.4,6.4 7,3.8 7,12.2 4.4,9.6 3,11 8,16 "/></g>
  </svg>
)

export default ArrowsMoveVertical
