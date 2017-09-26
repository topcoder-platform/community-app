import React from 'react';
import PropTypes from 'prop-types';
import './input.scss';

/**
 * AddFont part shown on Submission Page of design challenges.
 */
class AddFont extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputDisabled: true,
      urlCorrect: true,
    };
    this.onChangeFontSelect = this.onChangeFontSelect.bind(this);
    this.onInputUrl = this.onInputUrl.bind(this);
  }

  onChangeFontSelect(e) {
    if (e.target.value !== '') {
      this.setState({
        inputDisabled: false,
      });
      this.props.disableButton(false);
    } else {
      this.setState({
        inputDisabled: true,
      });
      this.props.disableButton(true);
    }
  }

  onInputUrl(e) {
    if (e.target.value.match(/[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/)) {
      this.setState({
        urlCorrect: true,
      });
    } else if (!e.target.value) {
      this.setState({
        urlCorrect: true,
      });
    } else {
      this.setState({
        urlCorrect: false,
      });
    }
  }

  render() {
    return (
      <div styleName="container">
        <span styleName="desc">FONT SOURCE</span>
        <select
          styleName="inp"
          data-type="fontSource"
          defaultValue=""
          onChange={this.onChangeFontSelect}
        >
          <option value="">Select a provider from the list</option>
          <option value="Font 1">Font 1</option>
        </select>
        <span styleName="desc">FONT NAME</span>
        <input
          type="text"
          placeholder="Select font source to edit field"
          data-type="fontName"
          disabled={this.state.inputDisabled}
        />
        <span styleName="desc">FONT URL</span>
        <input
          type="text"
          placeholder="Select Font source to edit field"
          data-type="fontUrl"
          disabled={this.state.inputDisabled}
          onChange={this.onInputUrl}
        />
        <p styleName={`error ${!this.state.urlCorrect ? 'show' : ''}`}>
          This is not a correct url.
        </p>
        <div styleName="separator" />
      </div>
    );
  }
}

AddFont.propTypes = {
  disableButton: PropTypes.func.isRequired,
};

export default AddFont;
