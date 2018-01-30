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
    this.props.setFileName('');
    this.props.setError('');
    this.props.setDragged(false);
    const id = this.props.id || 1;
    const ele = document.getElementById(`drop-zone-${id}`);
    ele.addEventListener('dragenter', (e) => {
      this.props.setDragged(true);
      e.preventDefault();
    });
    ele.addEventListener('dragleave', (e) => {
      this.props.setDragged(false);
      e.preventDefault();
    });
    ele.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    ele.ondrop = (e) => {
      const inputEle = document.getElementById(`submission-input-${id}`);
      inputEle.files = e.dataTransfer.files;
      this.props.setDragged(false);
      e.preventDefault();
      e.stopPropagation();
    };
  }

  /* User has selected a new file, verify the filename and extensions */
  handleChangeFile() {
    const id = this.props.id || 1;
    const element = document.getElementById(`submission-input-${id}`);
    const fileName = element.files[0].name;
    const splitFileName = fileName.split('.');
    const extension = `.${splitFileName[splitFileName.length - 1]}`;
    const allowedExtensions = this.props.fileExtensions;
    if (allowedExtensions.indexOf(extension) < 0) {
      this.props.setError(`Invalid ${allowedExtensions.join(' or ')} file.`);
      this.props.setFileName('');
    } else {
      this.props.setError('');
      this.props.setFileName(fileName);
    }
  }

  render() {
    const {
      fileExtensions,
      title,
      mandatory,
      fileName,
      error,
      dragged,
    } = this.props;
    const id = this.props.id || 1;

    return (
      <div styleName="container">
        <div styleName="desc">
          <p>{title}</p>
          {
            mandatory && <p styleName="mandatory">*mandatory</p>
          }
        </div>
        <div
          styleName={`file-picker ${error ? 'error' : ''} ${dragged ? 'drag' : ''}`}
          id={`drop-zone-${id}`}
        >
          {
            !fileName && <p>Drag and drop your submission{fileExtensions.join(' or ')} file here.</p>
          }
          {
            !fileName && <span>or</span>
          }
          {
            fileName && <p styleName="file-name">{fileName}</p>
          }
          <input
            data-type="zip"
            type="file"
            name={`${title.toLowerCase()}File`}
            id={`submission-input-${id}`}
            styleName="submission-input"
            onChange={this.handleChangeFile}
          />
          <label
            htmlFor={`submission-input-${id}`}
            id={`label-submit-file-${id}`}
          />
          <PrimaryButton
            onClick={(e) => {
              e.preventDefault();
              const ele = document.getElementById(`label-submit-file-${id}`);
              ele.click();
            }}
          >Pick a File</PrimaryButton>
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
