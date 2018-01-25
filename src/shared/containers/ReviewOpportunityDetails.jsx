/**
 * Description:
 *   Connects the Redux store to the Review Opportunites display components.
 *   Passes the relevent state and setters as properties to the UI components.
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import apiActions from 'actions/reviewOpportunity';
import LoadingIndicator from 'components/LoadingIndicator';
import pageActions from 'actions/page/review-opportunity-details';
import ReviewOpportunityDetailsPage from 'components/ReviewOpportunityDetailsPage';
import termsActions from 'actions/terms';

/**
 * ReviewOpportunityDetails Container
 */
class ReviewOpportunityDetailsContainer extends React.Component {
  componentDidMount() {
    const {
      challengeId,
      details,
      isLoadingDetails,
      loadDetails,
      tokenV3,
    } = this.props;
    if (!isLoadingDetails && !details) {
      loadDetails(challengeId, tokenV3);
    }
  }

  handleOnHeaderApply() {
    this.props.openTermsModal();
  }

  handleOnModalApply() {
    this.props.openTermsModal();
  }

  render() {
    if (this.props.authError) {
      return <div>You are not authorized to access this page.</div>;
    }

    return this.props.details ?
      <ReviewOpportunityDetailsPage
        onHeaderApply={() => this.handleOnHeaderApply()}
        onModalApply={() => this.handleOnModalApply()}
        {...this.props}
      /> : <LoadingIndicator />;
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
  phasesExpanded: false,
  tokenV3: null,
};

/**
 * Prop Validation
 */
ReviewOpportunityDetailsContainer.propTypes = {
  applyModalOpened: PT.bool,
  authError: PT.bool,
  challengeId: PT.number.isRequired,
  details: PT.shape(),
  handle: PT.string.isRequired,
  isLoadingDetails: PT.bool,
  loadDetails: PT.func.isRequired,
  openTermsModal: PT.func.isRequired,
  phasesExpanded: PT.bool,
  selectedRoles: PT.arrayOf(PT.number),
  selectTab: PT.func.isRequired,
  setRoles: PT.func.isRequired,
  toggleApplyModal: PT.func.isRequired,
  toggleRole: PT.func.isRequired,
  onPhaseExpand: PT.func.isRequired,
  tokenV3: PT.string,
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
  return {
    authError: api.authError,
    applyModalOpened: page.applyModalOpened,
    challengeId: Number(ownProps.match.params.challengeId),
    details: api.details,
    handle: state.auth.user ? state.auth.user.handle : '',
    isLoadingDetails: api.isLoadingDetails,
    phasesExpanded: page.phasesExpanded,
    selectedRoles: page.selectedRoles,
    selectedTab: page.selectedTab,
    tokenV3: state.auth.tokenV3,
  };
};

/**
 * Standard redux function, passes redux actions into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Function} dispatch Function to dispatch action to reducers
 * @return {Object}
 */
function mapDispatchToProps(dispatch) {
  const api = apiActions.reviewOpportunity;
  const page = pageActions.page.reviewOpportunityDetails;
  const terms = termsActions.terms;
  return {
    loadDetails: (challengeId, tokenV3) => {
      dispatch(api.getReviewOpportunityDetailsInit());
      dispatch(api.getReviewOpportunityDetailsDone(challengeId, tokenV3));
    },
    onPhaseExpand: () => dispatch(page.togglePhasesExpand()),
    openTermsModal: () => {
      dispatch(terms.openTermsModal());
    },
    selectTab: tab => dispatch(page.selectTab(tab)),
    setRoles: roles => dispatch(page.setRoles(roles)),
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
