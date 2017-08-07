import React from 'react';
import PT from 'prop-types';

import styles from './tooltip_base.scss';

export default function SimpleTooltip({
  content,
  heading,
  tooltip,
  tooltipStyle,
  tooltipTextStyle,
}) {
  return (
    <div className={`${styles.tooltip} ${tooltipStyle}`}>
      <p>{content}</p>
      <div className={`${styles.tooltiptext} ${tooltipTextStyle}`}>
        <h4>{heading}</h4>
        <p>{tooltip}</p>
      </div>
    </div>
  );
}

SimpleTooltip.defaultProps = {
  tooltipStyle: '',
  tooltipTextStyle: '',
};

SimpleTooltip.propTypes = {
  content: PT.string.isRequired,
  heading: PT.string.isRequired,
  tooltip: PT.string.isRequired,
  tooltipStyle: PT.string,
  tooltipTextStyle: PT.string,
};
