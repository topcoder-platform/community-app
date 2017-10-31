/**
 * components.page.challenge-details.Design.AddStockArtInput
 * <AddStockArtInput> Component
 *
 * Description:
 *   Allows user to describe an item of Stock Art used in their Design project.
 *   Will be created by a <MultiInput>, which may contain multiple <AddStockArtInput>s
 */

import React from 'react';
import PT from 'prop-types';
import './styles.scss';

/**
 * Add Stock Art part shown on Submission Page of design challenges.
 */
class AddStockArt extends React.Component {
  constructor(props) {
    super(props);
    this.onInputDesc = this.onInputDesc.bind(this);
    this.onInputUrl = this.onInputUrl.bind(this);
    this.onInputFileNumber = this.onInputFileNumber.bind(this);
  }

  /* Callback for when user enters Photo description */
  onInputDesc(e) {
    if (e.target.value !== '') {
      this.props.setNameValid(true);
    } else {
      this.props.setNameValid(false);
    }
    this.props.setActive(true);
  }

  /* Callback for when user enters Photo url */
  onInputUrl(e) {
    if (e.target.value.match(/[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/)) {
      this.props.setUrlValid(true);
    } else {
      this.props.setUrlValid(false);
    }
    this.props.setActive(true);
  }

  /* Callback for when user enters Photo file number */
  onInputFileNumber(e) {
    if (e.target.value !== '') {
      this.props.setSourceValid(true);
    } else {
      this.props.setSourceValid(false);
    }
    this.props.setActive(true);
  }

  render() {
    return (
      <div styleName="container">
        <span styleName="desc">PHOTO DESCRIPTION</span>
        <input type="text" data-type="photoDesc" onChange={this.onInputDesc} />
        <p styleName={`error ${this.props.active && !this.props.nameValid ? 'show' : ''}`}>
          This field is required.
        </p>
        <span styleName="desc">PHOTO URL</span>
        <input type="text" data-type="photoUrl" onChange={this.onInputUrl} />
        <p styleName={`error ${this.props.active && !this.props.urlValid ? 'show' : ''}`}>
          This is not a correct url.
        </p>
        <span styleName="desc">FILE NUMBER</span>
        <input type="text" data-type="photoNumber" onChange={this.onInputFileNumber} />
        <p styleName={`error ${this.props.active && !this.props.sourceValid ? 'show' : ''}`}>
          This field is required.
        </p>
        <div styleName="separator" />
      </div>
    );
  }
}

/**
 * Prop Validation
 */
AddStockArt.propTypes = {
  urlValid: PT.bool.isRequired,
  nameValid: PT.bool.isRequired,
  sourceValid: PT.bool.isRequired,
  active: PT.bool.isRequired,
  setActive: PT.func.isRequired,
  setUrlValid: PT.func.isRequired,
  setNameValid: PT.func.isRequired,
  setSourceValid: PT.func.isRequired,
};

export default AddStockArt;
