/**
 * Content of the sidebar in filters editor mode. In that mode the sidebar
 * allows to reorder / rename user-saved filters.
 */

import PT from 'prop-types';
import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import Item from './Item';
import style from './style.scss';

export default function FiltersEditor({
  changeFilterName,
  deleteSavedFilter,
  dragState,
  dragSavedFilterMove,
  dragSavedFilterStart,
  resetFilterName,
  savedFilters,
  setEditSavedFiltersMode,
  updateAllSavedFilters,
  updateSavedFilter,
}) {
  const savedFilterItems = savedFilters.map((item, index) => (
    <Item
      changeFilterName={name => changeFilterName(index, name)}
      deleteSavedFilter={() => deleteSavedFilter(item.id)}
      dragSavedFilterMove={e => dragSavedFilterMove(e, dragState)}
      dragSavedFilterStart={e => dragSavedFilterStart(index, e)}
      error={item.error}
      resetFilterName={() => resetFilterName(index)}
      key={item.id}
      name={item.name}
      updateSavedFilter={() => updateSavedFilter(item)}
    />
  ));

  return (
    <div styleName="EditMyFilters">
      <h1>
        My filters
      </h1>
      <PrimaryButton
        disabled={savedFilters.some(f => f.error)}
        onClick={() => {
          updateAllSavedFilters();
          setEditSavedFiltersMode(false);
        }}
        theme={{ button: style.doneButton }}
      >Done</PrimaryButton>
      { savedFilterItems }
      <div styleName="note">
        Drag the filters to set the order you prefer;
        use the &quot;x&quot; mark to delete the filter(s) you don&apos;t need.
      </div>
    </div>
  );
}

FiltersEditor.propTypes = {
  changeFilterName: PT.func.isRequired,
  deleteSavedFilter: PT.func.isRequired,
  dragState: PT.shape().isRequired,
  dragSavedFilterMove: PT.func.isRequired,
  dragSavedFilterStart: PT.func.isRequired,
  resetFilterName: PT.func.isRequired,
  savedFilters: PT.arrayOf(PT.shape()).isRequired,
  setEditSavedFiltersMode: PT.func.isRequired,
  updateAllSavedFilters: PT.func.isRequired,
  updateSavedFilter: PT.func.isRequired,
};
