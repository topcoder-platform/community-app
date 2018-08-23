import _ from 'lodash';
import Home from 'components/tc-communities/communities/tco19/Home';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    userGroups: _.get(state.auth.profile, 'groups'),
  };
}

export default connect(mapStateToProps)(Home);
