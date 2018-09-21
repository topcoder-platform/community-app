/**
 * containers.page.challenge-details.submission Container
 * <SubmissionsPageContainer>
 *
 * Description:
 *   Connects the Redux store to the Challenge Submissions display components.
 *   Passes the relevent state and setters as properties to the UI components.
 */
import _ from 'lodash';
import actions from 'actions/page/submission';
import communityActions from 'actions/tc-communities';
import shortId from 'shortid';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import SubmissionsPage from 'components/SubmissionPage';
import AccessDenied, { CAUSE as ACCESS_DENIED_REASON } from 'components/tc-communities/AccessDenied';

/* Holds various time ranges in milliseconds. */
const MIN = 60 * 1000;

/**
 * SubmissionsPage Container
 */
class SubmissionsPageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {
      auth,
      groups,
      communitiesList,
      getCommunitiesList,
    } = this.props;

    // check if challenge belongs to any groups
    // and the communitiesList is not up-to-date
    // then will load the communitiesList
    if (!_.isEmpty(groups) && !communitiesList.loadingUuid
    && (Date.now() - communitiesList.timestamp > 10 * MIN)) {
      getCommunitiesList(auth);
    }
  }

  /* A child component has called their submitForm() prop, prepare the passed
     form data for submission and create a submit action */
  handleSubmit(body) {
    const {
      tokenV2,
      tokenV3,
      submit,
      challengeId,
      track,
    } = this.props;
    submit(tokenV3, tokenV2, challengeId, body, track);
  }

  render() {
    const { registrants, handle } = this.props;
    const isRegistered = registrants.find(r => r.handle === handle);

    if (!isRegistered) return <AccessDenied cause={ACCESS_DENIED_REASON.NOT_AUTHORIZED} />;
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
  currentPhases: PT.arrayOf(PT.object).isRequired,
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
  challengeId: PT.number.isRequired,
  track: PT.string.isRequired,
  status: PT.string.isRequired,
  groups: PT.shape({}).isRequired,
  errorMsg: PT.string.isRequired,
  isSubmitting: PT.bool.isRequired,
  submitDone: PT.bool.isRequired,
  resetForm: PT.func.isRequired,
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
  registrants: PT.arrayOf(PT.object).isRequired,
  winners: PT.arrayOf(PT.object).isRequired,
  handle: PT.string.isRequired,
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
  return {
    auth: state.auth,
    currentPhases: state.challenge.details.currentPhases,
    communitiesList: state.tcCommunities.list,
    /* Older stuff below. */
    userId: state.auth.user.userId,
    challengeId: state.challenge.details.id,
    challengeName: state.challenge.details.name,
    challengesUrl: ownProps.challengesUrl,
    tokenV2: state.auth.tokenV2,
    tokenV3: state.auth.tokenV3,
    track: state.challenge.details.track,
    status: state.challenge.details.status,
    groups: state.challenge.details.groups,
    isSubmitting: submission.isSubmitting,
    submitDone: submission.submitDone,
    errorMsg: submission.submitErrorMsg,
    uploadProgress: submission.uploadProgress,
    agreed: submission.agreed,
    filePickers: submission.filePickers,
    notesLength: submission.notesLength,
    submissionFilestackData: submission.submissionFilestackData,
    registrants: state.challenge.details.registrants,
    winners: state.challenge.details.winners,
    handle: state.auth.user ? state.auth.user.handle : '',
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
    setAgreed: agreed => dispatch(a.setAgreed(agreed)),
    setFilePickerError: (id, error) => dispatch(a.setFilePickerError(id, error)),
    setFilePickerFileName: (id, fileName) => dispatch(a.setFilePickerFileName(id, fileName)),
    setFilePickerDragged: (id, dragged) => dispatch(a.setFilePickerDragged(id, dragged)),
    setFilePickerUploadProgress: (id, p) => dispatch(a.setFilePickerUploadProgress(id, p)),
    updateNotesLength: length => dispatch(a.updateNotesLength(length)),
    setSubmissionFilestackData: (id, data) => dispatch(a.setSubmissionFilestackData(id, data)),
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubmissionsPageContainer);

export default Container;
