/**
 * Article Card component.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import { logger } from 'topcoder-react-lib';
import PT from 'prop-types';
import React from 'react';
import ArticleCard from './ArticleCard';
import articleSmallTheme from './themes/article_small.scss';
import articleLargeTheme from './themes/article_large.scss';
import forumPostTheme from './themes/forum_post.scss';
import videoTheme from './themes/video.scss';
import recommendedTheme from './themes/recommended.scss';

const THEMES = {
  'Article large': articleLargeTheme,
  'Article small': articleSmallTheme,
  'Forum post': forumPostTheme,
  Video: videoTheme,
  Recommended: recommendedTheme,
};

/* Loads the article card's related entries and assets. */
function ArticleAssetsLoader(props) {
  const {
    article, articleCard, preview, spaceName, environment,
  } = props;

  // handle forum posts
  const { contentAuthor } = article;
  if (!contentAuthor) {
    logger.error("'contentAuthor' property should be required but is missing");
  }
  const contentAuthorIds = contentAuthor.map(obj => obj.sys.id);
  if (articleCard.theme === 'Forum post' && contentAuthorIds.length !== 0) {
    return (
      <ContentfulLoader
        entryIds={contentAuthorIds}
        preview={preview}
        spaceName={spaceName}
        environment={environment}
        render={(data) => {
          const avatars = [];
          let authors = contentAuthorIds.map((id, index) => {
            const author = data.entries.items[id].fields;
            // adding `key` property so it can be used as key
            // when looping over authors in `ArticleCard.jsx`
            author.id = id;
            author.key = `${id}_${index}`;
            if (author.avatar) {
              avatars.push(author.avatar.sys.id);
            }
            return author;
          });
          if (avatars.length) {
            return (
              <ContentfulLoader
                assetIds={avatars}
                preview={preview}
                spaceName={spaceName}
                environment={environment}
                render={(avatarsData) => {
                  authors = authors.map((a) => {
                    if (a.avatar && avatarsData.assets.items[a.avatar.sys.id]) {
                      // eslint-disable-next-line no-param-reassign
                      a.fields = avatarsData.assets.items[a.avatar.sys.id].fields;
                    }
                    return a;
                  });
                  return (
                    <ArticleCard
                      {...props}
                      contentAuthor={authors}
                      theme={THEMES[articleCard.theme]}
                      themeName={articleCard.theme}
                    />
                  );
                }}
                renderPlaceholder={LoadingIndicator}
              />
            );
          }
          return (
            <ArticleCard
              {...props}
              contentAuthor={authors}
              theme={THEMES[articleCard.theme]}
              themeName={articleCard.theme}
            />
          );
        }}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }

  // handle 'Article large', 'Article small' and 'Video'
  const { featuredImage } = article;
  if (featuredImage) {
    const { id } = featuredImage.sys;
    return (
      <ContentfulLoader
        assetIds={id}
        preview={preview}
        spaceName={spaceName}
        environment={environment}
        render={data => (
          <ArticleCard
            {...props}
            featuredImage={data.assets.items[id].fields}
            theme={THEMES[articleCard.theme]}
            themeName={articleCard.theme}
          />
        )}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }
  return (
    <ArticleCard
      {...props}
      theme={THEMES[articleCard.theme]}
      themeName={articleCard.theme}
    />
  );
}

ArticleAssetsLoader.defaultProps = {
  spaceName: null,
  environment: null,
};

ArticleAssetsLoader.propTypes = {
  article: PT.shape().isRequired,
  articleCard: PT.shape().isRequired,
  id: PT.string.isRequired,
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
};

/* Loads the article card's article entry */
export function ArticleLoader(props) {
  const {
    articleCard, preview, spaceName, environment,
  } = props;
  const { article } = articleCard;
  if (!article) {
    logger.error("'article' property should be required but is missing");
  }
  const { id } = article.sys;
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      renderPlaceholder={LoadingIndicator}
      render={data => (
        <ArticleAssetsLoader
          {...props}
          article={data.entries.items[id].fields}
        />
      )}
    />
  );
}

ArticleLoader.defaultProps = {
  spaceName: null,
  environment: null,
};

ArticleLoader.propTypes = {
  articleCard: PT.shape().isRequired,
  id: PT.string.isRequired,
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
};

/* Loads the main article card entry. */
function ArticleCardLoader(props) {
  const {
    id, preview, spaceName, environment,
  } = props;
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={data => (
        <ArticleLoader
          {...props}
          articleCard={data.entries.items[id].fields}
        />
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ArticleCardLoader.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

ArticleCardLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};

export default ArticleCardLoader;
