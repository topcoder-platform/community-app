import _ from 'lodash';
import actions from 'actions/page/communities/blockchain/bsic-incubator';
import PT from 'prop-types';
import React from 'react';
import BsicIncubator from
  'components/tc-communities/communities/blockchain/BsicHackathon';

import { connect } from 'react-redux';

class Container extends React.Component {
  componentWillUnmount() {
    if (!_.isEmpty(this.props.shownFaqItems)) {
      this.props.closeAllFaqItems();
    }
  }

  render() {
    return <BsicIncubator {...this.props} />;
  }
}

Container.propTypes = {
  closeAllFaqItems: PT.func.isRequired,
  shownFaqItems: PT.shape().isRequired,
};

function mapStateToProps(state) {
  return state.page.communities.blockchain.bsicIncubator;
}

function mapDispatchToActions(dispatch) {
  const a = actions.page.communities.blockchain.bsicIncubator;
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
