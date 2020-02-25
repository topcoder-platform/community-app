import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shortId from 'shortid';
import TagItem from './TagItem';

import './style.scss';

const TagList = ({ tags, label, emptyMessage = '' }) => {
  const tagListStyles = classNames(
    'tag-list',
    { 'no-tags': !tags.length },
  );

  const tagLabelStyles = classNames({ 'tag-list-label': tags.length && label });

  const tagLabel = tags.length && label ? label : null;

  const noTagsMessage = !tags.length && emptyMessage ? emptyMessage : null;

  const tagItems = tags.map(t => <TagItem key={shortId()} tag={t} />);

  return (
    <div styleName={tagListStyles}>
      <span styleName={tagLabelStyles}>{tagLabel}</span>

      <span>{noTagsMessage}</span>

      {tagItems}
    </div>
  );
};

TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  label: PropTypes.string,
  emptyMessage: PropTypes.string.isRequired,
};

TagList.defaultProps = {
  label: '',
};

export default TagList;
