import { actions } from 'topcoder-react-lib';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import Home from 'components/tc-communities/communities/zurich/Home';
import { connect } from 'react-redux';
import { BUCKETS } from 'utils/challenge-listing/buckets';

function mapDispatchToProps(dispatch) {
  return {
    resetChallengeListing: () => {
      const a = actions.challengeListing;
      const sa = challengeListingSidebarActions.challengeListing.sidebar;
      dispatch(a.selectCommunity(''));
      dispatch(a.setFilter({}));
      dispatch(sa.selectBucket(BUCKETS.ALL));
    },
  };
}

export default connect(() => ({}), mapDispatchToProps)(Home);
