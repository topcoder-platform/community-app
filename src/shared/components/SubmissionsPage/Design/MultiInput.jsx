import React from 'react';
import PropTypes from 'prop-types';
import { PrimaryButton } from 'components/buttons';
import AddFontInput from './AddFontInput';
import AddStockArtInput from './AddStockArtInput';
import './MultiInput.scss';

/**
 * HOC to wrap adding functionality.
 */
class MultiInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: ['1'],
      lastCount: 1,
      buttonDisabled: this.props.type === 'ADDFONT',
    };
    this.addInput = this.addInput.bind(this);
    this.removeInput = this.removeInput.bind(this);
    this.disableButton = this.disableButton.bind(this);
  }

  addInput(e) {
    e.preventDefault();
    this.setState({
      inputs: [...this.state.inputs, `${this.state.lastCount + 1}`],
      lastCount: this.state.lastCount + 1,
      buttonDisabled: this.props.type === 'ADDFONT',
    });
  }

  removeInput(id) {
    this.setState({
      inputs: this.state.inputs.filter(val => val !== id),
    });
  }

  disableButton(val) {
    this.setState({
      buttonDisabled: val,
    });
  }

  render() {
    return (
      <div styleName="outer-container">
        {
          this.state.inputs.map(input => (
            <div key={input} styleName="container">
              {
                this.props.type === 'ADDFONT' ?
                  <AddFontInput
                    addInput={this.addInput}
                    disableButton={this.disableButton}
                  /> :
                  <AddStockArtInput
                    addInput={this.addInput}
                  />
              }
              {
                this.state.inputs.length > 1 &&
                  <button
                    styleName="close"
                    onClick={() => this.removeInput(input)}
                  ><span>&#10799;</span></button>
              }
            </div>
          ))
        }
        <PrimaryButton
          onClick={this.addInput}
          disabled={this.state.buttonDisabled}
        >{this.props.buttonName}</PrimaryButton>
      </div>
    );
  }
}

MultiInput.propTypes = {
  buttonName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default MultiInput;
