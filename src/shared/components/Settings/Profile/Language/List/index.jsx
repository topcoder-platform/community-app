/**
 * render Language list
 */
import React from 'react';
import PT from 'prop-types';
import Item from './Item';

import './styles.scss';

export default function LanguageList(props) {
  const {
    languageList,
    onDeleteItem,
  } = props;

  return (
    <div styleName={`container ${languageList.items.length > 0 ? 'active' : ''}`}>
      <ul>
        {
          languageList.items.map((language, index) => (
            <li key={`${language.language}${index + 1}`}>
              <Item language={language} index={index} onDeleteItem={onDeleteItem} />
            </li>
          ))
        }
      </ul>
    </div>
  );
}

LanguageList.propTypes = {
  languageList: PT.shape().isRequired,
  onDeleteItem: PT.func.isRequired,
};
