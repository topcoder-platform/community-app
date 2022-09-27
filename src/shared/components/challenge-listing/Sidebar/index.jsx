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
import { COMPOSE, PRIORITY } from 'react-css-super-themr';
// import _ from 'lodash';
import { isPastBucket } from 'utils/challenge-listing/buckets';
import ChallengeSearchBar from 'containers/challenge-listing/ChallengeSearchBar';
import { REVIEW_OPPORTUNITY_TYPES } from 'utils/tc';
import _ from 'lodash';
import BucketSelector from './BucketSelector';
import Button from '../Filters/Button';

// import FiltersEditor from './FiltersEditor';
// import Footer from './Footer';
import style from './style.scss';

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
  // filterState,
  // hideTcLinksInFooter,
  isAuth,
  // resetFilterName,
  // savedFilters,
  selectBucket,
  // selectSavedFilter,
  // setEditSavedFiltersMode,
  // updateAllSavedFilters,
  // updateSavedFilter,
  // setFilter,
  setFilterState,
  setRecommendedToggle,
  setTcoToggle,
  setSort,
  defaultCommunityId,
  selectCommunity,
  setSearchText,
}) {
  const past = isPastBucket(activeBucket);

  const resetFilters = () => {
    setRecommendedToggle(false);
    setTcoToggle(false);
    setSort('openForRegistration', 'startDate');
    setFilterState({
      tracks: {
        Dev: true,
        Des: true,
        DS: true,
        QA: true,
      },
      search: '',
      tco: false,
      tags: [],
      types: ['CH', 'F2F', 'TSK', 'MM', 'RDM', 'SRM', 'SKL'],
      groups: [],
      events: [],
      endDateStart: null,
      startDateEnd: null,
      status: 'Active',
      reviewOpportunityTypes: _.keys(REVIEW_OPPORTUNITY_TYPES),
      customDate: false,
      recommended: false,
    });
    selectCommunity(defaultCommunityId);
    setSearchText('');
  };


  return (
    <div styleName="SideBarFilters">
      {/* <ul styleName="StatusBar">
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
      </ul> */}
      <div styleName="buttons">
        <Button
          composeContextTheme={COMPOSE.SOFT}
          // disabled={disableClearFilterButtons}
          onClick={resetFilters}
          theme={{ button: style.button }}
          themePriority={PRIORITY.ADHOC_DEFAULT_CONTEXT}
        >
          RESET FILTERS
        </Button>
      </div>
      <div styleName="FilterBox">
        <ChallengeSearchBar setFilterState={setFilterState} />

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
      <hr styleName="hr" />
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
  // filterState: PT.shape().isRequired,
  // hideTcLinksInFooter: PT.bool,
  isAuth: PT.bool,
  // resetFilterName: PT.func.isRequired,
  // savedFilters: PT.arrayOf(PT.shape()).isRequired,
  selectBucket: PT.func.isRequired,
  // selectSavedFilter: PT.func.isRequired,
  // setEditSavedFiltersMode: PT.func.isRequired,
  // updateAllSavedFilters: PT.func.isRequired,
  // updateSavedFilter: PT.func.isRequired,
  // setFilter: PT.func.isRequired,
  setFilterState: PT.func.isRequired,
  setRecommendedToggle: PT.func.isRequired,
  setTcoToggle: PT.func.isRequired,
  setSort: PT.func.isRequired,
  defaultCommunityId: PT.string.isRequired,
  selectCommunity: PT.func.isRequired,
  setSearchText: PT.func.isRequired,
};
