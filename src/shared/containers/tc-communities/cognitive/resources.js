import actions from 'actions/page/communities/cognitive/resources';

import Resources from
  'components/tc-communities/communities/cognitive/Resources';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
  return state.page.communities.cognitive.resources;
}

function mapDispatchToActions(dispatch) {
  return bindActionCreators(
    actions.page.communities.cognitive.resources, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(Resources);
