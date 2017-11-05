/**
 * containers.page.challenge-details.submission Container
 * <SubmissionsPageContainer>
 *
 * Description:
 *   Connects the Redux store to the Challenge Submissions display components.
 *   Passes the relevent state and setters as properties to the UI components.
 */
import actions from 'actions/page/challenge-details/submission';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import SubmissionsPage from 'components/SubmissionPage';

/**
 * SubmissionsPage Container
 */
class SubmissionsPageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  userId: PT.string.isRequired,
  challengesUrl: PT.string,
  phaseId: PT.number.isRequired,
  phaseType: PT.string.isRequired,
  tokenV2: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  submit: PT.func.isRequired,
  challengeId: PT.number.isRequired,
  track: PT.string.isRequired,
  status: PT.string.isRequired,
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
  multiInputs: PT.arrayOf(PT.shape({
    id: PT.string.isRequired,
    inputs: PT.arrayOf(PT.shape({
      urlValid: PT.bool,
      nameValid: PT.bool,
      sourceValid: PT.bool.isRequired,
      active: PT.bool.isRequired,
    }).isRequired).isRequired,
  }).isRequired).isRequired,
  removeMultiInput: PT.func.isRequired,
  setMultiInputUrlValid: PT.func.isRequired,
  setMultiInputNameValid: PT.func.isRequired,
  setMultiInputSourceValid: PT.func.isRequired,
  setMultiInputActive: PT.func.isRequired,
  setSubmissionFilestackData: PT.func.isRequired,
  setSourceFilestackData: PT.func.isRequired,
  setPreviewFilestackData: PT.func.isRequired,
  submissionFilestackData: filestackDataProp.isRequired,
  sourceFilestackData: filestackDataProp.isRequired,
  previewFilestackData: filestackDataProp.isRequired,
};

/**
 * Standard redux function, passes redux state into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Object} state Redux state
 * @param {Object} ownProps
 * @return {Object}
 */
const mapStateToProps = (state, ownProps) => {
  const detailsV2 = state.challenge.detailsV2;
  const submission = state.page.challengeDetails.submission;
  // The current phase will be the last element of this array
  const phase = state.challenge.details.currentPhases.slice(-1)[0];

  return {
    userId: state.auth.user.userId,
    challengeId: detailsV2 && detailsV2.challengeId,
    challengeName: detailsV2 && detailsV2.challengeName,
    challengesUrl: ownProps.challengesUrl,
    phaseId: phase && phase.id,
    phaseType: phase && phase.phaseType,
    tokenV2: state.auth.tokenV2,
    tokenV3: state.auth.tokenV3,
    track: state.challenge.details.track,
    status: state.challenge.details.status,
    isSubmitting: submission.isSubmitting,
    submitDone: submission.submitDone,
    errorMsg: submission.submitErrorMsg,
    uploadProgress: submission.uploadProgress,
    agreed: submission.agreed,
    filePickers: submission.filePickers,
    notesLength: submission.notesLength,
    multiInputs: submission.multiInputs,
    submissionFilestackData: submission.submissionFilestackData,
    sourceFilestackData: submission.sourceFilestackData,
    previewFilestackData: submission.previewFilestackData,
  };
};

/**
 * Standard redux function, passes redux actions into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Function} dispatch Function to dispatch action to reducers
 * @return {Object}
 */
function mapDispatchToProps(dispatch) {
  const a = actions.page.challengeDetails.submission;
  const progress = data => dispatch(a.uploadProgress(data));

  return {
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
    setFilePickerUploadProgress: (id, p) =>
      dispatch(a.setFilePickerUploadProgress(id, p)),
    updateNotesLength: length => dispatch(a.updateNotesLength(length)),
    removeMultiInput: (id, index) => dispatch(a.removeMultiInput(id, index)),
    setMultiInputUrlValid: (id, index, valid) =>
      dispatch(a.setMultiInputUrlValid(id, index, valid)),
    setMultiInputNameValid: (id, index, valid) =>
      dispatch(a.setMultiInputNameValid(id, index, valid)),
    setMultiInputSourceValid: (id, index, valid) =>
      dispatch(a.setMultiInputSourceValid(id, index, valid)),
    setMultiInputActive: (id, index, active) =>
      dispatch(a.setMultiInputActive(id, index, active)),
    setSubmissionFilestackData: (id, data) => dispatch(a.setSubmissionFilestackData(id, data)),
    setSourceFilestackData: (id, data) => dispatch(a.setSourceFilestackData(id, data)),
    setPreviewFilestackData: (id, data) => dispatch(a.setPreviewFilestackData(id, data)),
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubmissionsPageContainer);

export default Container;
