import Home from 'components/tc-communities/communities/srmx/Home';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    tokenV2: state.auth.tokenV2,
  };
}

export default connect(mapStateToProps)(Home);
