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
  /* Callback for when user enters Photo file number */
  onInputFileNumber(e) {
    this.props.setSourceValid(Boolean(e.target.value));
    this.props.setActive(true);
  }

  render() {
    return (
      <div styleName="container">
        <span styleName="desc">FILE NUMBER</span>
        <input
          data-type="photoNumber"
          onChange={e => this.onInputFileNumber(e)}
          type="text"
        />
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
  sourceValid: PT.bool.isRequired,
  active: PT.bool.isRequired,
  setActive: PT.func.isRequired,
  setSourceValid: PT.func.isRequired,
};

export default AddStockArt;
