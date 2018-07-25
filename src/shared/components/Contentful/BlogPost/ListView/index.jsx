/**
 * The blog post list view.
 */

import PT from 'prop-types';
import React from 'react';

import MarkdownRenderer from 'components/MarkdownRenderer';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import { themr } from 'react-css-super-themr';
import defaultTheme from './themes/default.scss';

function BlogListView({
  heroImage,
  blogPost,
  theme,
}) {
  return (
    <div className={theme.container}>
      <div className={theme.contentWrapper}>
        {
          heroImage ? (
            <div className={theme.imageWrapper}>
              <img alt="" src={heroImage.file.url} />
            </div>
          ) : null
        }
        <div className={theme.content}>
          <h1>{blogPost.title}</h1>
          <MarkdownRenderer markdown={blogPost.description} />
          <PrimaryButton to="#">Read More</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

BlogListView.defaultProps = {
  heroImage: null,
};

BlogListView.propTypes = {
  heroImage: PT.shape(),
  blogPost: PT.shape().isRequired,
  theme: PT.shape({
    container: PT.string,
    contentWrapper: PT.string,
    content: PT.string,
    imageWrapper: PT.string,
  }).isRequired,
};

export default themr('BlogListView', defaultTheme)(BlogListView);
