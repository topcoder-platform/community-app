/**
 * Payment listing container.
 */

import _ from 'lodash';
import actions from 'actions';
import Listing from 'components/sandbox/payments/Listing';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { goToLogin } from 'utils/tc';

function selectProjectAndLoadMemberTasks(projectId, props) {
  props.selectProject(projectId);
  props.loadMemberTasks(projectId, 0, props.tokenV3);
}

class ListingContainer extends React.Component {
  componentDidMount() {
    const {
      loadingProjectsForUsername,
      loadProjects,
      tokenV3,
      username,
    } = this.props;
    if (!tokenV3) return goToLogin('payments-tool');
    if (username && username !== loadingProjectsForUsername) {
      loadProjects(tokenV3);
    }
    return undefined;
  }

  componentWillReceiveProps(nextProps) {
    const {
      loadingProjectsForUsername,
      loadProjects,
      projects,
      selectedProjectId,
      tokenV3,
      username,
    } = nextProps;
    if (!tokenV3) return goToLogin('payments-tool');
    if (username !== this.props.username && username
    && username !== loadingProjectsForUsername) {
      loadProjects(tokenV3);
    }
    if (!selectedProjectId && projects.length) {
      selectProjectAndLoadMemberTasks(projects[0].id, nextProps);
    }
    return undefined;
  }

  render() {
    const {
      loadingMemberTasks,
      loadingProjectsForUsername,
      memberTasks,
      projects,
      selectedProjectId,
      tokenV3,
    } = this.props;

    if ((loadingProjectsForUsername && !projects.length) || !tokenV3) {
      return <LoadingIndicator />;
    }

    return (
      <Listing
        loadingMemberTasks={loadingMemberTasks}
        memberTasks={memberTasks}
        projects={projects}
        selectedProjectId={selectedProjectId}
        selectProject={projectId =>
          selectProjectAndLoadMemberTasks(projectId, this.props)}
      />
    );
  }
}

ListingContainer.propTypes = {
  loadingMemberTasks: PT.bool.isRequired,
  loadProjects: PT.func.isRequired,
  loadingProjectsForUsername: PT.string.isRequired,
  memberTasks: PT.arrayOf(PT.object).isRequired,
  projects: PT.arrayOf(PT.object).isRequired,
  selectedProjectId: PT.number.isRequired,
  // selectProject: PT.func.isRequired,
  tokenV3: PT.string.isRequired,
  username: PT.string.isRequired,
};

/**
 * State-to-props mapper.
 * @param {Object} state Redux state.
 * @return {Object} Listing container props.
 */
function mapStateToProps(state) {
  const { auth, direct, memberTasks } = state;
  const page = state.page.sandbox.payments.listing;
  return {
    loadingMemberTasks: Boolean(memberTasks.loadingUuid),
    loadingProjectsForUsername: direct.loadingProjectsForUsername,
    memberTasks: memberTasks.tasks,
    projects: direct.projects,
    selectedProjectId: page.selectedProjectId,
    tokenV3: auth.tokenV3,
    username: _.get(auth, 'user.handle', ''),
  };
}

/**
 * Dispatch/actions-to-props mapper.
 * @param {Function} dispatch
 * @return {Object} Listing container props.
 */
function mapDispatchToProps(dispatch) {
  const { direct, memberTasks } = actions;
  const { payments } = actions.page.sandbox;
  return {
    loadMemberTasks: (projectId, pageNum, tokenV3) => {
      const uuid = shortid();
      dispatch(memberTasks.getInit(uuid, pageNum));
      dispatch(memberTasks.getDone(uuid, projectId, pageNum, tokenV3));
    },
    loadProjects: (tokenV3) => {
      dispatch(direct.getUserProjectsInit(tokenV3));
      dispatch(direct.getUserProjectsDone(tokenV3));
    },
    selectProject: (projectId) => {
      dispatch(payments.editor.selectProject(projectId));
      dispatch(payments.listing.selectProject(projectId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListingContainer);
