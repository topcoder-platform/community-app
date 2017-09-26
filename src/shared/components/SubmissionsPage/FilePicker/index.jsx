/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import { PrimaryButton } from 'components/buttons';
import './styles.scss';

/**
 * FilePicker component
 */
class FilePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      error: '',
      dragged: false,
    };
    this.handleChangeFile = this.handleChangeFile.bind(this);
  }

  componentDidMount() {
    const id = this.props.id || 1;
    const ele = document.getElementById(`drop-zone-${id}`);
    ele.addEventListener('dragover', (e) => {
      this.setState({
        dragged: true,
      });
      e.preventDefault();
    });
    ele.addEventListener('dragenter', (e) => {
      this.setState({
        dragged: true,
      });
      e.preventDefault();
    });
    ele.addEventListener('dragleave', (e) => {
      this.setState({
        dragged: false,
      });
      e.preventDefault();
    });
    ele.ondrop = (e) => {
      const inputEle = document.getElementById(`submission-input-${id}`);
      inputEle.files = e.dataTransfer.files;
      this.setState({
        dragged: false,
      });
      e.preventDefault();
    };
  }

  handleChangeFile() {
    const id = this.props.id || 1;
    const element = document.getElementById(`submission-input-${id}`);
    const fileName = element.files[0].name;
    const splitFileName = fileName.split('.');
    const extension = `.${splitFileName[splitFileName.length - 1]}`;
    const allowedExtensions = this.props.fileExtensions;
    if (allowedExtensions.indexOf(extension) < 0) {
      this.setState({
        error: `Invalid ${allowedExtensions.join(' or ')} file.`,
        fileName: '',
      });
      this.props.cb(true);
    } else {
      this.setState({
        fileName,
        error: '',
      });
      this.props.cb(false);
    }
  }

  render() {
    const {
      fileExtensions,
      title,
      mandatory,
    } = this.props;
    const id = this.props.id || 1;
    const fileName = this.state.fileName;
    return (
      <div styleName="container">
        <div styleName="desc">
          <p>{title}</p>
          {
            mandatory && <p styleName="mandatory">*mandatory</p>
          }
        </div>
        <div
          styleName={`file-picker ${this.state.error ? 'error' : ''} ${this.state.dragged && 'drag'}`}
          id={`drop-zone-${id}`}
        >
          {
            !fileName && <p>Drag and drop your {fileExtensions.join(' or ')} file here.</p>
          }
          {
            !fileName && <span>or</span>
          }
          {
            fileName && <p styleName="file-name">{this.state.fileName}</p>
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
          this.state.error &&
          <div styleName="error-container">{this.state.error}</div>
        }
      </div>
    );
  }
}

FilePicker.propTypes = {
  fileExtensions: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  mandatory: PropTypes.bool.isRequired,
  cb: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default FilePicker;
