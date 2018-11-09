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
  onSuccess(file) {
    const {
      filename,
      mimetype,
      size,
      key,
      container,
    } = file;
    const {
      setFileName,
      setFilestackData,
    } = this.props;

    setFileName(filename);

    setFilestackData({
      filename,
      mimetype,
      size,
      key,
      // container doesn't seem to get echoed from Drag and Drop
      container: container || config.FILESTACK.SUBMISSION_CONTAINER,
    });
  }

  /**
   * Returns the path where the picked up file should be stored.
   * @return {String}
   */
  getPath() {
    const { title, userId } = this.props;
    switch (title) {
      case 'PREVIEW': return 'DESIGN_COVER/';
      case 'SUBMISSION':
        return `SUBMISSION_ZIP/${userId}-SUBMISSION_ZIP-${Date.now()}.zip`;
      case 'SOURCE':
        return `SOURCE_ZIP/${userId}-SOURCE_ZIP-${Date.now()}.zip`;
      default: throw new Error('Unknown file type');
    }
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
    } = this.props;

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
            !fileName && (
            <p>
Drag and drop your
              {fileExtensions.join(' or ')}
              {' '}
file here.
            </p>
            )
          }
          {
            !fileName && (
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
          <PrimaryButton onClick={this.onClickPick}>
Pick a File
          </PrimaryButton>
          <div
            onClick={() => this.filestack.pick({
              accept: fileExtensions,
              fromSources: [
                'local_file_system',
                'googledrive',
                'box',
                'dropbox',
                'onedrive',
              ],
              maxSize: 500 * 1024 * 1024,
              onFileUploadFailed: () => setDragged(false),
              onFileUploadFinished: (file) => {
                setDragged(false);
                this.onSuccess(file);
              },
              startUploadingWhenMaxFilesReached: true,
              storeTo: {
                container: config.FILESTACK.SUBMISSION_CONTAINER,
                path: this.getPath(),
                region: config.FILESTACK.REGION,
              },
            })}
            onKeyPress={() => this.filestack.pick({
              accept: fileExtensions,
              fromSources: [
                'local_file_system',
                'googledrive',
                'box',
                'dropbox',
                'onedrive',
              ],
              maxSize: 500 * 1024 * 1024,
              onFileUploadFailed: () => setDragged(false),
              onFileUploadFinished: (file) => {
                setDragged(false);
                this.onSuccess(file);
              },
              startUploadingWhenMaxFilesReached: true,
              storeTo: {
                container: config.FILESTACK.SUBMISSION_CONTAINER,
                path: this.getPath(),
                region: config.FILESTACK.REGION,
              },
            })}
            onDragEnter={() => setDragged(true)}
            onDragLeave={() => setDragged(false)}
            onDragOver={e => e.preventDefault()}
            onDrop={(e) => {
              setDragged(false);
              e.preventDefault();
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
                path: this.getPath(),
                region: config.FILESTACK.REGION,
              }).then(file => this.onSuccess(file));
              return undefined;
            }}
            role="button"
            styleName="drop-zone-mask"
            tabIndex={0}
          />
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
};

/**
 * Prop Validation
 */
FilestackFilePicker.propTypes = {
  error: PT.string,
  userId: PT.string.isRequired,
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
};

export default FilestackFilePicker;
