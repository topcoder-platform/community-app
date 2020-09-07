import React from 'react';
import PropTypes from 'prop-types';
import { singlePluralFormatter } from '../helpers';

import './style.scss';

const ListContainer = ({
  headerText,
  headerHighlightedText,
  children,
  numListItems,
}) => {
  function renderListCount(numItems) {
    if (numItems) {
      const listCountMessage = singlePluralFormatter(numItems, 'result');

      return <span styleName="list-count">{` - ${listCountMessage}`}</span>;
    }

    return null;
  }

  const listCount = renderListCount(numListItems);

  return (
    <div styleName="list-container">
      <div styleName="list-header">
        <span styleName="header-text">{headerText}
          <span styleName="highlighted">{headerHighlightedText}</span>
        </span>

        {listCount}
      </div>

      {children}
    </div>
  );
};

ListContainer.propTypes = {
  headerText: PropTypes.string.isRequired,
  headerHighlightedText: PropTypes.string,
  children: PropTypes.shape({}).isRequired,
  numListItems: PropTypes.number,
};

ListContainer.defaultProps = {
  headerHighlightedText: '',
  numListItems: 0,
};

export default ListContainer;
