/**
 * Container for the standard Topcoder header.
 */

import actions from 'actions/topcoder_header';
import TopcoderHeader from 'components/TopcoderHeader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export default connect(
  state => ({
    ...state.topcoderHeader,
    profile: state.auth.profile,
  }),
  dispatch => bindActionCreators(actions.topcoderHeader, dispatch),
)(TopcoderHeader);
