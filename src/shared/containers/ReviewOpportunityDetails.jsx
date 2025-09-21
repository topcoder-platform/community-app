/**
 * Description:
 *   Connects the Redux store to the Review Opportunites display components.
 *   Passes the relevent state and setters as properties to the UI components.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import { errors } from 'topcoder-react-lib';
import LoadingIndicator from 'components/LoadingIndicator';
import { activeRoleIds } from 'utils/reviewOpportunities';
import pageActions from 'actions/page/review-opportunity-details';
import ReviewOpportunityDetailsPage from 'components/ReviewOpportunityDetailsPage';
import FailedToLoad from 'components/ReviewOpportunityDetailsPage/FailedToLoad';
import termsActions from 'actions/terms';
import { goToLogin } from 'utils/tc';

const { fireErrorMessage } = errors;

/**
 * ReviewOpportunityDetails Container
 */
class ReviewOpportunityDetailsContainer extends React.Component {
  componentDidMount() {
    const {
      challengeId,
      opportunityId,
      details,
      isLoadingDetails,
      loadDetails,
      tokenV3,
    } = this.props;

    if (!isLoadingDetails && !details) {
      loadDetails(challengeId, opportunityId, tokenV3);
    } else if (details.challenge.id !== challengeId) {
      loadDetails(challengeId, opportunityId, tokenV3);
    }
  }

  handleOnHeaderApply() {
    const {
      isLoggedIn,
      isReviewer,
      openTermsModal,
      terms,
      termsFailure,
      toggleApplyModal,
    } = this.props;

    if (!isLoggedIn) {
      goToLogin('community-app-main');
      return;
    }

    if (!isReviewer) {
      fireErrorMessage(
        'Permission Required',
        <span>
          You must have a reviewer role to apply for this review opportunity.
        </span>,
      );
      return;
    }

    if (termsFailure) {
      fireErrorMessage('Error Getting Terms Details', '');
      return;
    }
    if (terms.find(term => !term.agreed)) {
      openTermsModal();
    } else {
      toggleApplyModal();
    }
  }

  handleOnModalApply() {
    const {
      cancelApplications,
      challengeId,
      details,
      handle,
      loadDetails,
      selectedRoles,
      submitApplications,
      toggleApplyModal,
      tokenV3,
    } = this.props;

    const rolesToApply = [];
    const rolesToCancel = [];

    const previousRoles = activeRoleIds(details, handle);

    previousRoles.forEach((id) => {
      if (!_.includes(selectedRoles, id)) {
        rolesToCancel.push(id);
      }
    });

    selectedRoles.forEach((id) => {
      if (!_.includes(previousRoles, id)) {
        rolesToApply.push(id);
      }
    });

    if (rolesToApply.length) {
      submitApplications(challengeId, rolesToApply, tokenV3);
    }
    if (rolesToCancel.length) {
      cancelApplications(challengeId, rolesToCancel, tokenV3);
    }

    toggleApplyModal();
    loadDetails(challengeId, tokenV3);
  }

  render() {
    const {
      authError,
      details,
    } = this.props;
    if (authError) {
      return <FailedToLoad />;
    }

    return details
      ? (
        <ReviewOpportunityDetailsPage
          onHeaderApply={() => this.handleOnHeaderApply()}
          onModalApply={() => this.handleOnModalApply()}
          {...this.props}
        />
      ) : <LoadingIndicator />;
  }
}

/**
 * Default values for Props
 */
ReviewOpportunityDetailsContainer.defaultProps = {
  applyModalOpened: false,
  authError: false,
  details: null,
  isLoadingDetails: false,
  selectedRoles: [],
  terms: [],
  termsFailure: false,
  phasesExpanded: false,
  tokenV3: null,
  isLoggedIn: false,
  isReviewer: false,
};

/**
 * Prop Validation
 */
ReviewOpportunityDetailsContainer.propTypes = {
  applyModalOpened: PT.bool,
  authError: PT.bool,
  cancelApplications: PT.func.isRequired,
  challengeId: PT.string.isRequired,
  opportunityId: PT.string.isRequired,
  details: PT.shape(),
  handle: PT.string.isRequired,
  isLoadingDetails: PT.bool,
  loadDetails: PT.func.isRequired,
  openTermsModal: PT.func.isRequired,
  phasesExpanded: PT.bool,
  selectedRoles: PT.arrayOf(PT.number),
  selectTab: PT.func.isRequired,
  setRoles: PT.func.isRequired,
  submitApplications: PT.func.isRequired,
  requiredTerms: PT.arrayOf(PT.shape()).isRequired,
  terms: PT.arrayOf(PT.shape()),
  termsFailure: PT.bool,
  toggleApplyModal: PT.func.isRequired,
  toggleRole: PT.func.isRequired,
  onPhaseExpand: PT.func.isRequired,
  tokenV3: PT.string,
  isLoggedIn: PT.bool,
  isReviewer: PT.bool,
};

/**
 * Standard redux function, passes redux state into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Object} state Redux state
 * @param {Object} ownProps
 * @return {Object}
 */
const mapStateToProps = (state, ownProps) => {
  const api = state.reviewOpportunity;
  const page = state.page.reviewOpportunityDetails;
  const queryParams = new URLSearchParams(ownProps.location.search);
  const { terms } = state;
  return {
    authError: api.authError,
    applyModalOpened: page.applyModalOpened,
    challengeId: String(ownProps.match.params.challengeId),
    opportunityId: queryParams.get('opportunityId'),
    details: page.details,
    handle: state.auth.user ? state.auth.user.handle : '',
    isLoadingDetails: api.isLoadingDetails,
    phasesExpanded: page.phasesExpanded,
    requiredTerms: api.requiredTerms,
    selectedRoles: page.selectedRoles,
    selectedTab: page.selectedTab,
    terms: terms.terms,
    termsFailure: terms.getTermsFailure,
    tokenV3: state.auth.tokenV3,
    isLoggedIn: Boolean(state.auth.user),
    isReviewer: _.includes(state.auth.user.roles || [], 'reviewer'),
  };
};

/**
 * Standard redux function, passes redux actions into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Function} dispatch Function to dispatch action to reducers
 * @return {Object}
 */
function mapDispatchToProps(dispatch) {
  const api = pageActions.page.reviewOpportunityDetails;
  const page = pageActions.page.reviewOpportunityDetails;
  return {
    cancelApplications: (challengeId, roleIds, tokenV3) => {
      dispatch(api.cancelApplicationsInit());
      dispatch(api.cancelApplicationsDone(challengeId, roleIds, tokenV3));
    },
    loadDetails: (challengeId, opportunityId, tokenV3) => {
      dispatch(api.getDetailsInit());
      dispatch(api.getDetailsDone(challengeId, opportunityId, tokenV3));
    },
    onPhaseExpand: () => dispatch(page.togglePhasesExpand()),
    openTermsModal: () => {
      dispatch(termsActions.terms.openTermsModal('ANY'));
    },
    selectTab: tab => dispatch(page.selectTab(tab)),
    setRoles: roles => dispatch(page.setRoles(roles)),
    submitApplications: (challengeId, roleIds, tokenV3) => {
      dispatch(api.submitApplicationsInit());
      dispatch(api.submitApplicationsDone(challengeId, roleIds, tokenV3));
    },
    toggleApplyModal: () => {
      dispatch(page.toggleApplyModal());
    },
    toggleRole: roleId => dispatch(page.toggleRole(roleId)),
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewOpportunityDetailsContainer);

export default Container;
