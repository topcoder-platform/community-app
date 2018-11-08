/**
 * components.page.challenge-details.FilestackFilePicker
 * <FilePicker> Component
 *
 * Description:
 *   Component for uploading a file using Filestack Picker
 *   and Drag + Drop.  Does not store the file contents in form.  Instead,
 *   uploads file to S3 storage container and sets the
 *   S3 storage details to Redux store for submission.
 */
/* eslint-env browser */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { client as filestack } from 'filestack-react';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import { errors } from 'topcoder-react-lib';

import './styles.scss';

const { fireErrorMessage } = errors;

/**
 * FilestackFilePicker component
 */
class FilestackFilePicker extends React.Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onClickPick = this.onClickPick.bind(this);
    this.onUpdateInputUrl = this.onUpdateInputUrl.bind(this);

    this.state = {
      inputUrl: '',
      invalidUrl: false,
    };
  }

  componentDidMount() {
    const {
      setFileName,
      setError,
      setDragged,
    } = this.props;

    this.filestack = filestack.init(config.FILESTACK.API_KEY);

    setFileName('');
    setError('');
    setDragged(false);
  }

  /* Called when a file is successfully stored in the S3 container */
  onSuccess(file, filePath) {
    const {
      filename,
      mimetype,
      size,
      key,
      container,
      source,
      originalPath,
    } = file;
    const {
      setFileName,
      setFilestackData,
      challengeId,
    } = this.props;
    // container doesn't seem to get echoed from Drag and Drop
    const cont = container || config.FILESTACK.SUBMISSION_CONTAINER;
    // In case of url we need to submit the original url not the S3
    const fileUrl = source === 'url' ? originalPath : `https://s3.amazonaws.com/${cont}/${filePath}`;

    setFileName(filename);

    setFilestackData({
      filename,
      challengeId,
      fileUrl,
      mimetype,
      size,
      key,
      container: cont,
    });
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
      return;
    }
    if (this.isValidUrl(inputUrl)) {
      this.setState({ invalidUrl: false });
      const path = this.generateFilePath();
      const filename = inputUrl.substring(inputUrl.lastIndexOf('/') + 1);
      setDragged(false);
      this.onSuccess({
        source: 'url',
        filename,
        mimetype: '',
        size: 0,
        key: '',
        originalPath: inputUrl,
      }, path);
    } else {
      this.setState({ invalidUrl: true });
    }
  }

  onUpdateInputUrl(e) {
    this.setState({ inputUrl: e.target.value });
  }

  /* eslint-disable class-methods-use-this */
  isValidUrl(url) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url); /* eslint-disable-line no-useless-escape */
  }

  /**
   * Returns the path where the picked up file should be stored.
   * @return {String}
   */
  generateFilePath() {
    const { userId, challengeId } = this.props;
    return `${challengeId}-${userId}-SUBMISSION_ZIP-${Date.now()}.zip`;
  }

  render() {
    const {
      fileName,
      fileExtensions,
      title,
      mandatory,
      error,
      dragged,
      setDragged,
      setFileName,
      setUploadProgress,
      uploadProgress,
      isChallengeBelongToTopgearGroup,
    } = this.props;

    const {
      invalidUrl,
      inputUrl,
    } = this.state;

    return (
      <div styleName="container">
        <div styleName="desc">
          <p>
            {title}
          </p>
          {
            mandatory && (
            <p styleName="mandatory">
*mandatory
            </p>
            )
          }
        </div>
        <div
          styleName={`file-picker ${error ? 'error' : ''} ${dragged ? 'drag' : ''}`}
        >
          {
            !fileName && !isChallengeBelongToTopgearGroup && (
            <p>
Drag and drop your
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
                <input styleName={(invalidUrl ? 'invalid' : '')} id="name" name="name" type="text" placeholder="URL" onChange={this.onUpdateInputUrl} value={inputUrl} required />
              </div>
            )
          }
          <PrimaryButton onClick={this.onClickPick}>
            {isChallengeBelongToTopgearGroup ? 'Set URL' : 'Pick a File'}
          </PrimaryButton>
          {!isChallengeBelongToTopgearGroup && (
            <div
              onClick={() => {
                const path = this.generateFilePath();
                this.filestack.pick({
                  accept: fileExtensions,
                  fromSources: [
                    'local_file_system',
                    'googledrive',
                    'dropbox',
                    'onedrive',
                    'github',
                    'url',
                  ],
                  maxSize: 500 * 1024 * 1024,
                  onFileUploadFailed: () => setDragged(false),
                  onFileUploadFinished: (file) => {
                    setDragged(false);
                    this.onSuccess(file, path);
                  },
                  startUploadingWhenMaxFilesReached: true,
                  storeTo: {
                    container: config.FILESTACK.SUBMISSION_CONTAINER,
                    path,
                    region: config.FILESTACK.REGION,
                  },
                });
              }}
              onKeyPress={() => {
                const path = this.generateFilePath();
                this.filestack.pick({
                  accept: fileExtensions,
                  fromSources: [
                    'local_file_system',
                    'googledrive',
                    'dropbox',
                    'onedrive',
                    'github',
                    'url',
                  ],
                  maxSize: 500 * 1024 * 1024,
                  onFileUploadFailed: () => setDragged(false),
                  onFileUploadFinished: (file) => {
                    setDragged(false);
                    this.onSuccess(file, path);
                  },
                  startUploadingWhenMaxFilesReached: true,
                  storeTo: {
                    container: config.FILESTACK.SUBMISSION_CONTAINER,
                    path,
                    region: config.FILESTACK.REGION,
                  },
                });
              }}
              onDragEnter={() => setDragged(true)}
              onDragLeave={() => setDragged(false)}
              onDragOver={e => e.preventDefault()}
              onDrop={(e) => {
                setDragged(false);
                e.preventDefault();
                const path = this.generateFilePath();
                const filename = e.dataTransfer.files[0].name;
                if (!fileExtensions.some(ext => filename.endsWith(ext))) {
                  return fireErrorMessage('Wrong file type!', '');
                }
                setFileName(e.dataTransfer.files[0].name);
                setUploadProgress(0);
                this.filestack.upload(e.dataTransfer.files[0], {
                  onProgress: ({ totalPercent }) => {
                    setUploadProgress(totalPercent);
                  },
                  progressInterval: 1000,
                }, {
                  container: config.FILESTACK.SUBMISSION_CONTAINER,
                  path,
                  region: config.FILESTACK.REGION,
                }).then(file => this.onSuccess(file, path));
                return undefined;
              }}
              role="button"
              styleName="drop-zone-mask"
              tabIndex={0}
            />)}
        </div>
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

FilestackFilePicker.defaultProps = {
  error: '',
  fileName: '',
  uploadProgress: null,
  isChallengeBelongToTopgearGroup: false,
};

/**
 * Prop Validation
 */
FilestackFilePicker.propTypes = {
  error: PT.string,
  userId: PT.string.isRequired,
  challengeId: PT.number.isRequired,
  fileName: PT.string,
  fileExtensions: PT.arrayOf(PT.string).isRequired,
  title: PT.string.isRequired,
  mandatory: PT.bool.isRequired,
  setError: PT.func.isRequired,
  setFileName: PT.func.isRequired,
  setUploadProgress: PT.func.isRequired,
  dragged: PT.bool.isRequired,
  setDragged: PT.func.isRequired,
  setFilestackData: PT.func.isRequired,
  uploadProgress: PT.number,
  isChallengeBelongToTopgearGroup: PT.bool,
};

export default FilestackFilePicker;
