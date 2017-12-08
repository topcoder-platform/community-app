import _ from 'lodash';
import actions from 'actions/page/communities/cognitive/resources';
import PT from 'prop-types';
import React from 'react';
import Resources from
  'components/tc-communities/communities/cognitive/Resources';

import { connect } from 'react-redux';

class Container extends React.Component {
  componentWillUnmount() {
    if (!_.isEmpty(this.props.shownFaqItems)) {
      this.props.closeAllFaqItems();
    }
  }

  render() {
    return <Resources {...this.props} />;
  }
}

Container.propTypes = {
  closeAllFaqItems: PT.func.isRequired,
  shownFaqItems: PT.shape().isRequired,
};

function mapStateToProps(state) {
  return state.page.communities.cognitive.resources;
}

function mapDispatchToActions(dispatch) {
  const a = actions.page.communities.cognitive.resources;
  return {
    closeAllFaqItems: () => dispatch(a.closeAllFaqItems()),
    toggleFaqItem: (index, show) =>
      dispatch(a.toggleFaqItem(index, show, true)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(Container);
