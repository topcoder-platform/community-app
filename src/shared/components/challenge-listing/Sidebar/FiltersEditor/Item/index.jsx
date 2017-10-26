import React from 'react';
import PT from 'prop-types';

import './style.scss';

import ArrowsMoveVertical from '../../../Icons/ArrowsMoveVertical';
import UiSimpleRemove from '../../../Icons/ui-simple-remove.svg';

export default function Item({
  error,
  changeFilterName,
  deleteSavedFilter,
  dragSavedFilterMove,
  dragSavedFilterStart,
  name,
  resetFilterName,
  updateSavedFilter,
}) {
  return (
    <div
      styleName="ActiveFilterItem"
      draggable
      onDrag={event => dragSavedFilterMove(event)}
      onDragStart={event => dragSavedFilterStart(event)}
    >
      <ArrowsMoveVertical styleName="icon-arrows-v" />
      <input
        styleName={`input ${error ? 'error' : ''}`}
        onBlur={() => !error && updateSavedFilter()}
        onChange={event => changeFilterName(event.target.value)}
        onKeyDown={(event) => {
          switch (event.key) {
            case 'Enter': return event.target.blur();
            case 'Escape': {
              event.target.blur();
              return resetFilterName();
            }
            default: return undefined;
          }
        }}
        value={name}
        type="text"
      />
      <span
        onClick={deleteSavedFilter}
        role="button"
        styleName="right"
        tabIndex={0}
      >
        <UiSimpleRemove styleName="icon-cross" />
        <div styleName="cross-tooltip">Delete Filter</div>
      </span>
      { Boolean(error) && (
        <div styleName="errorMsg">{error}</div>
      )}
    </div>
  );
}

Item.defaultProps = {
  error: '',
};

Item.propTypes = {
  deleteSavedFilter: PT.func.isRequired,
  dragSavedFilterMove: PT.func.isRequired,
  dragSavedFilterStart: PT.func.isRequired,
  error: PT.string,
  name: PT.string.isRequired,
  changeFilterName: PT.func.isRequired,
  resetFilterName: PT.func.isRequired,
  updateSavedFilter: PT.func.isRequired,
};
