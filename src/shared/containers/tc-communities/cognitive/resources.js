import actions from 'actions/page/communities/cognitive/resources';

import Resources from
  'components/tc-communities/communities/cognitive/Resources';

import { connect } from 'react-redux';

function mapStateToProps(state) {
  return state.page.communities.cognitive.resources;
}

function mapDispatchToActions(dispatch) {
  const a = actions.page.communities.cognitive.resources;
  return {
    toggleFaqItem: (index, show) =>
      dispatch(a.toggleFaqItem(index, show, true)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(Resources);
