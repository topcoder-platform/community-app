import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

const TagItem = ({ tag }) => {
  const tagItemStyles = classNames(
    'tag-text',
    { 'searched-tag': tag.searchedTag },
    { 'special-tag': tag.specialTag },
  );

  return (
    <span styleName="tag-item">#
      <span styleName={tagItemStyles}>{tag.name}</span>
    </span>
  );
};

TagItem.propTypes = {
  tag: PropTypes.shape({
    searchedTag: PropTypes.bool,
    specialTag: PropTypes.bool,
    name: PropTypes.string,
  }).isRequired,
};

export default TagItem;
