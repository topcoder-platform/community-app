/**
 * Failed Submission Tooltip Component.
 *
 */

import React from 'react';
import PT from 'prop-types';
import Tooltip from 'components/Tooltip';
import Failed from '../../icons/failed.svg';
import './style.scss';

function onPopupAlign(TooltipNode) {
  const inner = TooltipNode.querySelector('.rc-tooltip-inner');
  inner.style['background-color'] = '#2A2A2A'; // consistent color with arrow svg
}

/**
  * Renders the tooltip.
  */
function FailedSubmissionTooltip({
  content,
}) {
  return (
    <div styleName="failed-submission-tooltip">
      <Tooltip content={content} placeArrow={onPopupAlign} position="top" className="tooltip-overlay toolTipPadding">
        <Failed />
      </Tooltip>
    </div>
  );
}

FailedSubmissionTooltip.defaultProps = {
  content: 'Failed Submission',
};

FailedSubmissionTooltip.propTypes = {
  content: PT.string,
};

export default FailedSubmissionTooltip;
