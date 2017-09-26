/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import { PrimaryButton } from 'components/buttons';
import FilePicker from '../FilePicker';
import Uploading from '../Uploading';
import './styles.scss';

/**
 * Submissions Page shown to develop challengers.
 */
class Develop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agreed: false,
      errorFile: true,
    };
    this.fileCb = this.fileCb.bind(this);
    this.reset = this.reset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retry = this.retry.bind(this);
  }

  fileCb(val) {
    this.setState({
      errorFile: val,
    });
  }

  reset() {
    this.setState({
      agreed: false,
      errorFile: true,
    });
    this.props.resetForm();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.formData = new FormData(document.getElementById('submit-form'));
    this.props.submitForm(this.formData);
  }

  retry() {
    this.props.submitForm(this.formData);
  }

  render() {
    const {
      isSubmitting,
      submitDone,
      challengeId,
      challengeName,
      errorMsg,
    } = this.props;

    return (
      (!isSubmitting && !submitDone && !errorMsg) ? (
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
                <p>Please follow the instructions on the Challenge Details page regarding
                  what your submission should contain and how it should be organized.
                </p>
              </div>
              <div styleName="right">
                <div styleName="file-picker-container">
                  <FilePicker
                    mandatory
                    title="SUBMISSION"
                    fileExtensions={['.zip']}
                    cb={this.fileCb}
                  />
                </div>
                <p>If you have trouble uploading your file, please submit
                  <a href=";javascript"> here</a>
                </p>
              </div>
            </div>
            <div styleName="row agree">
              <p>Submitting your files means you hereby agree to the
                <a href=";javascript"> Topcoder terms of use </a>
                and to the extent your uploaded file wins a topcoder Competition,
                you hereby assign, grant and transfer and agree to assign, grant and
                transfer to topcoder all right and title in and to the Winning Submission
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
                type="submit"
                disabled={!this.state.agreed || this.state.errorFile}
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
        />
    );
  }
}

Develop.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  submitDone: PropTypes.bool.isRequired,
  challengeId: PropTypes.number.isRequired,
  challengeName: PropTypes.string.isRequired,
  errorMsg: PropTypes.string.isRequired,
  submitForm: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
};

export default Develop;
