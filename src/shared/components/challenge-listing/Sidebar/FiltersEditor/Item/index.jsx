import React from 'react';
import PT from 'prop-types';

import './style.scss';

import ArrowsMoveVertical from '../../../Icons/ArrowsMoveVertical';
import UiSimpleRemove from '../../../Icons/ui-simple-remove.svg';

export default function Item(props) {
  return (
    <div
      styleName="ActiveFilterItem"
      draggable
      onDrag={event => props.dragSavedFilterMove(event)}
      onDragStart={event => props.dragSavedFilterStart(event)}
    >
      <ArrowsMoveVertical styleName="icon-arrows-v" />
      <input
        styleName="input"
        onBlur={() => props.updateSavedFilter()}
        onChange={event => props.changeFilterName(event.target.value)}
        onKeyDown={(event) => {
          switch (event.key) {
            case 'Enter': return event.target.blur();
            case 'Escape': {
              event.target.blur();
              return props.resetFilterName();
            }
            default: return undefined;
          }
        }}
        value={props.name}
        type="text"
      />
      <span
        onClick={props.deleteSavedFilter}
        role="button"
        styleName="right"
        tabIndex={0}
      >
        <UiSimpleRemove styleName="icon-cross" />
        <div styleName="cross-tooltip">Delete Filter</div>
      </span>
    </div>
  );
}

Item.propTypes = {
  deleteSavedFilter: PT.func.isRequired,
  dragSavedFilterMove: PT.func.isRequired,
  dragSavedFilterStart: PT.func.isRequired,
  name: PT.string.isRequired,
  changeFilterName: PT.func.isRequired,
  resetFilterName: PT.func.isRequired,
  updateSavedFilter: PT.func.isRequired,
};
