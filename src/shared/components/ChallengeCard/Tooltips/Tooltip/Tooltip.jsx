/**
 * Tooltip component.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import RCTooltip from 'rc-tooltip';
import './Tooltip.scss';

function Tooltip(props) {
  return (
    <span>
      <RCTooltip
        placement={props.placement}
        overlay={props.content}
        onVisibleChange={isVisible => isVisible && props.onTooltipHover()}
        mouseLeaveDelay={0}
      >
        {props.children}
      </RCTooltip>
    </span>
  );
}

Tooltip.defaultProps = {
  content: '',
  onTooltipHover: _.noop,
  placement: 'top',
};

Tooltip.propTypes = {
  children: PT.node.isRequired,
  content: PT.node,
  onTooltipHover: PT.func,
  placement: PT.string,
};

export default Tooltip;
