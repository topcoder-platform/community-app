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
    _.noop();
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
  user: null,
};

Container.propTypes = {
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
    user: _.get(state.auth.user, 'handle'),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
