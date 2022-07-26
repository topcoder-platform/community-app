/**
 * render language Item
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { isomorphy } from 'topcoder-react-utils';

import languageIcon from 'assets/images/profile/language.png';

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
    onEditItem,
  } = props;

  const hasOptions = () => {
    if (_.isEmpty(language.spokenLevel) && _.isEmpty(language.writtenLevel)) {
      return false;
    }

    return true;
  };

  return (
    <div styleName="container">
      <div styleName="language-info">
        <div styleName="language-icon">
          <img src={languageIcon} alt="language" />
        </div>
        <div styleName={`language-parameters${hasOptions() ? '' : ' single-line'}`}>
          <div styleName={`parameter-first-line${hasOptions() ? '' : ' single-line'}`}>
            { language.language }
          </div>
          {
            (!_.isEmpty(language.spokenLevel) || !_.isEmpty(language.writtenLevel)) && (
              <div styleName="parameter-second-line">
                {
                  (!_.isEmpty(language.spokenLevel) && !_.isEmpty(language.writtenLevel)) && (`Spoken: ${language.spokenLevel.toUpperCase()} | Written: ${language.writtenLevel.toUpperCase()}`)
                }
                {
                  (!_.isEmpty(language.spokenLevel) && _.isEmpty(language.writtenLevel)) && (`Spoken: ${language.spokenLevel.toUpperCase()}`)
                }
                {
                  (_.isEmpty(language.spokenLevel) && !_.isEmpty(language.writtenLevel)) && (`Written: ${language.writtenLevel.toUpperCase()}`)
                }
              </div>
            )
          }
          {
            (!_.isEmpty(language.spokenLevel) || !_.isEmpty(language.writtenLevel)) && (
              <div styleName="parameter-second-line-mobile">
                {
                  !_.isEmpty(language.spokenLevel) && (
                    <p>
                      {`Spoken: ${language.spokenLevel.toUpperCase()}`}
                    </p>
                  )
                }
                {
                  !_.isEmpty(language.writtenLevel) && (
                    <p>
                      {`Written: ${language.writtenLevel.toUpperCase()}`}
                    </p>
                  )
                }
              </div>
            )
          }
        </div>
      </div>
      <div styleName="operation-container">
        <a
          styleName="edit"
          onKeyPress={() => onEditItem(index)}
          tabIndex={0}
          role="button"
          onClick={() => onEditItem(index)}
        >
          <img src={assets('./ico-edit.svg')} alt="edit-icon" />
          <p>
            Edit
          </p>
        </a>
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
    </div>
  );
}

Item.propTypes = {
  language: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};
