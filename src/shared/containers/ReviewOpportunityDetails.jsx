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

/**
 * SubmissionsPage Container
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

  render() {
    return this.props.details ?
      <ReviewOpportunityDetailsPage {...this.props} /> : <LoadingIndicator />;
  }
}

/**
 * Default values for Props
 */
ReviewOpportunityDetailsContainer.defaultProps = {
  details: null,
  isLoadingDetails: false,
  phasesExpanded: false,
  tokenV3: null,
};

/**
 * Prop Validation
 */
ReviewOpportunityDetailsContainer.propTypes = {
  challengeId: PT.number.isRequired,
  details: PT.shape(),
  handle: PT.string.isRequired,
  isLoadingDetails: PT.bool,
  loadDetails: PT.func.isRequired,
  phasesExpanded: PT.bool,
  selectTab: PT.func.isRequired,
  togglePhasesExpand: PT.func.isRequired,
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
    challengeId: Number(ownProps.match.params.challengeId),
    details: api.details,
    handle: state.auth.user ? state.auth.user.handle : '',
    isLoadingDetails: api.isLoadingDetails,
    phasesExpanded: page.phasesExpanded,
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
  return {
    togglePhasesExpand: () => dispatch(page.togglePhasesExpand()),
    loadDetails: (challengeId, tokenV3) => {
      dispatch(api.getReviewOpportunityDetailsInit());
      dispatch(api.getReviewOpportunityDetailsDone(challengeId, tokenV3));
    },
    selectTab: tab => dispatch(page.selectTab(tab)),
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewOpportunityDetailsContainer);

export default Container;
