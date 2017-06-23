/**
 * Container for the Sidebar.
 */

import _ from 'lodash';
import actions from 'actions/challenge-listing/sidebar';
import PT from 'prop-types';
import React from 'react';
import Sidebar from 'components/challenge-listing/SideBarFilters';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getBuckets } from 'utils/challenge-listing/buckets';

class Container extends React.Component {

  componentDidMount() {
    const token = this.props.tokenV2;
    if (token) this.props.getSavedFilters(token);
  }

  render() {
    const buckets = getBuckets(this.props.user);
    return (
      <Sidebar
        {...this.props}
        buckets={buckets}
      />
    );
  }
}

Container.defaultProps = {
  tokenV2: null,
  user: null,
};

Container.propTypes = {
  getSavedFilters: PT.func.isRequired,
  tokenV2: PT.string,
  user: PT.string,
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.sidebar;
  return bindActionCreators(a, dispatch);
}

function mapStateToProps(state) {
  return {
    ...state.challengeListing.sidebar,
    challenges: state.challengeListing.challenges,
    filterState: state.challengeListing.filterState,
    savedFilters: state.challengeListing.sidebar.savedFilters,
    tokenV2: state.auth.tokenV2,
    user: _.get(state.auth.user, 'handle'),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
