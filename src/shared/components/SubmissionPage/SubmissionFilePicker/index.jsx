/**
 * components.page.challenge-details.SubmissionFilePicker
 * <FilePicker> Component
 *
 * Description:
 *   Component for uploading a file using Uppy S3
 *   and Drag + Drop, or accepting a URL for Topgear submissions.
 *   Does not store the file contents in form.  Instead,
 *   uploads file to S3 storage container and sets the
 *   S3 storage details to Redux store for submission.
 */
/* eslint-env browser */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import uploadSubmission from 'services/s3Upload';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';

import style from './styles.scss';


/**
 * SubmissionFilePicker component
 */
class SubmissionFilePicker extends React.Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onClickPick = this.onClickPick.bind(this);
    this.onUpdateInputUrl = this.onUpdateInputUrl.bind(this);

    this.state = {
      uploading: false,
      inputUrl: '',
      invalidUrl: false,
      invalidDomain: false,
    };
  }

  componentDidMount() {
    const {
      setFileName,
      setError,
      setDragged,
    } = this.props;


    setFileName('');
    setError('');
    setDragged(false);
  }

  componentWillUnmount() {
    this.unmounted = true;
    if (this.uploadAbort) this.uploadAbort.abort();
  }

  /* Called when a file is successfully stored in the S3 container */
  onSuccess(file) {
    const {
      filename,
      mimetype,
      size,
      key,
      container,
      source,
      originalPath,
      url,
    } = file;
    const {
      setFileName,
      setUploadData,
      challengeId,
      isChallengeBelongToTopgearGroup,
    } = this.props;
    // container doesn't seem to get echoed from Drag and Drop
    const cont = container || '';
    // In case of url we need to submit the original url not the S3
    const fileUrl = source === 'url' ? originalPath : url;

    setFileName(filename);

    const uploadData = {
      filename,
      challengeId,
      fileUrl,
      mimetype,
      size,
      key,
      container: cont,
    };

    if (isChallengeBelongToTopgearGroup) {
      uploadData.fileType = 'url';
    }

    setUploadData(uploadData);
  }

  onClickPick() {
    const {
      setDragged,
      isChallengeBelongToTopgearGroup,
    } = this.props;
    const {
      inputUrl,
    } = this.state;

    if (!isChallengeBelongToTopgearGroup) {
      if (this.fileInput) this.fileInput.click();
      return;
    }
    const validUrl = this.isValidUrl(inputUrl);
    const validDomain = this.isDomainAllowed(inputUrl);
    if (validUrl && validDomain) {
      this.setState({ invalidUrl: false, invalidDomain: false });
      const filename = inputUrl.substring(inputUrl.lastIndexOf('/') + 1);
      setDragged(false);
      this.onSuccess({
        source: 'url',
        filename,
        mimetype: '',
        size: 0,
        key: '',
        originalPath: inputUrl,
      });
    } else {
      this.setState({ invalidUrl: true, invalidDomain: !validDomain });
    }
  }

  onUpdateInputUrl(e) {
    this.setState({ inputUrl: e.target.value });
  }

  async uploadFile(file) {
    if (!file) return;
    if (this.uploadAbort) this.uploadAbort.abort();
    const uploadAbort = new AbortController();
    this.uploadAbort = uploadAbort;
    const {
      setError, setUploadProgress, setUploadData, setFileName, tokenV3, challengeId,
    } = this.props;
    setError('');
    setUploadData({
      filename: '', mimetype: '', size: 0, key: '', container: '',
    });
    setFileName(file.name);
    setUploadProgress(0);
    this.setState({ uploading: true });
    try {
      const result = await uploadSubmission(file, tokenV3, challengeId, (percent) => {
        if (!this.unmounted && !uploadAbort.signal.aborted) setUploadProgress(percent);
      }, uploadAbort.signal);
      if (!this.unmounted && !uploadAbort.signal.aborted) this.onSuccess(result);
    } catch (error) {
      if (!this.unmounted && error.name !== 'AbortError') {
        setError(error.message || 'File upload failed. Please try again.');
        setFileName('');
        setUploadProgress(null);
      }
    } finally {
      if (!this.unmounted && this.uploadAbort === uploadAbort) this.setState({ uploading: false });
    }
  }

  /* eslint-disable class-methods-use-this */
  isValidUrl(url) {
    if (typeof url !== 'string' || url.length > 4096) return false;
    try {
      const parsed = new URL(url);
      return ['https:', 'http:'].includes(parsed.protocol)
        && !parsed.username && !parsed.password && parsed.hostname.includes('.');
    } catch (error) { return false; }
  }

  isDomainAllowed(url) {
    try {
      const parsed = new URL(url);
      const domains = config.TOPGEAR_ALLOWED_SUBMISSIONS_DOMAINS.split('|');
      return parsed.protocol === 'https:' && !parsed.username && !parsed.password
        && domains.includes(parsed.hostname) && parsed.pathname.length > 1;
    } catch (error) { return false; }
  }

  render() {
    const {
      fileName,
      fileExtensions,
      title,
      error,
      dragged,
      setDragged,
      uploadProgress,
      setError,
      setFileName,
      setUploadProgress,
      isChallengeBelongToTopgearGroup,
    } = this.props;

    const {
      invalidUrl,
      invalidDomain,
      inputUrl,
      uploading,
    } = this.state;

    return (
      <div styleName="container">
        <div styleName="desc">
          <p>
            {title}
          </p>
        </div>
        <div
          styleName={`file-picker ${error ? 'error' : ''} ${dragged ? 'drag' : ''} ${isChallengeBelongToTopgearGroup ? 'topgear' : ''}`}
        >
          {
            !fileName && !isChallengeBelongToTopgearGroup && (
            <p>
              Drag and drop your{' '}
              {fileExtensions.join(' or ')}
              {' '}
              file here.
            </p>
            )
          }
          {
            !fileName && !isChallengeBelongToTopgearGroup && (
            <span>
              or
            </span>
            )
          }
          {
            fileName && (
            <p styleName="file-name">
              {fileName}
            </p>
            )
          }
          {
            _.isNumber(uploadProgress) && uploadProgress < 100 ? (
              <p styleName="file-name">
                Uploading:
                {uploadProgress}
                %
              </p>
            ) : null
          }
          {
            isChallengeBelongToTopgearGroup && (
              <div styleName="url-input-container">
                {invalidUrl && (<div styleName="invalid-url-message">* Invalid URL</div>)}
                {invalidDomain && (
                  <div styleName="invalid-url-message">
                    Ensure that you submit a valid Wipro SharePoint link only.
                    The link should point to the outcome/deliverable of the
                    challenge and should reflect the work done.
                    Please check the challenge submission guidelines.
                  </div>
                )}
                <input styleName={(invalidUrl ? 'invalid' : '')} id="name" name="name" type="text" placeholder="URL" onChange={this.onUpdateInputUrl} value={inputUrl} required />
              </div>
            )
          }
          <PrimaryButton onClick={this.onClickPick} theme={{ button: style.button }}>
            {isChallengeBelongToTopgearGroup ? 'Set URL' : 'SELECT A FILE'}
          </PrimaryButton>
          {!isChallengeBelongToTopgearGroup && (
            <React.Fragment>
              <input
                type="file"
                accept=".zip"
                hidden
                aria-label="Choose ZIP submission"
                ref={(input) => { this.fileInput = input; }}
                onChange={(event) => {
                  const file = event.target.files[0];
                  const input = event.target;
                  input.value = '';
                  this.uploadFile(file);
                }}
              />
              <div
                onClick={() => this.fileInput.click()}
                onKeyPress={() => this.fileInput.click()}
                onDragEnter={() => setDragged(true)}
                onDragLeave={() => setDragged(false)}
                onDragOver={event => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragged(false);
                  if (event.dataTransfer.files.length !== 1) {
                    setError('Choose one ZIP file.');
                    return;
                  }
                  this.uploadFile(event.dataTransfer.files[0]);
                }}
                role="button"
                styleName="drop-zone-mask"
                tabIndex={0}
                aria-label="Select file to upload"
              />
            </React.Fragment>
          )}
        </div>
        {uploading && (
          <button
            type="button"
            onClick={() => {
              if (this.uploadAbort) this.uploadAbort.abort();
              setFileName('');
              setUploadProgress(null);
            }}
          >Cancel upload
          </button>
        )}
        {
          error
          && (
          <div styleName="error-container">
            {error}
          </div>
          )
        }
      </div>
    );
  }
}

SubmissionFilePicker.defaultProps = {
  error: '',
  fileName: '',
  uploadProgress: null,
  isChallengeBelongToTopgearGroup: false,
};

/**
 * Prop Validation
 */
SubmissionFilePicker.propTypes = {
  tokenV3: PT.string.isRequired,
  error: PT.string,
  challengeId: PT.string.isRequired,
  fileName: PT.string,
  fileExtensions: PT.arrayOf(PT.string).isRequired,
  title: PT.string.isRequired,
  setError: PT.func.isRequired,
  setFileName: PT.func.isRequired,
  setUploadProgress: PT.func.isRequired,
  dragged: PT.bool.isRequired,
  setDragged: PT.func.isRequired,
  setUploadData: PT.func.isRequired,
  uploadProgress: PT.number,
  isChallengeBelongToTopgearGroup: PT.bool,
};

export default SubmissionFilePicker;
