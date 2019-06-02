import pageAactions from 'actions/page/communities/iot/assets';
import _ from 'lodash';
import { actions, challenges } from 'topcoder-react-lib';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import Assets from 'components/tc-communities/communities/iot/Assets';
import { connect } from 'react-redux';

const Buckets = challenges.buckets;

function mapStateToProps(state) {
  return {
    userId: _.get(state.auth.user, 'userId'),
    display: state.page.communities.iot.assets.display,
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
    toggleGrid: () => {
      const a = pageAactions.page.communities.iot.assets;
      dispatch(a.toggleGrid());
    },
    toggleList: () => {
      const a = pageAactions.page.communities.iot.assets;
      dispatch(a.toggleList());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Assets);
