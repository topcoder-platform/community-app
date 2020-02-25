import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ListContainer from '../ListContainer';
import TopMemberList from '../TopMemberList';
import MemberList from '../MemberList';
import MemberItem from '../MemberItem';
import LoadingListItem from '../LoadingListItem';
import PageError from '../PageError';
import NoResults from '../NoResults';
import LoadMoreButton from '../LoadMoreButton';
import EndOfResults from '../EndOfResults';
import { getSearchTagPreposition } from '../helpers';

import './style.scss';

const MemberSearchView = (props) => {
  const { pageLoaded, loadingMore, error } = props;
  const {
    usernameMatches,
    totalCount,
    topMembers,
    moreMatchesAvailable,
    loadMemberSearch,
  } = props;
  const { previousSearchTerm: searchTerm, searchTermTag: tag } = props;

  function renderPageState() {
    let result = null;
    if (error) {
      result = (
        <ReactCSSTransitionGroup
          transitionName="page-error"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          <PageError />
        </ReactCSSTransitionGroup>
      );
    } else if (searchTerm && pageLoaded && !usernameMatches.length && !topMembers.length) {
      result = (
        <ReactCSSTransitionGroup
          transitionName="no-results"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          <NoResults entry={searchTerm} />
        </ReactCSSTransitionGroup>
      );
    } else if (!pageLoaded && !usernameMatches.length && !topMembers.length) {
      const loadingListItems = [];

      for (let i = 0; i < 10; i += 1) {
        loadingListItems.push(<LoadingListItem type="MEMBER" key={`${i}`} />);
      }

      result = (
        <ReactCSSTransitionGroup
          transitionName="list-container"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          <ListContainer
            headerText="Loading members..."
          >
            <ul>
              {loadingListItems}
            </ul>
          </ListContainer>
        </ReactCSSTransitionGroup>
      );
    }

    return result;
  }

  function renderTopMembers() {
    if (pageLoaded && tag && topMembers.length) {
      const preposition = getSearchTagPreposition(tag.domain);

      return (
        <ListContainer
          headerText={`Top Members ${preposition} `}
          headerHighlightedText={tag.name}
        >
          <TopMemberList topMembers={topMembers} />
        </ListContainer>
      );
    }

    return null;
  }

  function renderUsernameMatches() {
    let memberMatches;
    let exactMemberMatch;
    let restOfUsernameMatches;

    if (pageLoaded && usernameMatches.length) {
      // Check if the first member in the array matches the search term
      const isSearchTerm = _.isString(searchTerm);
      const isExactMatch = isSearchTerm
        && usernameMatches[0].handle.toLowerCase() === searchTerm.toLowerCase();

      // If it's an exact match, and there is no leaderboard,
      // show the exact match separately
      if (isExactMatch && !tag) {
        exactMemberMatch = <MemberItem member={usernameMatches[0]} withBio shouldAnimate />;

        restOfUsernameMatches = usernameMatches.slice(1);
      }

      // If there is an exact match and no other matching usernames
      if (restOfUsernameMatches && restOfUsernameMatches.length === 0) {
        memberMatches = null;
      } else {
        memberMatches = (
          <ReactCSSTransitionGroup
            transitionName="list-container"
            transitionAppear
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            <ListContainer
              headerText="Usernames matching "
              headerHighlightedText={searchTerm}
              numListItems={totalCount}
            >
              <MemberList members={exactMemberMatch ? restOfUsernameMatches : usernameMatches} />
            </ListContainer>
          </ReactCSSTransitionGroup>
        );
      }
    }

    return {
      exactMemberMatch,
      memberMatches,
    };
  }

  function renderLoadMoreButton() {
    const loadMoreMembers = () => {
      loadMemberSearch(searchTerm);
    };

    if (moreMatchesAvailable && pageLoaded && !loadingMore
      && !error && usernameMatches.length === 10) {
      return <LoadMoreButton callback={loadMoreMembers} />;
    }

    if (moreMatchesAvailable && loadingMore && !error && usernameMatches.length === 10) {
      return <LoadMoreButton callback={loadMoreMembers} loading />;
    }

    return null;
  }

  function renderEndOfResults() {
    const numResults = usernameMatches.length;

    // Don't show 'End of results' if the page is loading
    let result;
    if (!pageLoaded) {
      result = null;
    } else if (numResults !== totalCount) { // Or if there are more members to load
      result = null;
    } else if (numResults === 0 && topMembers.length === 0) { // Or if there are no results at all
      result = null;
    } else {
      result = <EndOfResults />;
    }

    return result;
  }

  const {
    exactMemberMatch: exactMemberMatchItem, memberMatches: memberMatchItems,
  } = renderUsernameMatches();
  const topMemberLeaderboard = renderTopMembers();
  const pageStatus = renderPageState();
  const loadMoreButton = renderLoadMoreButton();
  const endOfResults = renderEndOfResults();

  return (
    <div styleName="member-search-view">
      {pageStatus}

      {exactMemberMatchItem}

      {topMemberLeaderboard}

      {memberMatchItems}

      {loadMoreButton}

      {endOfResults}
    </div>
  );
};

MemberSearchView.propTypes = {
  pageLoaded: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,

  usernameMatches: PropTypes.arrayOf(PropTypes.shape({
    handle: PropTypes.string,
  })).isRequired,
  moreMatchesAvailable: PropTypes.bool.isRequired,
  totalCount: PropTypes.number.isRequired,
  topMembers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

  previousSearchTerm: PropTypes.string,
  searchTermTag: PropTypes.shape({}),

  loadMemberSearch: PropTypes.func.isRequired,
};

MemberSearchView.defaultProps = {
  previousSearchTerm: null,
  searchTermTag: null,
};

export default MemberSearchView;
