/**
 * The blog post list view.
 */

import PT from 'prop-types';
import React from 'react';

import MarkdownRenderer from 'components/MarkdownRenderer';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { Link } from 'topcoder-react-utils';

import { themr } from 'react-css-super-themr';
import defaultTheme from './themes/default.scss';

function BlogListView({
  heroImage,
  blogPost,
  theme,
  readMoreLink,
}) {
  return (
    <div className={theme.container}>
      <div className={theme.contentWrapper}>
        {
          heroImage ? (
            <div className={theme.imageWrapper}>
              <Link to={readMoreLink}>
                <img alt="" src={heroImage.file.url} />
              </Link>
            </div>
          ) : null
        }
        <div className={theme.content}>
          <Link to={readMoreLink}>
            <h1>{blogPost.title}</h1>
          </Link>
          <MarkdownRenderer markdown={blogPost.description} />
          <PrimaryButton to={readMoreLink}>Read More</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

BlogListView.defaultProps = {
  heroImage: null,
  readMoreLink: '#',
};

BlogListView.propTypes = {
  heroImage: PT.shape(),
  blogPost: PT.shape().isRequired,
  readMoreLink: PT.string,
  theme: PT.shape({
    container: PT.string,
    contentWrapper: PT.string,
    content: PT.string,
    imageWrapper: PT.string,
  }).isRequired,
};

export default themr('BlogListView', defaultTheme)(BlogListView);
