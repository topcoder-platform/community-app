/**
 * The core blog post rendering.
 */

import PT from 'prop-types';
import React from 'react';
import { Tag } from 'topcoder-react-ui-kit';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import MarkdownRenderer from 'components/MarkdownRenderer';
import { fixStyle } from 'utils/contentful';
import { themr } from 'react-css-super-themr';
import { Link } from 'topcoder-react-utils';
import LeftArrow from 'assets/images/arrow-prev.svg';
import BlogListView from './ListView';
import defaultTheme from './themes/default.scss';

function BlogPost({
  heroImage,
  blogPost,
  theme,
  sys,
  preview,
  blogUrl,
}) {
  return (
    <div
      className={theme.container}
      style={fixStyle(blogPost.extraStylesForContainer)}
    >
      <div
        className={theme.contentWrapper}
        style={fixStyle(blogPost.extraStylesForContentWrapper)}
      >
        <div className={theme.header}>
          <Link to={blogUrl}>
            <LeftArrow className={theme.leftArrow} />
          </Link>
          <div>
            <h1 className={theme.title}>
              {blogPost.title}
            </h1>
            {/* Post Meta */}
            <div className={theme.postMeta}>
              <AuthorLoader
                id={blogPost.author.sys.id}
                theme={theme}
                preview={preview}
              />
              <div className={theme.postUpdatedAt}>
                <i className="fa fa-globe" aria-hidden="true" />
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                  weekday: 'long',
                }).format(new Date(sys.updatedAt))}
              </div>
            </div>
            {/* Tags */}
            {
              blogPost.tags ? (
                <div className={theme.postTags}>
                  {
                    blogPost.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))
                  }
                </div>
              ) : null
            }
          </div>
        </div>
        {/* Hero Image */}
        {
          heroImage ? (
            <div className={theme.image}>
              <img alt="" src={heroImage.file.url} />
            </div>
          ) : null
        }
        {/* Content */}
        <div
          className={theme.content}
          style={fixStyle(blogPost.extraStylesForContent)}
        >
          <MarkdownRenderer markdown={blogPost.description} />
          <MarkdownRenderer markdown={blogPost.body} />
        </div>
        {/* Related Posts */}
        {
          blogPost.relatedPosts ? (
            <div className={theme.relatedPostsWrap}>
              <h2>Related Posts</h2>
              <div className={theme.relatedPosts}>
                <RelatedPostsLoader
                  blogPost={blogPost}
                  blogUrl={blogUrl}
                  preview={preview}
                />
              </div>
            </div>
          ) : null
        }
      </div>
    </div>
  );
}

// Loads related posts
function RelatedPostsLoader({
  blogPost,
  preview,
  blogUrl,
}) {
  return blogPost.relatedPosts.map(rp => (
    <ContentfulLoader
      entryIds={rp.sys.id}
      preview={preview}
      render={(data) => {
        if (data.entries.items[rp.sys.id].fields.heroImage) {
          const assetId = data.entries.items[rp.sys.id].fields.heroImage.sys.id;
          return (
            <ContentfulLoader
              assetIds={assetId}
              preview={preview}
              render={imageData => (
                <BlogListView
                  heroImage={imageData.assets.items[assetId].fields}
                  blogPost={data.entries.items[rp.sys.id].fields}
                  readMoreLink={`${blogUrl}/${data.entries.items[rp.sys.id].fields.slug}`}
                />
              )}
              renderPlaceholder={LoadingIndicator}
            />
          );
        }
        return (
          <BlogListView
            blogPost={data.entries.items[rp.sys.id].fields}
            readMoreLink={`${blogUrl}/${data.entries.items[rp.sys.id].fields.slug}`}
          />
        );
      }}
      key={rp.sys.id}
      renderPlaceholder={LoadingIndicator}
    />
  ));
}

// Loads the post author
function AuthorLoader({
  id,
  theme,
}) {
  return (
    <ContentfulLoader
      entryIds={id}
      render={data => (
        <div className={theme.postAuthor}>
          <i className="fa fa-user" aria-hidden="true" />
          {data.entries.items[id].fields.name}
        </div>
      )}
    />
  );
}

AuthorLoader.propTypes = {
  id: PT.string.isRequired,
  theme: PT.shape().isRequired,
};

BlogPost.defaultProps = {
  heroImage: null,
  blogUrl: '#',
};

BlogPost.propTypes = {
  heroImage: PT.shape(),
  blogPost: PT.shape().isRequired,
  theme: PT.shape({
    container: PT.string.isRequired,
    content: PT.string.isRequired,
    contentWrapper: PT.string.isRequired,
    contentByImage: PT.string,
    contentWrapperByImage: PT.string,
    image: PT.string,
    header: PT.any,
    leftArrow: PT.any,
    title: PT.any,
    postMeta: PT.any,
    postUpdatedAt: PT.any,
    postTags: PT.any,
    relatedPostsWrap: PT.any,
    relatedPosts: PT.any,
  }).isRequired,
  sys: PT.shape().isRequired,
  preview: PT.bool.isRequired,
  blogUrl: PT.string,
};

export default themr('BlogPost', defaultTheme)(BlogPost);
