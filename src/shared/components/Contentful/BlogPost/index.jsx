/**
 * New Content Block component.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import BlogPost from './BlogPost';

const THEMES = {
};

/* Loads blog post hero image asset. */
export function HeroImageLoader(props) {
  const { blogPost, preview } = props;
  const { heroImage } = blogPost;
  if (heroImage) {
    const assetId = heroImage.sys.id;
    return (
      <ContentfulLoader
        assetIds={assetId}
        preview={preview}
        render={data => (
          <BlogPost
            {...props}
            heroImage={data.assets.items[assetId].fields}
            theme={THEMES[blogPost.theme]}
          />
        )}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }
  return <BlogPost {...props} theme={THEMES[blogPost.theme]} />;
}

HeroImageLoader.defaultProps = {
  blogUrl: '#',
};

HeroImageLoader.propTypes = {
  blogPost: PT.shape().isRequired,
  id: PT.string.isRequired,
  preview: PT.bool.isRequired,
  sys: PT.shape().isRequired,
  blogUrl: PT.string,
};

/* Loads the main blog post entry. */
export default function BlogPostLoader(props) {
  const { id, preview } = props;
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      render={data => (
        <HeroImageLoader
          {...props}
          blogPost={data.entries.items[id].fields}
          sys={data.entries.items[id].sys}
        />
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

BlogPostLoader.defaultProps = {
  preview: false,
};

BlogPostLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
};
