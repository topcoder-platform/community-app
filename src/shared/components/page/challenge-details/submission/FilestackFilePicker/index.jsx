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
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'components/buttons';
import config from 'utils/config';
import './styles.scss';

const filepicker = require('filepicker-js');

/**
 * FilestackFilePicker component
 */
class FilestackFilePicker extends React.Component {
  constructor(props) {
    super(props);

    this.onSuccess = this.onSuccess.bind(this);
    this.onClickPick = this.onClickPick.bind(this);
  }

  componentDidMount() {
    const {
      setFileName,
      setError,
      setDragged,
      id,
    } = this.props;

    setFileName('');
    setError('');
    setDragged(false);

    const ele = document.getElementById(`drop-zone-${id}`);

    filepicker.setKey(config.FILESTACK.API_KEY);

    const { pickerOptions, storeOptions } = this.getOptions();

    filepicker.makeDropPane(ele, {
      ...pickerOptions,
      ...storeOptions,
      dragEnter: () => setDragged(true),
      dragLeave: () => setDragged(false),
      onSuccess: (blobs) => {
        setDragged(false);
        this.onSuccess(blobs);
      },
      onError: () => {
        setDragged(false);
      },
    });
  }

  /* Called when a file is successfully stored in the S3 container */
  onSuccess(blobs) {
    const {
      filename,
      mimetype,
      size,
      key,
      container,
    } = blobs[0];

    this.props.setFileName(filename);

    this.props.setFilestackData({
      filename,
      mimetype,
      size,
      key,
      // container doesn't seem to get echoed from Drag and Drop
      container: container || config.FILESTACK.SUBMISSION_CONTAINER,
    });
  }

  /* Callback for when clicks Pick a File */
  onClickPick(e) {
    e.stopPropagation();
    e.preventDefault();

    filepicker.setKey(config.FILESTACK.API_KEY);

    const { pickerOptions, storeOptions } = this.getOptions();

    filepicker.pickAndStore(pickerOptions, storeOptions, this.onSuccess);
  }

  /**
   * Generate Filestack configuration options, will be reused for Picker and Drag + Drop
   * @return {Object} The options split into {pickerOptions, storeOptions} objects
   */
  getOptions() {
    const {
      title,
      userId,
      fileExtensions,
    } = this.props;

    let path = '';

    // Formats the filename according to the type of submission
    if (title === 'PREVIEW') {
      path = 'DESIGN_COVER/';
    } else if (title === 'SUBMISSION') {
      path = `SUBMISSION_ZIP/${userId}-SUBMISSION_ZIP-${new Date().valueOf()}.zip`;
    } else if (title === 'SOURCE') {
      path = `SOURCE_ZIP/${userId}-SOURCE_ZIP-${new Date().valueOf()}.zip`;
    }

    return ({
      pickerOptions: {
        extensions: fileExtensions,
        services: ['COMPUTER', 'GOOGLE_DRIVE', 'BOX', 'DROPBOX', 'SKYDRIVE'],
        maxSize: 500 * 1024 * 1024,
      },
      storeOptions: {
        multiple: false,
        location: 'S3',
        path,
        // Inconsistent keys between Drag + Drop and Pick
        container: config.FILESTACK.SUBMISSION_CONTAINER,
        storeContainer: config.FILESTACK.SUBMISSION_CONTAINER,
      },
    });
  }

  render() {
    const {
      fileName,
      fileExtensions,
      title,
      mandatory,
      error,
      dragged,
      id,
    } = this.props;

    return (
      <div styleName="container">
        <div styleName="desc">
          <p>{title}</p>
          {
            mandatory && <p styleName="mandatory">*mandatory</p>
          }
        </div>
        <div
          styleName={`file-picker ${error ? 'error' : ''} ${dragged && 'drag'}`}
          id={`drop-zone-${id}`}
        >
          {
            !fileName && <p>Drag and drop your {fileExtensions.join(' or ')} file here.</p>
          }
          {
            !fileName && <span>or</span>
          }
          {
            fileName && <p styleName="file-name">{fileName}</p>
          }
          <PrimaryButton onClick={this.onClickPick}>Pick a File</PrimaryButton>
        </div>
        {
          error &&
          <div styleName="error-container">{error}</div>
        }
      </div>
    );
  }
}

/**
 * Prop Validation
 */
FilestackFilePicker.propTypes = {
  userId: PT.string.isRequired,
  fileExtensions: PT.arrayOf(PT.string).isRequired,
  title: PT.string.isRequired,
  mandatory: PT.bool.isRequired,
  id: PT.string.isRequired,
  setError: PT.func.isRequired,
  setFileName: PT.func.isRequired,
  error: PT.string.isRequired,
  fileName: PT.string.isRequired,
  setDragged: PT.func.isRequired,
  dragged: PT.bool.isRequired,
  setFilestackData: PT.func.isRequired,
};

export default FilestackFilePicker;
