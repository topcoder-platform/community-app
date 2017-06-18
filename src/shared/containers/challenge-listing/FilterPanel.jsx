/**
 * Container for the header filters panel.
 */

import actions from 'actions/challenge-listing/filter-panel';
import challengeListingActions from 'actions/challenge-listing';
import FilterPanel from 'components/challenge-listing/Filters/ChallengeFilters';
import PT from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Container extends React.Component {

  componentDidMount() {
    if (!this.props.loadingSubtracks) this.props.getSubtracks();
    if (!this.props.loadingKeywords) this.props.getKeywords();
  }

  render() {
    return <FilterPanel {...this.props} />;
  }
}

Container.propTypes = {
  getKeywords: PT.func.isRequired,
  getSubtracks: PT.func.isRequired,
  loadingKeywords: PT.bool.isRequired,
  loadingSubtracks: PT.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.filterPanel;
  const cla = challengeListingActions.challengeListing;
  return {
    ...bindActionCreators(a, dispatch),
    getSubtracks: () => {
      dispatch(cla.getChallengeSubtracksInit());
      dispatch(cla.getChallengeSubtracksDone());
    },
    getKeywords: () => {
      dispatch(cla.getChallengeTagsInit());
      dispatch(cla.getChallengeTagsDone());
    },
    setFilterState: s => dispatch(cla.setFilterState(s)),
  };
}

function mapStateToProps(state, ownProps) {
  const cl = state.challengeListing;
  return {
    ...ownProps,
    ...state.challengeListing.filterPanel,
    filterState: cl.filterState,
    loadingKeywords: cl.loadingChallengeTags,
    loadingSubtracks: cl.loadingChallengeSubtracks,
    validKeywords: cl.challengeTags,
    validSubtracks: cl.challengeSubtracks,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
