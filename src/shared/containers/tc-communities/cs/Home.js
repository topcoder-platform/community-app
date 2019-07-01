import { actions, challenges } from 'topcoder-react-lib';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import Home from 'components/tc-communities/communities/cs/Home';
import { connect } from 'react-redux';

const Buckets = challenges.buckets;

function mapDispatchToProps(dispatch) {
  return {
    resetChallengeListing: () => {
      const a = actions.challengeListing;
      const sa = challengeListingSidebarActions.challengeListing.sidebar;
      dispatch(a.selectCommunity(''));
      dispatch(a.setFilter({}));
      dispatch(sa.selectBucket(Buckets.BUCKETS.ALL));
    },
  };
}

export default connect(() => ({}), mapDispatchToProps)(Home);
