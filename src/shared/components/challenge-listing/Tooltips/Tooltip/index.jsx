/**
 * Tooltip component.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import RCTooltip from 'rc-tooltip';

import 'rc-tooltip/assets/bootstrap.css';
import './style.scss';

function Tooltip({ position, content, className, onTooltipHover, children, placeArrow, align }) {
  return (
    <RCTooltip
      placement={position}
      overlay={content}
      overlayClassName={className}
      onPopupAlign={placeArrow}
      align={align}
      onVisibleChange={_.once(onTooltipHover)}
    >
      <div>
        { children }
      </div>
    </RCTooltip>
  );
}

Tooltip.defaultProps = {
  align: {},
  position: 'top',
  className: '',
  content: '',
  defaultVisible: false,
  onTooltipHover: _.noop,
  placeArrow: _.noop,
};

Tooltip.propTypes = {
  align: PT.shape({}),
  position: PT.string,
  children: PT.node.isRequired,
  className: PT.string,
  content: PT.node,
  onTooltipHover: PT.func,
  placeArrow: PT.func,
};

export default Tooltip;
