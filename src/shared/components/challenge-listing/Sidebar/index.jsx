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

export default function SideBarFilters(props) {
  return (
    <div styleName="SideBarFilters">
      <div styleName="FilterBox">
        { props.editSavedFiltersMode ? (
          <FiltersEditor
            changeFilterName={props.changeFilterName}
            deleteSavedFilter={props.deleteSavedFilter}
            dragState={props.dragState}
            dragSavedFilterMove={props.dragSavedFilterMove}
            dragSavedFilterStart={props.dragSavedFilterStart}
            resetFilterName={props.resetFilterName}
            savedFilters={props.savedFilters}
            setEditSavedFiltersMode={props.setEditSavedFiltersMode}
            updateAllSavedFilters={props.updateAllSavedFilters}
            updateSavedFilter={props.updateSavedFilter}
          />
        ) : (
          <BucketSelector
            activeBucket={props.activeBucket}
            activeSavedFilter={props.activeSavedFilter}
            buckets={props.buckets}
            challenges={props.challenges}
            communityFilter={props.communityFilter}
            disabled={props.disabled}
            extraBucket={props.extraBucket}
            filterState={props.filterState}
            isAuth={props.isAuth}
            savedFilters={props.savedFilters}
            selectBucket={props.selectBucket}
            selectSavedFilter={props.selectSavedFilter}
            setEditSavedFiltersMode={props.setEditSavedFiltersMode}
          />
        )}
      </div>
      <Footer hideTcLinksInFooter={props.hideTcLinksInFooter} />
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
};
