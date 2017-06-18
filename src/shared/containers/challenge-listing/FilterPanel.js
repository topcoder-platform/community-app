/**
 * Container for the header filters panel.
 */

import actions from 'actions/challenge-listing/filter-panel';
import FilterPanel from 'components/challenge-listing/Filters/ChallengeFilters';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.filterPanel;
  return bindActionCreators(a, dispatch);
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    ...state.challengeListing.filterPanel,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
