import actions from 'actions/page/communities/iot/assets';
import _ from 'lodash';
import challengeListingActions from 'actions/challenge-listing';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import Assets from 'components/tc-communities/communities/iot/Assets';
import { connect } from 'react-redux';
import { BUCKETS } from 'utils/challenge-listing/buckets';

function mapStateToProps(state) {
  return {
    userId: _.get(state.auth.user, 'userId'),
    display: state.page.communities.iot.assets.display,
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
    toggleGrid: () => {
      const a = actions.page.communities.iot.assets;
      dispatch(a.toggleGrid());
    },
    toggleList: () => {
      const a = actions.page.communities.iot.assets;
      dispatch(a.toggleList());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Assets);
