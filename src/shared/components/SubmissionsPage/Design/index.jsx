/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import { PrimaryButton } from 'components/buttons';
import FilePicker from '../FilePicker';
import MultiInput from './MultiInput';
import Uploading from '../Uploading';
import './styles.scss';

/**
 * Submissions Page shown to design challengers.
 */
class Design extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agreed: false,
      errorSubmissionFile: true,
      errorSourceFile: true,
      errorPreviewFile: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileCb = this.fileCb.bind(this);
    this.reset = this.reset.bind(this);
    this.retry = this.retry.bind(this);
  }

  reset() {
    this.setState({
      agreed: false,
      errorSubmissionFile: true,
      errorSourceFile: true,
      errorPreviewFile: true,
    });
    this.props.resetForm();
  }

  retry() {
    this.props.submitForm(this.formData);
  }

  fileCb(val, key) {
    const state = {};
    state[key] = val;
    this.setState(state);
  }

  handleSubmit(e) {
    e.preventDefault();
    /**
     * Format the formData in a way mentioned by backend.
     */
    let fs = '';
    let fn = '';
    let fu = '';
    const joinString = (start, end) => {
      if (start) {
        return `${start}||${end}`;
      }
      return `${end}`;
    };

    const fontSource = document.querySelectorAll('[data-type="fontSource"]');
    fontSource.forEach((source) => {
      fs = joinString(fs, source.value);
    });

    const fontNames = document.querySelectorAll('[data-type="fontName"]');
    fontNames.forEach((name) => {
      fn = joinString(fn, name.value);
    });

    const fontUrls = document.querySelectorAll('[data-type="fontUrl"]');
    fontUrls.forEach((url) => {
      fu = joinString(fu, url.value);
    });

    let pd = '';
    let pu = '';
    let pn = '';

    const photoDesc = document.querySelectorAll('[data-type="photoDesc"]');
    photoDesc.forEach((photo) => {
      pd = joinString(pd, photo.value);
    });

    const photoUrl = document.querySelectorAll('[data-type="photoUrl"]');
    photoUrl.forEach((url) => {
      pu = joinString(pu, url.value);
    });

    const photoNumber = document.querySelectorAll('[data-type="photoNumber"]');
    photoNumber.forEach((photo) => {
      pn = joinString(pn, photo.value);
    });

    this.formData = new FormData(document.getElementById('submit-form'));

    if (fs) {
      this.formData.append('fonts', fs);
      this.formData.append('fontNames', fn);
      this.formData.append('fontUrls', fu);
    }

    if (pd) {
      this.formData.append('stockArtNames', pd);
      this.formData.append('stockArtFileNumbers', pn);
      this.formData.append('stockArtUrls', pu);
    }

    if (!this.formData.get('rank')) {
      this.formData.set('rank', 1);
    }
    this.props.submitForm(this.formData);
  }

  render() {
    const {
      isSubmitting,
      submitDone,
      errorMsg,
      challengeId,
      challengeName,
    } = this.props;
    return (!isSubmitting && !submitDone && !errorMsg) ? (
      <div styleName="design-content">
        <form
          method="POST"
          name="submitForm"
          encType="multipart/form-data"
          id="submit-form"
          onSubmit={this.handleSubmit}
        >
          <div styleName="row">
            <div styleName="left">
              <h4>FILES</h4>
              <p>Please follow the instructions on the Challenge Details page
                regarding what your submission, source and preview files should
                contain. <br />Do not name any of your files &quot;declaration.txt&quot;
                as this is added by our system.<br />
                Please be sure to double-check that you have submitted the
                correct files and that your JPG files (if applicable) are in
                RGB color mode.<br /><a href=";javascript">Learn more about formatting
                your submission file.</a>
              </p>
            </div>
            <div styleName="right">
              <div styleName="file-picker-container">
                <FilePicker
                  mandatory
                  title="SUBMISSION"
                  fileExtensions={['.zip']}
                  id="1"
                  cb={val => this.fileCb(val, 'errorSubmissionFile')}
                />
                <FilePicker
                  mandatory
                  title="SOURCE"
                  fileExtensions={['.zip']}
                  id="2"
                  cb={val => this.fileCb(val, 'errorSourceFile')}
                />
                <FilePicker
                  mandatory
                  title="PREVIEW"
                  fileExtensions={['.jpg', '.png']}
                  id="3"
                  cb={val => this.fileCb(val, 'errorPreviewFile')}
                />
              </div>
              <span styleName="desc">
                SUBMISSION#
              </span>
              <input styleName="submission-desc" placeholder="1" name="rank" />
            </div>
          </div>
          <div styleName="row">
            <div styleName="left">
              <h4>NOTES</h4>
              <p>Type a short note about your design here. Explain revisions or
                other design elements that may not be clear.
              </p>
            </div>
            <div styleName="right">
              <div styleName="desc-container">
                <span styleName="desc">
                  COMMENTS
                </span>
                <span>
                  0 / 500
                </span>
              </div>
              <textarea
                styleName="big-input"
                placeholder="Example: My design tries to solve the problem with a particular idea in mind. The use of color is based on the provided brand guideline. The flows are included in the sub folder. I followed all revisions as per the directions provided."
                name="comment"
              />
            </div>
          </div>
          <div styleName="row">
            <div styleName="left">
              <h4>DID YOU USE CUSTOM FONTS?</h4>
              <p>Check to see if your MultiInput is on the Studio Standard MultiInputs list..
                If it is, leave the URL field <a>Read Studio MultiInputs Policy</a>
                <br />If your MultiInput is not on the list, you must provide the URL to the
                MultiInput page (not file) from one of the approved MultiInput websites in the
                dropdown box.
              </p>
            </div>
            <div styleName="right">
              <MultiInput
                buttonName="+ Add Font"
                type="ADDFONT"
              />
            </div>
          </div>
          <div styleName="row">
            <div styleName="left">
              <h4>DID YOU USE STOCK ART?</h4>
              <p>If you used any stock photos in your design mocks, please provide
                the location and details so that the client can obtain them. Follow
                the guidelines at our <a>Studio Stock Art Policy</a>.
              </p>
            </div>
            <div styleName="right">
              <MultiInput
                type="ADDSTOCK"
                buttonName="+ Add Stock"
              />
            </div>
          </div>
          <div styleName="row agree">
            <p>Submitting your files means you hereby agree to the
              <a href=";javascript"> Topcoder terms of use </a>
              and to the extent your uploaded file wins a topcoder Competition,
              you hereby assign, grant and transfer and agree to assign, grant and
              transfer to topcoder all right and challengeName in and to the Winning Submission
              (as further described in the terms of use).
            </p>
            <div styleName="tc-checkbox">
              <input
                type="checkbox"
                id="agree"
                onChange={e => this.setState({ agreed: e.target.checked })}
              />
              <label htmlFor="agree">
                <div styleName="tc-checkbox-label">I UNDERSTAND AND AGREE</div>
              </label>
            </div>
            <PrimaryButton
              disabled={
                !this.state.agreed ||
                this.state.errorPreviewFile ||
                this.state.errorSourceFile ||
                this.state.errorSubmissionFile
              }
            >Submit</PrimaryButton>
          </div>
        </form>
      </div>
    ) :
      <Uploading
        isSubmitting={isSubmitting}
        submitDone={submitDone}
        challengeId={challengeId}
        challengeName={challengeName}
        reset={this.reset}
        error={errorMsg}
        retry={this.retry}
      />;
  }
}

Design.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  submitDone: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  challengeId: PropTypes.number.isRequired,
  challengeName: PropTypes.string.isRequired,
  submitForm: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
};

export default Design;
