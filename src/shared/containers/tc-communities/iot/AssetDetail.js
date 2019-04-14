import _ from 'lodash';
import { actions } from 'topcoder-react-lib';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import AssetDetail from 'components/tc-communities/communities/iot/AssetDetail';
import { connect } from 'react-redux';
import { BUCKETS } from 'utils/challenge-listing/buckets';


function mapStateToProps(state, ownProps) {
  return {
    userId: _.get(state.auth.user, 'userId'),
    assetId: ownProps.match.params.assetId,
  };
}

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

export default connect(mapStateToProps, mapDispatchToProps)(AssetDetail);
