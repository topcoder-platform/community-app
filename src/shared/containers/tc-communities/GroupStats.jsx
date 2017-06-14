/**
 * Container for GroupStats component. It automatically loads and renders stats
 * for the currently loaded TC community.
 */

import actions from 'actions/stats';
import GroupStats from 'components/tc-communities/GroupStats';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

class GroupStatsContainer extends React.Component {

  /* When container mounts we get / update related stats. */
  componentDidMount() {
    this.props.getGroupStats(this.props.groupId, this.props.token);
  }

  /* When group or auth token is changed we get / update related stats. */
  componentWillReceiveProps(nextProps) {
    if ((nextProps.groupId !== this.props.groupId)
    || (nextProps.token !== this.props.token)) {
      this.props.getGroupStats(nextProps.groupId, nextProps.token);
    }
  }

  render() {
    return (
      <GroupStats stats={this.props.stats} />
    );
  }
}

GroupStatsContainer.defaultProps = {
  stats: {},
  token: '',
};

GroupStatsContainer.propTypes = {
  getGroupStats: PT.func.isRequired,
  groupId: PT.string.isRequired,
  stats: PT.shape(),
  token: PT.string,
};

function mapDispatchToProps(dispatch) {
  return {
    getGroupStats: (...args) => dispatch(actions.stats.getGroupStats(...args)),
  };
}

function mapStateToProps(state) {
  const groupId = state.tcCommunities.meta.challengeGroupId;
  return {
    groupId,
    stats: state.stats.groups[groupId],
    token: state.auth.tokenV3,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupStatsContainer);
