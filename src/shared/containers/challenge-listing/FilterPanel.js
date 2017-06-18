/**
 * Container for the header filters panel.
 */

import actions from 'actions/challenge-listing/filter-panel';
import challengeListingActions from 'actions/challenge-listing';
import FilterPanel from 'components/challenge-listing/Filters/ChallengeFilters';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.filterPanel;
  const cla = challengeListingActions.challengeListing;
  return {
    ...bindActionCreators(a, dispatch),
    setFilterState: s => dispatch(cla.setFilterState(s)),
  };
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    ...state.challengeListing.filterPanel,
    filterState: state.challengeListing.filterState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
