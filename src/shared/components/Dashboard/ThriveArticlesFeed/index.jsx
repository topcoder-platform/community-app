/**
 * Thrive Articles Feed component
 */

import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import './styles.scss';
import { config } from 'topcoder-react-utils';
import ThriveArticlesIcon from 'assets/images/thrive-articles.svg';

export default function ThriveArticlesFeed({
  articles,
  loading,
  theme,
}) {
  return (
    <div styleName={`container ${theme}`}>
      <div styleName="header">
        <div styleName="title">
          <ThriveArticlesIcon styleName="icon" />
          <span>THRIVE ARTICLES</span>
        </div>
        <a
          styleName="allLink"
          href={`${config.URL.COMMUNITY_APP}/thrive`}
          target="_blank"
          rel="noreferrer"
        >View all
        </a>
      </div>
      <div styleName="articles">
        {loading ? <div styleName="loading"><LoadingIndicator /></div>
          : articles.map(article => (
            <div styleName="row" key={`thrive-articles-feed-${article.fields.slug}`}>
              <a
                href={`${config.URL.COMMUNITY_APP}/thrive/articles/${article.fields.slug}`}
                target="_blank"
                rel="noreferrer"
              >{article.fields.title}
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

ThriveArticlesFeed.defaultProps = {
  articles: [],
  theme: 'light',
};

ThriveArticlesFeed.propTypes = {
  articles: PT.arrayOf(PT.shape()),
  loading: PT.bool.isRequired,
  theme: PT.oneOf(['dark', 'light']),
};
