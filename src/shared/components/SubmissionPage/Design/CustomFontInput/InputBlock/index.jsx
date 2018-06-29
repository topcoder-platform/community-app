/**
 * components.SubmissionPage.Design.CustomFontInput
 * <InputBlock> Component
 *
 * Description:
 *   Allows user to describe a Font type used for Design project.
 *   Will be created by a <CustomFontInput>, which may contain multiple <InputBlock>s
 */
import React from 'react';
import PT from 'prop-types';
import './styles.scss';

/**
 * InputBlock part shown on Submission Page of design challenges.
 */
class InputBlock extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeFontSelect = this.onChangeFontSelect.bind(this);
    this.onInputUrl = this.onInputUrl.bind(this);
    this.onInputName = this.onInputName.bind(this);
  }

  /* Callback for when user selects fonts on the drop-down box */
  onChangeFontSelect(e) {
    const { record, set } = this.props;
    set({ ...record, active: true, source: e.target.value });
  }

  /* Callback for when user enters Font name */
  onInputName(e) {
    const { record, set } = this.props;
    set({ ...record, active: true, name: e.target.value });
  }

  /* Callback for when user enters Font url */
  onInputUrl(e) {
    const { record, set } = this.props;
    set({ ...record, active: true, url: e.target.value });
  }

  render() {
    const { record, set } = this.props;
    const {
      active, name, source, url, errors,
    } = record;

    return (
      <div styleName="container">
        <span styleName="desc">
FONT SOURCE
        </span>
        <select
          styleName="inp"
          data-type="fontSource"
          value={source}
          onChange={this.onChangeFontSelect}
        >
          <option disabled hidden value="">
Select a provider from the list
          </option>
          <option value="STUDIO_STANDARD_FONTS_LIST">
            Studio Standard Fonts List
          </option>
          <option value="FONTS_DOT_COM">
Fonts.com
          </option>
          <option value="MYFONTS">
MyFonts
          </option>
          <option value="ADOBE_FONTS">
Adobe Fonts
          </option>
          <option value="FONT_SHOP">
Font Shop
          </option>
          <option value="T26_DIGITAL_TYPE_FOUNDRY">
            T.26 Digital Type Foundry
          </option>
          <option value="FONT_SQUIRREL">
Font Squirrel
          </option>
          <option value="TYPOGRAPHY_DOT_COM">
Typography.com
          </option>
        </select>
        <span styleName="desc">
FONT NAME
        </span>
        <input
          type="text"
          placeholder="Select font source to edit field"
          data-type="fontName"
          disabled={errors.INVALID_SOURCE}
          value={name}
          onChange={this.onInputName}
        />
        <p styleName={`error ${active && errors.INVALID_NAME ? 'show' : ''}`}>
          This field is required.
        </p>
        {source !== 'STUDIO_STANDARD_FONTS_LIST'
          ? [
            <span key={1} styleName="desc">
FONT URL
            </span>,
            <input
              key={2}
              type="text"
              placeholder="Select Font source to edit field"
              data-type="fontUrl"
              disabled={errors.INVALID_SOURCE}
              value={url}
              onChange={this.onInputUrl}
            />,
            <p key={3} styleName={`error ${active && errors.INVALID_URL ? 'show' : ''}`}>
              This is not a correct url.
            </p>,
          ]
          : null
        }
        <div styleName="separator" />
        <button
          styleName="close"
          type="button"
          onClick={() => set()}
        >
          <span>
&#10799;
          </span>
        </button>
      </div>
    );
  }
}

/**
 * Prop Validation
 */
InputBlock.propTypes = {
  record: PT.shape({
    active: PT.bool.isRequired,
    source: PT.string.isRequired,
    name: PT.string.isRequired,
    url: PT.string.isRequired,
    errors: PT.shape().isRequired,
  }).isRequired,
  set: PT.func.isRequired,
};

export default InputBlock;
