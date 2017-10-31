/**
 * components.page.challenge-details.Design
 * <MultiInput> Component
 *
 * Description:
 *   Container component which holds multiple <AddFontInput> or <AddStockArtInput>
 *   Provides the user a button to add and remove these inputs, plus validation
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'components/buttons';
import AddFontInput from '../AddFontInput';
import AddStockArtInput from '../AddStockArtInput';
import './styles.scss';

/**
 * Iterates through all the AddFontInput and AddStockArt in the redux state
 * and checks that all the data validations have passed.
 * Does not count inactive inputs (ie. the default Font/Art inputs that are
 * optional for submission )
 * @param {Array} inputs Array of Inputs from the redux store
 * @return {Boolean} True if there were any validation errors in active Inputs
 */
export function checkValidationError(inputs) {
  let error = false;
  inputs.forEach((input) => {
    if (input.active) {
      if (!input.urlValid || !input.nameValid || !input.sourceValid) {
        error = true;
      }
    }
  });
  return error;
}

class MultiInput extends React.Component {
  constructor(props) {
    super(props);

    this.addInput = this.addInput.bind(this);
    this.setInputDefaults = this.setInputDefaults.bind(this);
  }

  /* Set the default redux state for a newly added Input when user clicks Add Font/StockArt */
  setInputDefaults(index) {
    this.props.setInputUrlValid(index, false);
    this.props.setInputSourceValid(index, false);
    this.props.setInputNameValid(index, false);
    this.props.setInputActive(index, false);
  }

  /* Callback for when user clicks Add button */
  addInput(e) {
    e.preventDefault();
    this.setInputDefaults(this.props.inputs.length);
    this.props.setInputActive(this.props.inputs.length, true);
  }

  render() {
    const commonProps = index => ({
      addInput: this.addInput,
      urlValid: this.props.inputs[index].urlValid,
      sourceValid: this.props.inputs[index].sourceValid,
      nameValid: this.props.inputs[index].nameValid,
      setUrlValid: _.partial(this.props.setInputUrlValid, index),
      setSourceValid: _.partial(this.props.setInputSourceValid, index),
      setNameValid: _.partial(this.props.setInputNameValid, index),
      active: this.props.inputs[index].active,
      setActive: _.partial(this.props.setInputActive, index),
    });

    return (
      <div styleName="outer-container">
        {
          this.props.inputs.map((input, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`multi-${this.props.id}-input-${index}`} styleName="container">
              {
                this.props.type === 'ADDFONT' ?
                  <AddFontInput
                    {...commonProps(index)}
                  /> :
                  <AddStockArtInput
                    {...commonProps(index)}
                  />
              }
              {
                <button
                  styleName="close"
                  type="button"
                  onClick={() => ((this.props.inputs.length > 1) ?
                    this.props.removeInput(index) : this.setInputDefaults(index))}
                ><span>&#10799;</span></button>
              }
            </div>
          ))
        }
        <PrimaryButton
          onClick={this.addInput}
          disabled={checkValidationError(this.props.inputs)}
        >{this.props.buttonName}</PrimaryButton>
      </div>
    );
  }
}

/**
 * Prop Validation
 */
MultiInput.propTypes = {
  buttonName: PT.string.isRequired,
  type: PT.string.isRequired,
  id: PT.string.isRequired,
  inputs: PT.arrayOf(PT.shape({
    urlValid: PT.bool.isRequired,
    nameValid: PT.bool.isRequired,
    sourceValid: PT.bool.isRequired,
    active: PT.bool.isRequired,
  }).isRequired).isRequired,
  removeInput: PT.func.isRequired,
  setInputUrlValid: PT.func.isRequired,
  setInputNameValid: PT.func.isRequired,
  setInputSourceValid: PT.func.isRequired,
  setInputActive: PT.func.isRequired,
};

export default MultiInput;
