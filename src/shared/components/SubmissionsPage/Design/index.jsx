/* global document, FormData */

import config from 'utils/config';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'components/buttons';

import FilePicker from '../FilePicker';
import MultiInput from './MultiInput';
import Uploading from '../Uploading';
import './styles.scss';

/* The maximum number of symbols allowed in the Notes textarea. */
const MAX_NOTES_LENGTH = 500;

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
      notesLength: 0,
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
      challengeId,
      challengeName,
      challengesUrl,
      isSubmitting,
      submitDone,
      errorMsg,
      track,
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
              <p>
                Please follow the instructions on the Challenge Details page
                regarding what your submission, source and preview files should
                contain.
              </p>
              <p>
                Do not name any of your files &quot;declaration.txt&quot;
                as this is added by our system.
              </p>
              <p>
                Please be sure to double-check that you have submitted the
                correct files and that your JPG files (if applicable) are in
                RGB color mode.
              </p>
              <p>
                <a
                  href={config.URL.INFO.DESIGN_CHALLENGE_SUBMISSION}
                  rel="noreferrer noopener"
                  target="_blank"
                >Learn more about formatting your submission file.</a>
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
                  { this.state.notesLength } / { MAX_NOTES_LENGTH }
                </span>
              </div>
              <textarea
                onChange={(event) => {
                  const target = event.target;
                  if (target.value.length > MAX_NOTES_LENGTH) {
                    target.value = target.value.slice(0, MAX_NOTES_LENGTH);
                  }
                  this.setState({ notesLength: target.value.length });
                }}
                styleName="big-input"
                placeholder="Example: My design tries to solve the problem with a particular idea in mind. The use of color is based on the provided brand guideline. The flows are included in the sub folder. I followed all revisions as per the directions provided."
                name="comment"
              />
            </div>
          </div>
          <div styleName="row">
            <div styleName="left">
              <h4>DID YOU USE CUSTOM FONTS?</h4>
              <p>
                Check to see if your font is on the Studio Standard Fonts list.
                If it is, leave the URL field
              </p>
              <p>
                Read the
                &zwnj;<a
                  href={config.URL.INFO.STUDIO_FONTS_POLICY}
                  rel="norefferer noopener"
                  target="_blank"
                >Studio Fonts Policy</a>
              </p>
              <p>
                If your fonts is not on the list, you must provide the URL
                to the font page (not file) from one of the approved
                font websites in the dropdown box.
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
              <p>
                If you used any stock photos in your design mocks, please
                provide the location and details so that the client can obtain
                them. Follow the guidelines at our
                &zwnj;<a
                  href={config.URL.INFO.STOCK_ART_POLICY}
                  rel="norefferer noopener"
                  target="_blank"
                >Studio Stock Art Policy</a>.
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
            <p>
              Submitting your files means you hereby agree to the
              &zwnj;<a
                href={config.URL.INFO.TOPCODER_TERMS}
                rel="norefferer noopener"
                target="_blank"
              >Topcoder terms of use</a>&zwnj;
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
        challengeId={challengeId}
        challengeName={challengeName}
        challengesUrl={challengesUrl}
        isSubmitting={isSubmitting}
        submitDone={submitDone}
        reset={this.reset}
        track={track}
        error={errorMsg}
        retry={this.retry}
      />;
  }
}

Design.propTypes = {
  challengeId: PT.number.isRequired,
  challengeName: PT.string.isRequired,
  challengesUrl: PT.string.isRequired,
  isSubmitting: PT.bool.isRequired,
  submitDone: PT.bool.isRequired,
  errorMsg: PT.string.isRequired,
  submitForm: PT.func.isRequired,
  resetForm: PT.func.isRequired,
  track: PT.string.isRequired,
};

export default Design;
