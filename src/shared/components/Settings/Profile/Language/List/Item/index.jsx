/**
 * render language Item
 */
import React from 'react';
import PT from 'prop-types';
import { isomorphy } from 'topcoder-react-utils';

import languageIcon from '../../../../../../../assets/images/profile/language.png';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/profile', false, /svg/);
}

export default function Item(props) {
  const {
    language,
    index,
    onDeleteItem,
  } = props;

  return (
    <div styleName="container">
      <div styleName="language-info">
        <div styleName="language-icon">
          <img src={languageIcon} alt="language" />
        </div>
        <div styleName="language-parameters">
          <div styleName="parameter-first-line">
            { language.language }
          </div>
          <div styleName="parameter-second-line">
            { `Spoken: ${language.spokenLevel.toUpperCase()} | Written: ${language.writtenLevel.toUpperCase()}` }
          </div>
          <div styleName="parameter-second-line-mobile">
            <p>
              {`Spoken: ${language.spokenLevel.toUpperCase()}`}
            </p>
            <p>
              {`Written: ${language.spokenLevel.toUpperCase()}`}
            </p>
          </div>
        </div>
      </div>
      <a
        styleName="delete"
        onKeyPress={() => onDeleteItem(index)}
        tabIndex={0}
        role="button"
        onClick={() => onDeleteItem(index)}
      >
        <img src={assets('./ico-trash.svg')} alt="delete-icon" />
        <p>
          Delete
        </p>
      </a>
    </div>
  );
}

Item.propTypes = {
  language: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
};
