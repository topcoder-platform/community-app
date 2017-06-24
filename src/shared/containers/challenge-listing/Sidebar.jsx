/**
 * Container for the Sidebar.
 */

import _ from 'lodash';
import actions from 'actions/challenge-listing/sidebar';
import PT from 'prop-types';
import React from 'react';
import Sidebar from 'components/challenge-listing/Sidebar';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BUCKETS, getBuckets } from 'utils/challenge-listing/buckets';

class SidebarContainer extends React.Component {

  componentDidMount() {
    const token = this.props.tokenV2;
    if (token) this.props.getSavedFilters(token);
  }

  render() {
    const buckets = getBuckets(this.props.user && this.props.user.handle);
    return (
      <Sidebar
        {...this.props}
        buckets={buckets}
      />
    );
  }
}

SidebarContainer.defaultProps = {
  tokenV2: null,
  user: null,
};

SidebarContainer.propTypes = {
  getSavedFilters: PT.func.isRequired,
  tokenV2: PT.string,
  user: PT.shape(),
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.sidebar;
  return bindActionCreators(a, dispatch);
}

function mapStateToProps(state) {
  const activeBucket = state.challengeListing.sidebar.activeBucket;
  const pending = _.keys(state.challengeListing.pendingRequests);
  return {
    ...state.challengeListing.sidebar,
    challenges: state.challengeListing.challenges,
    disabled: (activeBucket === BUCKETS.ALL) && Boolean(pending.length),
    filterState: state.challengeListing.filter,
    isAuth: Boolean(state.auth.user),
    tokenV2: state.auth.tokenV2,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContainer);
