/**
 * Payment editor.
 */
/* NOTE: Many props in this module are consumed indirectly via helper functions,
 * ESLint is not able to track them, hence the rule is disabled for now. */
/* eslint-disable react/no-unused-prop-types */

import _ from 'lodash';
import actions from 'actions';
import Confirmation from 'components/sandbox/payments/Confirmation';
import Editor from 'components/sandbox/payments/Editor';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { STATE as PAGE_STATE } from 'actions/page/sandbox/payments/editor';
import { connect } from 'react-redux';
import { getService as getChallengeService } from 'services/challenges';
import { goToLogin } from 'utils/tc';

/**
 * If given props have loaded project details with some billing accounts, this
 * function ensures that at least some (first) billing account is selected.
 * @param {Object} props
 */
function selectFirstBillingAccountIfNecessary({
  projectDetails,
  selectBillingAccount,
  selectedBillingAccountId,
}) {
  const accounts = (projectDetails && projectDetails.billingAccountIds) || [];
  if (
    accounts.length
    && (
      !selectedBillingAccountId
      || !accounts.some(id => id === selectedBillingAccountId)
    )
  ) selectBillingAccount(accounts[0]);
}

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
    selectFirstBillingAccountIfNecessary(this.props);
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
    selectFirstBillingAccountIfNecessary(nextProps);
    return undefined;
  }

  /**
   * Handles the payment.
   */
  async pay() {
    const {
      paymentAmount,
      paymentAssignee,
      paymentDescription,
      paymentTitle,
      setPageState,
      selectedBillingAccountId,
      selectedProjectId,
      tokenV3,
    } = this.props;
    setPageState(PAGE_STATE.WAITING);
    const service = getChallengeService(tokenV3);
    const challenge = await service.createTask(
      selectedProjectId,
      selectedBillingAccountId,
      paymentTitle,
      paymentDescription,
      paymentAssignee,
      paymentAmount,
    );
    await service.activate(challenge.id);
    setPageState(PAGE_STATE.PAID);
  }

  render() {
    const {
      pageState,
      paymentAmount,
      paymentAssignee,
      paymentDescription,
      paymentTitle,
      projectDetails,
      projects,
      selectedBillingAccountId,
      selectedProjectId,
      selectProject,
      setPaymentAmount,
      setPaymentAssignee,
      setPaymentDescription,
      setPaymentTitle,
      tokenV3,
    } = this.props;
    if (!tokenV3 || !projects.length
    || pageState === PAGE_STATE.WAITING) return <LoadingIndicator />;
    if (pageState === PAGE_STATE.PAID) {
      return (
        <Confirmation
          amount={paymentAmount}
          assignee={paymentAssignee}
        />
      );
    }
    return (
      <Editor
        makePayment={() => this.pay()}
        paymentAmount={paymentAmount}
        paymentAssignee={paymentAssignee}
        paymentDescription={paymentDescription}
        paymentTitle={paymentTitle}
        projectDetails={projectDetails}
        projects={projects}
        selectedBillingAccountId={selectedBillingAccountId}
        selectedProjectId={selectedProjectId}
        selectProject={selectProject}
        setPaymentAmount={setPaymentAmount}
        setPaymentAssignee={setPaymentAssignee}
        setPaymentDescription={setPaymentDescription}
        setPaymentTitle={setPaymentTitle}
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
  pageState: PT.oneOf(_.values(PAGE_STATE)).isRequired,
  paymentAmount: PT.number.isRequired,
  paymentAssignee: PT.string.isRequired,
  paymentDescription: PT.string.isRequired,
  paymentTitle: PT.string.isRequired,
  projectDetails: PT.shape({
    billingAccountIds: PT.arrayOf(PT.number).isRequired,
  }),
  projects: PT.arrayOf(PT.object).isRequired,
  selectedBillingAccountId: PT.number.isRequired,
  selectedProjectId: PT.number.isRequired,
  selectBillingAccount: PT.func.isRequired,
  selectProject: PT.func.isRequired,
  setPageState: PT.func.isRequired,
  setPaymentAmount: PT.func.isRequired,
  setPaymentAssignee: PT.func.isRequired,
  setPaymentDescription: PT.func.isRequired,
  setPaymentTitle: PT.func.isRequired,
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
    pageState: page.pageState,
    paymentAmount: page.paymentAmount,
    paymentAssignee: page.paymentAssignee,
    paymentDescription: page.paymentDescription,
    paymentTitle: page.paymentTitle,
    projectDetails,
    projects: direct.projects,
    selectedBillingAccountId: page.selectedBillingAccountId,
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
    selectBillingAccount: accountId =>
      dispatch(page.selectBillingAccount(accountId)),
    selectProject: projectId => dispatch(page.selectProject(projectId)),
    setPageState: state => dispatch(page.setPageState(state)),
    setPaymentAmount: arg => dispatch(page.setPaymentAmount(arg)),
    setPaymentAssignee: arg => dispatch(page.setPaymentAssignee(arg)),
    setPaymentDescription: arg => dispatch(page.setPaymentDescription(arg)),
    setPaymentTitle: title => dispatch(page.setPaymentTitle(title)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer);
