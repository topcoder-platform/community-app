/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * Sidebar Filters Component (for an additional filtering of the challenge listing).
 *
 * It renders a list of filters separated in a few sections. Each filter shows
 * the number of challenges matching it, and, when clicked, it is highlighted
 * and triggers the onFilter() callback to order the parent container to filter
 * the challenge listing.
 *
 * This componet has My Filters section, where the filters can be added by
 * the parent component, using the addFilter() method. That section has a button,
 * which switches the sidebar into My Filters Edit mode, where the names of
 * My Filters, and their ordering can be changed. Also the filters can be removed
 * in that mode.
 */

import React from 'react';
import PT from 'prop-types';

import BucketSelector from './BucketSelector';
import FiltersEditor from './FiltersEditor';
import Footer from './Footer';
import './style.scss';

export default function SideBarFilters({
  activeBucket,
  activeSavedFilter,
  buckets,
  challenges,
  changeFilterName,
  communityFilter,
  deleteSavedFilter,
  disabled,
  dragSavedFilterMove,
  dragSavedFilterStart,
  dragState,
  editSavedFiltersMode,
  extraBucket,
  filterState,
  hideTcLinksInFooter,
  isAuth,
  resetFilterName,
  savedFilters,
  selectBucket,
  selectSavedFilter,
  setEditSavedFiltersMode,
  updateAllSavedFilters,
  updateSavedFilter,
  loadMoreChallenges,
}) {
  return (
    <div styleName="SideBarFilters">
      <div styleName="FilterBox">
        { editSavedFiltersMode ? (
          <FiltersEditor
            changeFilterName={changeFilterName}
            deleteSavedFilter={deleteSavedFilter}
            dragState={dragState}
            dragSavedFilterMove={dragSavedFilterMove}
            dragSavedFilterStart={dragSavedFilterStart}
            resetFilterName={resetFilterName}
            savedFilters={savedFilters}
            setEditSavedFiltersMode={setEditSavedFiltersMode}
            updateAllSavedFilters={updateAllSavedFilters}
            updateSavedFilter={updateSavedFilter}
          />
        ) : (
          <BucketSelector
            activeBucket={activeBucket}
            activeSavedFilter={activeSavedFilter}
            buckets={buckets}
            challenges={challenges}
            communityFilter={communityFilter}
            disabled={disabled}
            extraBucket={extraBucket}
            filterState={filterState}
            isAuth={isAuth}
            savedFilters={savedFilters}
            selectBucket={selectBucket}
            selectSavedFilter={selectSavedFilter}
            setEditSavedFiltersMode={setEditSavedFiltersMode}
            loadMoreChallenges={loadMoreChallenges}
          />
        )}
      </div>
      <Footer hideTcLinksInFooter={hideTcLinksInFooter} />
    </div>
  );
}

SideBarFilters.defaultProps = {
  communityFilter: null,
  disabled: false,
  dragState: {},
  extraBucket: null,
  hideTcLinksInFooter: false,
  isAuth: false,
};

SideBarFilters.propTypes = {
  activeBucket: PT.string.isRequired,
  activeSavedFilter: PT.number.isRequired,
  buckets: PT.shape().isRequired,
  challenges: PT.arrayOf(PT.shape({
    registrationOpen: PT.string.isRequired,
  })).isRequired,
  changeFilterName: PT.func.isRequired,
  communityFilter: PT.shape(),
  deleteSavedFilter: PT.func.isRequired,
  disabled: PT.bool,
  dragState: PT.shape(),
  dragSavedFilterMove: PT.func.isRequired,
  dragSavedFilterStart: PT.func.isRequired,
  editSavedFiltersMode: PT.bool.isRequired,
  extraBucket: PT.string,
  filterState: PT.shape().isRequired,
  hideTcLinksInFooter: PT.bool,
  isAuth: PT.bool,
  resetFilterName: PT.func.isRequired,
  savedFilters: PT.arrayOf(PT.shape()).isRequired,
  selectBucket: PT.func.isRequired,
  selectSavedFilter: PT.func.isRequired,
  setEditSavedFiltersMode: PT.func.isRequired,
  updateAllSavedFilters: PT.func.isRequired,
  updateSavedFilter: PT.func.isRequired,
  loadMoreChallenges: PT.func.isRequired,
};
