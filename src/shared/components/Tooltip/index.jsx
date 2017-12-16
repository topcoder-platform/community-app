/**
 * Tooltip component.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import RCTooltip from 'rc-tooltip';

import 'rc-tooltip/assets/bootstrap.css';
import './style.scss';

function Tooltip({
  position,
  content,
  className,
  onTooltipHover,
  children,
  placeArrow,
  align,
  suppressDiv,
  trigger,
  defaultVisible,
}) {
  return (
    <RCTooltip
      placement={position}
      overlay={content}
      overlayClassName={className}
      onPopupAlign={placeArrow}
      align={align}
      onVisibleChange={_.once(onTooltipHover)}
      trigger={trigger}
      defaultVisible={defaultVisible}
    >
      {
        suppressDiv ? children : (<div>{children}</div>)
      }
    </RCTooltip>
  );
}

Tooltip.defaultProps = {
  align: {},
  position: 'top',
  className: '',
  content: '',
  onTooltipHover: _.noop,
  placeArrow: _.noop,
  suppressDiv: false,
  trigger: ['hover'],
  defaultVisible: false,
};

Tooltip.propTypes = {
  align: PT.shape({}),
  position: PT.string,
  children: PT.node.isRequired,
  className: PT.string,
  content: PT.node,
  onTooltipHover: PT.func,
  placeArrow: PT.func,
  suppressDiv: PT.bool,
  trigger: PT.arrayOf(PT.string),
  defaultVisible: PT.bool,
};

export default Tooltip;
