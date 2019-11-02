import challengeListingActions from 'actions/challenge-listing';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import Home from 'components/tc-communities/communities/cs/Home';
import { connect } from 'react-redux';
import { BUCKETS } from 'utils/challenge-listing/buckets';

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

export default connect(() => ({}), mapDispatchToProps)(Home);
