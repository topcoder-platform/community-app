import _ from 'lodash';
import Home from 'components/tc-communities/communities/blockchain/Home';
import qs from 'qs';
import { connect } from 'react-redux';

function mapStateToProps(state, props) {
  let q = props.location.search.slice(1);
  if (q) q = qs.parse(q);
  return {
    showBuffaloHackathonBanner: q.utm_campaign === 'buffalohack',
    userGroups: _.get(state.auth.profile, 'groups'),
  };
}

export default connect(mapStateToProps)(Home);
