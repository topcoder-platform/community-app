import _ from 'lodash';
import challengeListingActions from 'actions/challenge-listing';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import Home from 'components/tc-communities/communities/iot/Home';
import { connect } from 'react-redux';
import { BUCKETS } from 'utils/challenge-listing/buckets';

function mapStateToProps(state) {
  return {
    userId: _.get(state.auth.user, 'userId'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetChallengeListing: () => {
      const a = challengeListingActions.challengeListing;
      const sa = challengeListingSidebarActions.challengeListing.sidebar;
      dispatch(a.selectCommunity(''));
      dispatch(a.setFilter({}));
      dispatch(sa.selectBucket(BUCKETS.ALL));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
