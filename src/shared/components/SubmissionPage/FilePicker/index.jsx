/**
 * components.page.challenge-details.FilePicker
 * <FilePicker> Component
 *
 * Description:
 *   Component for uploading a file using conventional html form file input
 *   Validates the file extension, and displays filename on success
 */
/* eslint-env browser */
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import './styles.scss';

/**
 * FilePicker component
 */
class FilePicker extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangeFile = this.handleChangeFile.bind(this);
  }

  componentDidMount() {
    const {
      id,
      setDragged,
      setError,
      setFileName,
    } = this.props;
    setFileName('');
    setError('');
    setDragged(false);
    const safeId = id || 1;
    const ele = document.getElementById(`drop-zone-${safeId}`);
    ele.addEventListener('dragenter', (e) => {
      setDragged(true);
      e.preventDefault();
    });
    ele.addEventListener('dragleave', (e) => {
      setDragged(false);
      e.preventDefault();
    });
    ele.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    ele.ondrop = (e) => {
      const inputEle = document.getElementById(`submission-input-${safeId}`);
      inputEle.files = e.dataTransfer.files;
      setDragged(false);
      e.preventDefault();
      e.stopPropagation();
    };
  }

  /* User has selected a new file, verify the filename and extensions */
  handleChangeFile() {
    const {
      fileExtensions,
      id,
      setFileName,
      setError,
    } = this.props;
    const safeId = id || 1;
    const element = document.getElementById(`submission-input-${safeId}`);
    const fileName = element.files[0].name;
    const splitFileName = fileName.split('.');
    const extension = `.${splitFileName[splitFileName.length - 1]}`;
    const allowedExtensions = fileExtensions;
    if (allowedExtensions.indexOf(extension) < 0) {
      setError(`Invalid ${allowedExtensions.join(' or ')} file.`);
      setFileName('');
    } else {
      setError('');
      setFileName(fileName);
    }
  }

  render() {
    const {
      fileExtensions,
      id,
      title,
      mandatory,
      fileName,
      error,
      dragged,
    } = this.props;
    const safeId = id || 1;

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
          id={`drop-zone-${safeId}`}
        >
          {
            !fileName && (
            <p>
Drag and drop your submission
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
          <input
            data-type="zip"
            type="file"
            name={`${title.toLowerCase()}File`}
            id={`submission-input-${safeId}`}
            styleName="submission-input"
            onChange={this.handleChangeFile}
          />
          <label // eslint-disable-line
            htmlFor={`submission-input-${safeId}`}
            id={`label-submit-file-${safeId}`}
          />
          <PrimaryButton
            onClick={(e) => {
              e.preventDefault();
              const ele = document.getElementById(`label-submit-file-${safeId}`);
              ele.click();
            }}
          >
Pick a File
          </PrimaryButton>
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

/**
 * Prop Validation
 */
FilePicker.propTypes = {
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
};

export default FilePicker;
