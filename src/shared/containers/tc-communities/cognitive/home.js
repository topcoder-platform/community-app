import _ from 'lodash';
import Home from 'components/tc-communities/communities/cognitive/Home';
import resourcesActions from 'actions/page/communities/cognitive/resources';

import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    allFaqItemsClosedInResourcesPage:
      _.isEmpty(state.page.communities.cognitive.resources.shownFaqItems),
  };
}

function mapDispatchToActions(dispatch) {
  const ra = resourcesActions.page.communities.cognitive.resources;
  return {
    closeAllFaqItemsInResourcesPage: () => dispatch(ra.closeAllFaqItems()),
    toggleFaqItemInResourcesPage:
      (index, show) => dispatch(ra.toggleFaqItem(index, show)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(Home);
