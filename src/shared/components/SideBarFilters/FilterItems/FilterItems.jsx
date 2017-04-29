/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * This file exports two similar components: one represents a row in the sidebar,
 * when the sidebar is in its regular state; the other represents a row in the
 * sidebar, when the sidebar is in the Edit My Filters state.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import './FilterItems.scss';

import ArrowsMoveVertical from '../../Icons/ArrowsMoveVertical';
import UiSimpleRemove from '../../Icons/UiSimpleRemove';

/**
 * A single line in the sidebar in the 'Edit My Filters' mode. It shows the filter
 * name, and additional controls, if hovered. It triggers a few callbacks on user
 * interactions.
 */
function ActiveFilterItem(props) {
  return (
    <div
      styleName="ActiveFilterItem"
      draggable
      onDrag={event => props.onDrag(event)}
      onDragStart={event => props.onDragStart(event)}
    >
      <ArrowsMoveVertical styleName="icon-arrows-v" />
      <input
        styleName="input"
        onChange={event => props.onNameChange(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') event.target.blur();
        }}
        value={props.name}
        type="text"
      />
      <span styleName="right" onClick={props.onRemove}>
        <UiSimpleRemove styleName="icon-cross" />
        <div styleName="cross-tooltip">Delete Filter</div>
      </span>
    </div>
  );
}

ActiveFilterItem.defaultProps = {
  onDrag: _.noop,
  onDragStart: _.noop,
  onNameChange: _.noop,
  onRemove: _.noop,
};

ActiveFilterItem.propTypes = {
  name: PT.string.isRequired,
  onRemove: PT.func,
  onDrag: PT.func,
  onDragStart: PT.func,
  onNameChange: PT.func,
};

/**
 * A single line in the sidebar in its normal mode. It shows the filter name and
 * the count of matching items. Can be highlighted.
 */
function FilterItem(props) {
  let baseClasses = 'FilterItem';
  if (props.highlighted) baseClasses += ' highlighted';
  return (
    <div styleName={baseClasses} onClick={props.onClick}>
      <span styleName="left">{props.name}</span>
      <span styleName="right">{(props.name === 'Past challenges' || props.myFilter) ? '' : props.count}</span>
    </div>
  );
}

FilterItem.defaultProps = {
  highlighted: false,
  onClick: _.noop,
  myFilter: false,
};

FilterItem.propTypes = {
  count: PT.number.isRequired,
  highlighted: PT.bool,
  onClick: PT.func,
  name: PT.string.isRequired,
  myFilter: PT.bool,
};

export { ActiveFilterItem, FilterItem };
