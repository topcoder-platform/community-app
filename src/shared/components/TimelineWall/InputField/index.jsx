import React from 'react';

import PT from 'prop-types';
import PhotoVideoIcon from 'assets/images/timeline/photo-video.svg';

import './styles.scss';

const InputField = ({ onClick }) => (
  <div role="presentation" styleName="input-field" onClick={onClick}>
    <p styleName="input-placeholder">What event would you like to add?</p>

    <PhotoVideoIcon />
  </div>
);

InputField.propTypes = {
  onClick: PT.func.isRequired,
};

export default InputField;
