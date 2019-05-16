import _ from 'lodash';
import { actions, challenges } from 'topcoder-react-lib';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import GetStarted from 'components/tc-communities/communities/iot/GetStarted';
import { connect } from 'react-redux';

const Buckets = challenges.buckets;

function mapStateToProps(state) {
  return {
    userId: _.get(state.auth.user, 'userId'),
  };
}

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

export default connect(mapStateToProps, mapDispatchToProps)(GetStarted);
