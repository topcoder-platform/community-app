/**
 * GUIKit FilePicker local file input
 */

import React from 'react';
import PT from 'prop-types';
import Dropzone from 'react-dropzone';

import './styles.scss';

/**
 * LocalFilePicker component
 */
function LocalFilePicker({
  onFilePick,
  btnText,
  infoText,
  options,
  errorMsg,
  inputOptions,
  file,
}) {
  let fileName = file ? file.name : null;
  return (
    <React.Fragment>
      <Dropzone
        onDrop={(acceptedFiles) => {
          fileName = acceptedFiles[0].name;
          onFilePick(acceptedFiles);
        }}
        {...options}
      >
        {({ getRootProps, getInputProps }) => (
          <section styleName={`container ${errorMsg ? 'hasError' : ''}`} {...getRootProps()}>
            <input {...getInputProps(inputOptions)} />
            {
              fileName ? (
                <p styleName="infoText withFile">{fileName}</p>
              ) : (
                <p styleName="infoText">
                  {infoText}
                  <span>OR</span>
                </p>
              )
            }
            <button styleName="btn" type="button">{btnText}</button>
          </section>
        )}
      </Dropzone>
      {errorMsg ? (<span styleName="errorMessage">{errorMsg}</span>) : null}
    </React.Fragment>
  );
}

LocalFilePicker.defaultProps = {
  infoText: '',
  btnText: 'SELECT A FILE',
  options: {},
  errorMsg: '',
  inputOptions: {},
  file: null,
};

/**
 * Prop Validation
 */
LocalFilePicker.propTypes = {
  infoText: PT.string,
  btnText: PT.string,
  onFilePick: PT.func.isRequired,
  options: PT.shape(),
  errorMsg: PT.string,
  inputOptions: PT.shape(),
  file: PT.shape(),
};

export default LocalFilePicker;
