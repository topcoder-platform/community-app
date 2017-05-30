/**
 * Tooltip component.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import RCTooltip from 'rc-tooltip';

// TODO: Most probably, this file dublicates the styles imported below.
// The styling setup here should be investigated and fixed later.
import 'rc-tooltip/assets/bootstrap.css';

// TODO: It looks like the guy who has initially ported the challenge listing
// code has copied rc-tooltip/assets/bootstrap.css into the local Tooltip.scss
// file, which is kind of fine for now, but in the long run we want to be in
// sync with the style provided by the dependecy! It should be fixed!
import './Tooltip.scss';

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
