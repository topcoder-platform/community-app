/**
 * Payment editor.
 */
/* NOTE: Many props in this module are consumed indirectly via helper functions,
 * ESLint is not able to track them, hence the rule is disabled for now. */
/* eslint-disable react/no-unused-prop-types */

import _ from 'lodash';
import actions from 'actions';
import Editor from 'components/sandbox/payments/Editor';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { goToLogin } from 'utils/tc';

/**
 * Handles the loading of project details, if necessary for the specified set
 * of props.
 * @param {Object} props
 */
function handleProjectDetailsLoading(props) {
  const {
    loadingProjectDetailsForId,
    loadProjectDetails,
    projectDetails,
    selectedProjectId,
    tokenV3,
  } = props;
  if (!projectDetails && selectedProjectId
  && selectedProjectId !== loadingProjectDetailsForId) {
    loadProjectDetails(selectedProjectId, tokenV3);
  }
}

class EditorContainer extends React.Component {
  componentDidMount() {
    const {
      loadingProjectsForUsername,
      loadProjects,
      projects,
      selectedProjectId,
      selectProject,
      tokenV3,
      username,
    } = this.props;
    if (!tokenV3) return goToLogin();
    if (username && username !== loadingProjectsForUsername) {
      loadProjects(tokenV3);
    }
    if (!selectedProjectId && projects.length) {
      selectProject(projects[0].id);
    }
    handleProjectDetailsLoading(this.props);
    return undefined;
  }

  componentWillReceiveProps(nextProps) {
    const {
      loadingProjectsForUsername,
      loadProjects,
      projects,
      selectedProjectId,
      selectProject,
      tokenV3,
      username,
    } = nextProps;
    if (!tokenV3) return goToLogin();
    const {
      projects: oldProjects,
      username: oldUsername,
    } = this.props;
    if (username && username !== oldUsername
    && username !== loadingProjectsForUsername) {
      loadProjects(tokenV3);
    }
    const selectedProjectIdNum = Number(selectedProjectId);
    if (projects.length
    && (
      !selectedProjectId
      || (
        projects !== oldProjects
        && !projects.some(p => p.id === selectedProjectIdNum)
      )
    )) {
      selectProject(projects[0].id);
    }
    handleProjectDetailsLoading(nextProps);
    return undefined;
  }

  render() {
    const {
      projects,
      selectedProjectId,
      selectProject,
      tokenV3,
    } = this.props;
    if (!tokenV3) return <LoadingIndicator />;
    return (
      <Editor
        projects={projects}
        selectedProjectId={selectedProjectId}
        selectProject={selectProject}
      />
    );
  }
}

EditorContainer.defaultProps = {
  projectDetails: null,
};

EditorContainer.propTypes = {
  loadingProjectDetailsForId: PT.number.isRequired,
  loadingProjectsForUsername: PT.string.isRequired,
  loadProjectDetails: PT.func.isRequired,
  loadProjects: PT.func.isRequired,
  projectDetails: PT.shape(),
  projects: PT.arrayOf(PT.object).isRequired,
  selectedProjectId: PT.number.isRequired,
  selectProject: PT.func.isRequired,
  tokenV3: PT.string.isRequired,
  username: PT.string.isRequired,
};

function mapStateToProps(state) {
  const { auth, direct } = state;
  const page = state.page.sandbox.payments.editor;

  let projectDetails = direct.projectDetails;
  if (_.get(projectDetails, 'project.projectId') !== page.selectedProjectId) {
    projectDetails = null;
  }

  return {
    loadingProjectDetailsForId: direct.loadingProjectDetailsForId,
    loadingProjectsForUsername: direct.loadingProjectsForUsername,
    projectDetails,
    projects: direct.projects,
    selectedProjectId: page.selectedProjectId,
    tokenV3: auth.tokenV3,
    username: _.get(auth, 'user.handle', ''),
  };
}

function mapDispatchToProps(dispatch) {
  const { direct } = actions;
  const page = actions.page.sandbox.payments.editor;
  return {
    loadProjectDetails: (projectId, tokenV3) => {
      dispatch(direct.getProjectDetailsInit(projectId));
      dispatch(direct.getProjectDetailsDone(projectId, tokenV3));
    },
    loadProjects: (tokenV3) => {
      dispatch(direct.getUserProjectsInit(tokenV3));
      dispatch(direct.getUserProjectsDone(tokenV3));
    },
    selectProject: projectId => dispatch(page.selectProject(projectId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer);
