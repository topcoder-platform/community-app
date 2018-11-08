/**
 * Contentful BlogFeed component.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import LoadingIndicator from 'components/LoadingIndicator';
import { fixStyle } from 'utils/contentful';
import Card from './Card';
import rowLayout from './themes/rowLayout.scss';
import oneN2RowsLayout from './themes/oneN2RowsLayout.scss';

const THEMES = {
  'Row Layout': rowLayout,
  '1-n 2-rows Layout': oneN2RowsLayout,
};

const defaultBlogFeedFields = {
  numberOfPosts: 3,
};

export default function BlogFeed({ blogFeed, rssFeedData }) {
  const {
    title,
    numberOfPosts,
    theme: themeName,
    containerStyles,
    cardsWrapperStyles,
    cardStyles,
  } = blogFeed.fields;
  const theme = THEMES[themeName];
  const postsToShow = (numberOfPosts > 0 && numberOfPosts) || defaultBlogFeedFields.numberOfPosts;

  let cards = _.get(rssFeedData, 'data.item');
  cards = cards && cards
    .filter(item => Boolean(item.category))
    .slice(0, postsToShow)
    .map((item, index) => (
      <Card
        fullWidth={!index && themeName === '1-n 2-rows Layout'}
        item={item}
        key={item.link}
        theme={{
          container: theme.card,
        }}
        containerStyles={fixStyle(cardStyles)}
      />
    ));

  return (
    <div
      className={theme.container}
      style={fixStyle(containerStyles)}
    >
      {title
        && (
        <h2 className={theme.title}>
          {title}
        </h2>
        )
      }
      <div
        className={theme.cardsWrapper}
        style={cardsWrapperStyles}
      >
        {cards || <LoadingIndicator />}
      </div>
    </div>
  );
}

BlogFeed.propTypes = {
  blogFeed: PT.shape().isRequired,
  rssFeedData: PT.shape().isRequired,
};
