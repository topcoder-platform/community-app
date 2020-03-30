import _ from 'lodash';
import { connect } from 'react-redux';
import { actions } from 'topcoder-react-lib';
import MemberSearch from 'components/MemberSearch';

function mapStateToProps({ memberSearch }) {
  return {
    pageLoaded: memberSearch.pageLoaded,
    loadingMore: memberSearch.loadingMore,
    error: memberSearch.error,

    usernameMatches: memberSearch.usernameMatches,
    moreMatchesAvailable: memberSearch.moreMatchesAvailable,
    totalCount: memberSearch.totalCount,
    topMembers: memberSearch.topMembers,

    previousSearchTerm: memberSearch.previousSearchTerm,
    searchTermTag: memberSearch.searchTermTag,
  };
}

function mapDispatchToProps(dispatch) {
  const memberSearchActions = actions.memberSearch;
  return {
    loadMemberSearch: (searchTerm, stateProps) => {
      const numCurrentUsernameMatches = stateProps.usernameMatches.length;
      const { previousSearchTerm } = stateProps;
      const isPreviousSearchTerm = _.isString(previousSearchTerm);
      const isNewSearchTerm = isPreviousSearchTerm && searchTerm.toLowerCase()
        !== previousSearchTerm.toLowerCase();

      if (isNewSearchTerm) {
        dispatch(memberSearchActions.clearMemberSearch());
      } else if (previousSearchTerm && numCurrentUsernameMatches >= 10) {
        dispatch(memberSearchActions.loadMoreUsernames());
        dispatch(memberSearchActions.usernameSearchSuccess(searchTerm, numCurrentUsernameMatches));
        return;
      }

      dispatch(memberSearchActions.setSearchTerm(searchTerm));
      dispatch(memberSearchActions.checkIfSearchTermIsATag(searchTerm))
        .then((res) => {
          const tag = res.payload;
          dispatch(memberSearchActions.setSearchTag(tag));

          const topMemberSearchSuccessAction = tag
            ? memberSearchActions.topMemberSearchSuccess(tag) : null;
          const usernameSearchSuccessAction = memberSearchActions
            .usernameSearchSuccess(searchTerm);

          let p;
          if (topMemberSearchSuccessAction) {
            p = dispatch(topMemberSearchSuccessAction)
              .then(() => dispatch(usernameSearchSuccessAction));
          } else {
            p = dispatch(usernameSearchSuccessAction);
          }

          return p
            .then(() => dispatch(memberSearchActions.memberSearchSuccess()))
            .catch((err) => {
              dispatch(memberSearchActions.resetSearchTerm());
              throw new Error(`Could not resolve all promises. Reason: ${err}`);
            });
        });
    },
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    loadMemberSearch: searchTerm => dispatchProps.loadMemberSearch(searchTerm, stateProps),
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(MemberSearch);

export default Container;
