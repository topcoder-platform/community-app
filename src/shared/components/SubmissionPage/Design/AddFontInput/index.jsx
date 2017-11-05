/**
 * components.page.challenge-details.Design
 * <AddFontInput> Component
 *
 * Description:
 *   Allows user to describe a Font type used for Design project.
 *   Will be created by a <MultiInput>, which may contain multiple <AddFontInput>s
 */
import React from 'react';
import PT from 'prop-types';
import './styles.scss';

/**
 * AddFont part shown on Submission Page of design challenges.
 */
class AddFont extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeFontSelect = this.onChangeFontSelect.bind(this);
    this.onInputUrl = this.onInputUrl.bind(this);
    this.onInputName = this.onInputName.bind(this);
  }

  /* Callback for when user selects fonts on the drop-down box */
  onChangeFontSelect(e) {
    if (e.target.value !== '') {
      this.props.setSourceValid(true);
    } else {
      this.props.setSourceValid(false);
    }
    this.props.setActive(true);
  }

  /* Callback for when user enters Font url */
  onInputUrl(e) {
    if (e.target.value.match(/[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/)) {
      this.props.setUrlValid(true);
    } else {
      this.props.setUrlValid(false);
    }
    this.props.setActive(true);
  }

  /* Callback for when user enters Font name */
  onInputName(e) {
    if (e.target.value !== '') {
      this.props.setNameValid(true);
    } else {
      this.props.setNameValid(false);
    }
    this.props.setActive(true);
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
          <option disabled hidden value="">Select a provider from the list</option>
          <option value="STUDIO_STANDARD_FONTS_LIST">
            Studio Standard Fonts List
          </option>
          <option value="FONTS_DOT_COM">Fonts.com</option>
          <option value="MYFONTS">MyFonts</option>
          <option value="ADOBE_FONTS">Adobe Fonts</option>
          <option value="FONT_SHOP">Font Shop</option>
          <option value="T26_DIGITAL_TYPE_FOUNDRY">
            T.26 Digital Type Foundry
          </option>
          <option value="FONT_SQUIRREL">Font Squirrel</option>
          <option value="TYPOGRAPHY_DOT_COM">Typography.com</option>
        </select>
        <span styleName="desc">FONT NAME</span>
        <input
          type="text"
          placeholder="Select font source to edit field"
          data-type="fontName"
          disabled={!this.props.sourceValid}
          onChange={this.onInputName}
        />
        <p styleName={`error ${this.props.active && !this.props.nameValid ? 'show' : ''}`}>
          This field is required.
        </p>
        <span styleName="desc">FONT URL</span>
        <input
          type="text"
          placeholder="Select Font source to edit field"
          data-type="fontUrl"
          disabled={!this.props.sourceValid}
          onChange={this.onInputUrl}
        />
        <p styleName={`error ${this.props.active && !this.props.urlValid ? 'show' : ''}`}>
          This is not a correct url.
        </p>
        <div styleName="separator" />
      </div>
    );
  }
}

/**
 * Prop Validation
 */
AddFont.propTypes = {
  urlValid: PT.bool.isRequired,
  nameValid: PT.bool.isRequired,
  sourceValid: PT.bool.isRequired,
  active: PT.bool.isRequired,
  setActive: PT.func.isRequired,
  setUrlValid: PT.func.isRequired,
  setNameValid: PT.func.isRequired,
  setSourceValid: PT.func.isRequired,
};

export default AddFont;
