/**
 * containers.page.challenge-details.submission Container
 * <SubmissionsPageContainer>
 *
 * Description:
 *   Connects the Redux store to the Challenge Submissions display components.
 *   Passes the relevent state and setters as properties to the UI components.
 */
import actions from 'actions/page/submission';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import SubmissionsPage from 'components/SubmissionPage';
import AccessDenied, { CAUSE as ACCESS_DENIED_REASON } from 'components/tc-communities/AccessDenied';

/**
 * SubmissionsPage Container
 */
class SubmissionsPageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { resetDesignStoreSegment } = this.props;
    resetDesignStoreSegment();
  }

  /* A child component has called their submitForm() prop, prepare the passed
     form data for submission and create a submit action */
  handleSubmit(body) {
    const {
      tokenV2,
      tokenV3,
      submit,
      challengeId,
      subTrack,
      track,
    } = this.props;

    submit(tokenV3, tokenV2, challengeId, body, subTrack === 'MARATHON_MATCH' ? 'DEVELOP' : track);
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
  challenge: PT.shape().isRequired,
  currentPhases: PT.arrayOf(PT.object).isRequired,
  stockArtRecords: PT.arrayOf(PT.object).isRequired,
  setStockArtRecord: PT.func.isRequired,
  customFontRecords: PT.arrayOf(PT.object).isRequired,
  setCustomFontRecord: PT.func.isRequired,

  /* Older stuff */
  userId: PT.string.isRequired,
  challengesUrl: PT.string,
  tokenV2: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  submit: PT.func.isRequired,
  challengeId: PT.number.isRequired,
  track: PT.string.isRequired,
  subTrack: PT.string.isRequired,
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
  resetDesignStoreSegment: PT.func.isRequired,
  setSubmissionFilestackData: PT.func.isRequired,
  setSourceFilestackData: PT.func.isRequired,
  setPreviewFilestackData: PT.func.isRequired,
  submissionFilestackData: filestackDataProp.isRequired,
  sourceFilestackData: filestackDataProp.isRequired,
  previewFilestackData: filestackDataProp.isRequired,
  registrants: PT.arrayOf(PT.object).isRequired,
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
    challenge: state.challenge.details,
    currentPhases: state.challenge.details.currentPhases,
    stockArtRecords: submission.design.stockArtRecords,
    customFontRecords: submission.design.customFontRecords,

    /* Older stuff below. */
    userId: state.auth.user.userId,
    challengeId: state.challenge.details.id,
    challengeName: state.challenge.details.name,
    challengesUrl: ownProps.challengesUrl,
    tokenV2: state.auth.tokenV2,
    tokenV3: state.auth.tokenV3,
    track: state.challenge.details.track,
    subTrack: state.challenge.details.subTrack,
    status: state.challenge.details.status,
    isSubmitting: submission.isSubmitting,
    submitDone: submission.submitDone,
    errorMsg: submission.submitErrorMsg,
    uploadProgress: submission.uploadProgress,
    agreed: submission.agreed,
    filePickers: submission.filePickers,
    notesLength: submission.notesLength,
    submissionFilestackData: submission.submissionFilestackData,
    sourceFilestackData: submission.sourceFilestackData,
    previewFilestackData: submission.previewFilestackData,
    registrants: state.challenge.details.registrants,
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
    setFilePickerUploadProgress: (id, p) => dispatch(a.setFilePickerUploadProgress(id, p)),
    updateNotesLength: length => dispatch(a.updateNotesLength(length)),
    resetDesignStoreSegment: () => dispatch(a.design.reset()),
    setStockArtRecord: (index, record) => dispatch(a.design.setStockArtRecord(index, record)),
    setCustomFontRecord: (index, record) => dispatch(a.design.setCustomFontRecord(index, record)),
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
