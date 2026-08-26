/**
 * containers.page.challenge-details.submission Container
 * <SubmissionsPageContainer>
 *
 * Description:
 *   Connects the Redux store to the Challenge Submissions display components.
 *   Passes the relevent state and setters as properties to the UI components.
 */
import actions from 'actions/page/submission';
import challengeDetailsActions from 'actions/page/challenge-details';
import { actions as api, errors } from 'topcoder-react-lib';
import { getTrackName, isMM } from 'utils/challenge';
import {
  getActiveSubmissionType,
  getSubmissionLimit,
  getSubmissionLimitReachedMessage,
  isSubmissionLimitType,
} from 'utils/challenge-detail/submission-limit';
import communityActions from 'actions/tc-communities';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import shortId from 'shortid';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import SubmissionsPage from 'components/SubmissionPage';
import AccessDenied, { CAUSE as ACCESS_DENIED_REASON } from 'components/tc-communities/AccessDenied';
import LoadingIndicator from 'components/LoadingIndicator';
import { getChallengeSubmissions } from 'services/submissions';

const { fireErrorMessage } = errors;

/**
 * SubmissionsPage Container
 */
export class SubmissionsPageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.submissionRequestPending = false;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {
      auth,
      getCommunitiesList,
      challengeId,
      loadChallengeDetails,
    } = this.props;

    loadChallengeDetails(auth, challengeId);
    getCommunitiesList(auth);
  }

  componentWillReceiveProps(nextProps) {
    const { isSubmitting } = this.props;
    const { isSubmitting: nextIsSubmitting } = nextProps;

    if (isSubmitting && !nextIsSubmitting) {
      this.submissionRequestPending = false;
    }

    const {
      challenge,
      history,
    } = this.props;

    const { details } = challenge;

    if (details && details.isLegacyChallenge && !history.location.pathname.includes(details.id)) {
      history.push(`/challenges/${details.id}/submit`, history.state);
    }
  }

  /**
   * Verifies the member has an available slot before creating a submission.
   *
   * Unlimited and non-Design challenges submit immediately. Limited Design challenges load the
   * member's complete submission history so direct navigation cannot bypass the entry guards.
   *
   * @param {FormData} body Prepared submission form data.
   * @return {Promise<void>} Resolves after submission starts or the member is shown an error.
   * @throws Does not throw; limit-check failures are reported to the member.
   */
  async handleSubmit(body) {
    if (this.submissionRequestPending) {
      return;
    }

    this.submissionRequestPending = true;

    const {
      tokenV2,
      tokenV3,
      submit,
      challengeId,
      challenge,
      track,
      metadata,
      phases,
      userId,
    } = this.props;

    const submissionLimit = getSubmissionLimit(metadata);
    const submissionType = getActiveSubmissionType(phases);
    const isDesign = getTrackName(track).toLowerCase() === 'design';
    if (isDesign && submissionLimit !== null && isSubmissionLimitType(submissionType)) {
      try {
        const existingSubmissions = await getChallengeSubmissions(
          tokenV3,
          challengeId,
          {
            memberId: userId,
            type: submissionType,
          },
        );

        if (existingSubmissions.data.length >= submissionLimit) {
          this.submissionRequestPending = false;
          fireErrorMessage(
            'Submission Limit Reached',
            getSubmissionLimitReachedMessage(submissionLimit),
          );
          return;
        }
      } catch (error) {
        this.submissionRequestPending = false;
        fireErrorMessage(
          'Unable to Verify Submission Limit',
          'We could not verify your existing submissions. Please try again.',
        );
        return;
      }
    }

    submit(tokenV3, tokenV2, challengeId, body, isMM(challenge) ? 'DEVELOP' : track);
  }

  render() {
    const {
      isRegistered,
      challengeId,
      challengeName,
    } = this.props;

    if (!challengeName) {
      return <LoadingIndicator />;
    }

    if (!isRegistered && challengeName) {
      return (
        <React.Fragment>
          <AccessDenied cause={ACCESS_DENIED_REASON.NOT_AUTHORIZED}>
            <PrimaryButton to={`/challenges/${challengeId}`}>Go to Challenge Details</PrimaryButton>
          </AccessDenied>
        </React.Fragment>
      );
    }

    return (
      <SubmissionsPage
        {...this.props}
        submitForm={this.handleSubmit}
      />
    );
  }
}

/**
 * Default values for Props
 */
SubmissionsPageContainer.defaultProps = {
  challengesUrl: '/challenges',
  uploadProgress: 0,
};

/* Reusable prop validation for Filestack data objects */
const filestackDataProp = PT.shape({
  filename: PT.string.isRequired,
  mimetype: PT.string.isRequired,
  size: PT.number.isRequired,
  key: PT.string.isRequired,
  container: PT.string.isRequired,
});

/**
 * Prop Validation
 */
SubmissionsPageContainer.propTypes = {
  auth: PT.shape().isRequired,
  phases: PT.arrayOf(PT.object).isRequired,
  communitiesList: PT.shape({
    data: PT.arrayOf(PT.object).isRequired,
    loadingUuid: PT.string.isRequired,
    timestamp: PT.number.isRequired,
  }).isRequired,
  getCommunitiesList: PT.func.isRequired,
  /* Older stuff */
  userId: PT.string.isRequired,
  challengesUrl: PT.string,
  tokenV2: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  submit: PT.func.isRequired,
  challengeId: PT.string.isRequired,
  track: PT.string.isRequired,
  challenge: PT.shape().isRequired,
  status: PT.string.isRequired,
  isRegistered: PT.bool.isRequired,
  isMarathonMatch: PT.bool.isRequired,
  groups: PT.arrayOf(PT.shape()).isRequired,
  metadata: PT.arrayOf(PT.shape()).isRequired,
  errorMsg: PT.string.isRequired,
  isSubmitting: PT.bool.isRequired,
  submitDone: PT.bool.isRequired,
  resetForm: PT.func.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  challengeName: PT.string.isRequired,
  uploadProgress: PT.number,
  agreed: PT.bool.isRequired,
  setAgreed: PT.func.isRequired,
  filePickers: PT.arrayOf(PT.shape({
    id: PT.string.isRequired,
    error: PT.string.isRequired,
    fileName: PT.string.isRequired,
    uploadProgress: PT.number,
  }).isRequired).isRequired,
  setFilePickerError: PT.func.isRequired,
  setFilePickerFileName: PT.func.isRequired,
  setFilePickerUploadProgress: PT.func.isRequired,
  setFilePickerDragged: PT.func.isRequired,
  notesLength: PT.number.isRequired,
  updateNotesLength: PT.func.isRequired,
  setSubmissionFilestackData: PT.func.isRequired,
  submissionFilestackData: filestackDataProp.isRequired,
  winners: PT.arrayOf(PT.object).isRequired,
  loadChallengeDetails: PT.func.isRequired,
  history: PT.shape().isRequired,
};

/**
 * Standard redux function, passes redux state into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Object} state Redux state
 * @param {Object} ownProps
 * @return {Object}
 */
const mapStateToProps = (state, ownProps) => {
  const { submission } = state.page;
  const details = state.challenge.details || {};
  return {
    auth: state.auth,
    phases: details.phases || [],
    communitiesList: state.tcCommunities.list,
    /* Older stuff below. */
    userId: state.auth.user ? state.auth.user.userId : '',
    handle: state.auth.user ? state.auth.user.handle : '',
    challengeId: String(ownProps.match.params.challengeId),
    challengeName: details.name,
    challengesUrl: ownProps.challengesUrl,
    tokenV2: state.auth.tokenV2,
    tokenV3: state.auth.tokenV3,
    track: (details && details.track && details.track.name) ? details.track.name : details.track,
    challenge: state.challenge,
    status: details.status,
    isRegistered: details.isRegistered,
    isMarathonMatch: isMM(details),
    groups: details.groups,
    metadata: details.metadata || [],
    isSubmitting: submission.isSubmitting,
    submitDone: submission.submitDone,
    errorMsg: submission.submitErrorMsg,
    uploadProgress: submission.uploadProgress,
    agreed: submission.agreed,
    filePickers: submission.filePickers,
    notesLength: submission.notesLength,
    submissionFilestackData: submission.submissionFilestackData,
    winners: details.winners,
  };
};

/**
 * Standard redux function, passes redux actions into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Function} dispatch Function to dispatch action to reducers
 * @return {Object}
 */
function mapDispatchToProps(dispatch) {
  const a = actions.page.submission;
  const ca = communityActions.tcCommunity;
  const progress = data => dispatch(a.uploadProgress(data));

  return {
    getCommunitiesList: (auth) => {
      const uuid = shortId();
      dispatch(ca.getListInit(uuid));
      dispatch(ca.getListDone(uuid, auth));
    },
    submit: (tokenV3, tokenV2, submissionId, body, track) => {
      dispatch(a.submitInit());
      dispatch(a.submitDone(tokenV3, tokenV2, submissionId, body, track, progress));
    },
    resetForm: () => {
      dispatch(a.submitReset());
    },
    selectChallengeDetailsTab: (tab) => {
      dispatch(challengeDetailsActions.page.challengeDetails.selectTab(
        tab,
      ));
    },
    setAgreed: agreed => dispatch(a.setAgreed(agreed)),
    setFilePickerError: (id, error) => dispatch(a.setFilePickerError(id, error)),
    setFilePickerFileName: (id, fileName) => dispatch(a.setFilePickerFileName(id, fileName)),
    setFilePickerDragged: (id, dragged) => dispatch(a.setFilePickerDragged(id, dragged)),
    setFilePickerUploadProgress: (id, p) => dispatch(a.setFilePickerUploadProgress(id, p)),
    updateNotesLength: length => dispatch(a.updateNotesLength(length)),
    setSubmissionFilestackData: (id, data) => dispatch(a.setSubmissionFilestackData(id, data)),
    loadChallengeDetails: (tokens, challengeId) => {
      const challengeAction = api.challenge;
      dispatch(challengeAction.getDetailsInit(challengeId));
      dispatch(challengeAction.getDetailsDone(challengeId, tokens.tokenV3, tokens.tokenV2));
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubmissionsPageContainer);

export default Container;
