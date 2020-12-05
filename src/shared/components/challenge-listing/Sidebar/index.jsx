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
import _ from 'lodash';
import { BUCKETS } from 'utils/challenge-listing/buckets';
import BucketSelector from './BucketSelector';
// import FiltersEditor from './FiltersEditor';
// import Footer from './Footer';
import './style.scss';

export default function SideBarFilters({
  activeBucket,
  // activeSavedFilter,
  // buckets,
  // challenges,
  // changeFilterName,
  // communityFilter,
  // deleteSavedFilter,
  disabled,
  expanding,
  // dragSavedFilterMove,
  // dragSavedFilterStart,
  // dragState,
  // editSavedFiltersMode,
  // extraBucket,
  filterState,
  // hideTcLinksInFooter,
  isAuth,
  // resetFilterName,
  // savedFilters,
  selectBucket,
  // selectSavedFilter,
  // setEditSavedFiltersMode,
  // updateAllSavedFilters,
  // updateSavedFilter,
  setFilter,
  past,
  setPast,
  previousBucketOfActiveTab,
  previousBucketOfPastChallengesTab,
  setPreviousBucketOfActiveTab,
  setPreviousBucketOfPastChallengesTab,
}) {
  const onActiveClick = () => {
    if (!past) {
      return;
    }
    setPreviousBucketOfPastChallengesTab(activeBucket);
    setFilter({
      ..._.omit(filterState, 'status'),
      endDateStart: null,
      startDateEnd: null,
      previousStartDate: filterState.endDateStart,
      previousEndDate: filterState.startDateEnd,
    });
    setPast(false);
    if (previousBucketOfActiveTab) {
      selectBucket(previousBucketOfActiveTab);
    } else {
      selectBucket(BUCKETS.OPEN_FOR_REGISTRATION);
    }
  };

  const onPastChallengesClick = () => {
    if (past) {
      return;
    }
    setPreviousBucketOfActiveTab(activeBucket);
    setFilter({
      ..._.omit(filterState, 'previousStartDate', 'previousEndDate'),
      status: 'Completed',
      endDateStart: filterState.previousStartDate,
      startDateEnd: filterState.previousEndDate,
    });
    setPast(true);
    if (previousBucketOfPastChallengesTab) {
      selectBucket(previousBucketOfPastChallengesTab);
    } else {
      selectBucket(BUCKETS.ALL_PAST);
    }
  };

  return (
    <div styleName="SideBarFilters">
      <ul styleName="StatusBar">
        <li
          styleName={`Status ${!past ? 'active' : ''}`}
          onClick={onActiveClick}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') {
              return;
            }
            onActiveClick();
          }}
          role="presentation"
        >
          Active
        </li>
        <li
          styleName={`Status ${past ? 'active' : ''}`}
          onClick={onPastChallengesClick}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') {
              return;
            }
            onPastChallengesClick();
          }}
          role="presentation"
        >
          Past Challenges
        </li>
      </ul>
      <div styleName="FilterBox">
        {/* { editSavedFiltersMode ? (
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
        ) : ( */}
        <BucketSelector
          activeBucket={activeBucket}
          // activeSavedFilter={activeSavedFilter}
          // buckets={buckets}
          // challenges={challenges}
          // communityFilter={communityFilter}
          disabled={disabled}
          expanding={expanding}
          // extraBucket={extraBucket}
          // filterState={filterState}
          isAuth={isAuth}
          // savedFilters={savedFilters}
          selectBucket={selectBucket}
          // selectSavedFilter={selectSavedFilter}
          // setEditSavedFiltersMode={setEditSavedFiltersMode}
          past={past}
        />
        {/* )} */}
      </div>
      {/* <Footer hideTcLinksInFooter /> */}
    </div>
  );
}

SideBarFilters.defaultProps = {
  // communityFilter: null,
  disabled: false,
  // dragState: {},
  // extraBucket: null,
  // hideTcLinksInFooter: false,
  isAuth: false,
  expanding: false,
  previousBucketOfActiveTab: null,
  previousBucketOfPastChallengesTab: null,
  setPreviousBucketOfActiveTab: () => {},
  setPreviousBucketOfPastChallengesTab: () => {},
};

SideBarFilters.propTypes = {
  activeBucket: PT.string.isRequired,
  expanding: PT.bool,
  // activeSavedFilter: PT.number.isRequired,
  // buckets: PT.shape().isRequired,
  // challenges: PT.arrayOf(PT.shape({
  // })).isRequired,
  // changeFilterName: PT.func.isRequired,
  // communityFilter: PT.shape(),
  // deleteSavedFilter: PT.func.isRequired,
  disabled: PT.bool,
  // dragState: PT.shape(),
  // dragSavedFilterMove: PT.func.isRequired,
  // dragSavedFilterStart: PT.func.isRequired,
  // editSavedFiltersMode: PT.bool.isRequired,
  // extraBucket: PT.string,
  filterState: PT.shape().isRequired,
  // hideTcLinksInFooter: PT.bool,
  isAuth: PT.bool,
  // resetFilterName: PT.func.isRequired,
  // savedFilters: PT.arrayOf(PT.shape()).isRequired,
  selectBucket: PT.func.isRequired,
  // selectSavedFilter: PT.func.isRequired,
  // setEditSavedFiltersMode: PT.func.isRequired,
  // updateAllSavedFilters: PT.func.isRequired,
  // updateSavedFilter: PT.func.isRequired,
  setFilter: PT.func.isRequired,
  past: PT.bool.isRequired,
  setPast: PT.func.isRequired,
  previousBucketOfActiveTab: PT.string,
  previousBucketOfPastChallengesTab: PT.string,
  setPreviousBucketOfActiveTab: PT.func,
  setPreviousBucketOfPastChallengesTab: PT.func,
};
