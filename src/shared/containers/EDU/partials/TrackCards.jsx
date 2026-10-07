import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import { ArticleLoader } from 'components/Contentful/ArticleCard';

// Contentful applies `select` to both entries and resolved includes. Keep only
// Article small fields, plus the linked author identity and Asset file payload.
const TRACK_CARD_SELECT = [
  'sys.id',
  'sys.type',
  'fields.externalArticle',
  'fields.contentUrl',
  'fields.slug',
  'fields.title',
  'fields.tags',
  'fields.readTime',
  'fields.creationDate',
  'fields.upvotes',
  'fields.commentsCount',
  'fields.featuredImage',
  'fields.contentAuthor',
  'fields.file',
].join(',');

// Show the latest articles by their editor-set publication date, so a backdated
// article sits in calendar order. CMS creation time only breaks same-day ties.
const TRACK_CARD_ORDER = '-fields.creationDate,-sys.createdAt';

export default function TrackCards(props) {
  const { track, theme } = props;
  return (
    <ContentfulLoader
      entryQueries={{
        content_type: 'article',
        'fields.trackCategory': track,
        limit: 3,
        order: TRACK_CARD_ORDER,
        select: TRACK_CARD_SELECT,
      }}
      spaceName="EDU"
      render={(data) => {
        if (_.isEmpty(data.entries.items)) return null;
        return (
          <div className={theme.trackCards}>
            {
              _.map(data.entries.items, article => <ArticleLoader spaceName="EDU" articleCard={{ article, theme: 'Article small' }} id="" preview={false} key={article.sys.id} />)
            }
          </div>
        );
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

TrackCards.propTypes = {
  track: PT.string.isRequired,
  theme: PT.shape().isRequired,
};
