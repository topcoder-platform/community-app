/**
 * Payment editor.
 */

import _ from 'lodash';
import actions from 'actions';
import Editor from 'components/sandbox/payments/Editor';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

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
    if (username && username !== loadingProjectsForUsername) {
      loadProjects(tokenV3);
    }
    if (!selectedProjectId && projects.length) {
      selectProject(projects[0].id);
    }
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
  }

  render() {
    const {
      projects,
      selectedProjectId,
      selectProject,
    } = this.props;
    return (
      <Editor
        projects={projects}
        selectedProjectId={selectedProjectId}
        selectProject={selectProject}
      />
    );
  }
}

EditorContainer.propTypes = {
  loadingProjectsForUsername: PT.string.isRequired,
  loadProjects: PT.func.isRequired,
  projects: PT.arrayOf(PT.object).isRequired,
  selectedProjectId: PT.string.isRequired,
  selectProject: PT.func.isRequired,
  tokenV3: PT.string.isRequired,
  username: PT.string.isRequired,
};

function mapStateToProps(state) {
  const { auth, direct } = state;
  const page = state.page.sandbox.payments.editor;
  return {
    loadingProjectsForUsername: direct.loadingProjectsForUsername,
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
    loadProjects: (tokenV3) => {
      dispatch(direct.getUserProjectsInit(tokenV3));
      dispatch(direct.getUserProjectsDone(tokenV3));
    },
    selectProject: projectId => dispatch(page.selectProject(projectId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer);
