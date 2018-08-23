/**
 * Quote component
 *
 * Which may have:
 * - author photo
 * - author name
 * - author description
 * - quote text
 */
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';

import defaultStyle from './styles.scss';

const Quote = ({
  authorDescription,
  authorName,
  authorPhotoURL,
  children,
  theme,
}) => (
  <div className={theme.container}>
    {authorPhotoURL && <img src={authorPhotoURL} alt={authorName} className={theme.authorPhoto} />}
    <div>
      <blockquote className={theme.text}>
        {children}
      </blockquote>
      {authorName && (
      <p className={theme.authorName}>
        {authorName}
      </p>
      )}
      {authorDescription && (
      <p className={theme.authorDescription}>
        {authorDescription}
      </p>
      )}
    </div>
  </div>
);

Quote.defaultProps = {
  authorDescription: null,
  authorName: null,
  authorPhotoURL: null,
};

Quote.propTypes = {
  authorDescription: PT.string,
  authorName: PT.string,
  authorPhotoURL: PT.string,
  children: PT.node.isRequired,
  theme: PT.shape({
    authorDescription: PT.string,
    authorName: PT.string,
    authorPhoto: PT.string,
    container: PT.string,
    text: PT.string,
  }).isRequired,
};

export default themr('tcCommunities-Quote', defaultStyle)(Quote);
