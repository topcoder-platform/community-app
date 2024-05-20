/**
 * Thrive Articles Feed component
 */

import LoadingIndicator from "components/LoadingIndicator";
import PT from "prop-types";
import React from "react";
import "./styles.scss";

export default function ThriveArticlesFeed({ articles, loading, theme }) {
  return (
    <div styleName={`container ${theme}`}>
      <div styleName="header">
        <div styleName="title">
          <span>Thrive Articles</span>
        </div>
        <a styleName="allLink" href="/thrive" target="_blank" rel="noreferrer">
          View all
        </a>
      </div>
      <div styleName="articles">
        {loading ? (
          <div styleName="loading">
            <LoadingIndicator />
          </div>
        ) : (
          articles.map((article) => (
            <div
              styleName="row"
              key={`thrive-articles-feed-${article.fields.slug}`}
            >
              <a
                href={`/thrive/articles/${
                  article.fields.slug || article.fields.title
                }`}
                target="_blank"
                rel="noreferrer"
              >
                {article.fields.title}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ThriveArticlesFeed.defaultProps = {
  articles: [],
  theme: "light",
};

ThriveArticlesFeed.propTypes = {
  articles: PT.arrayOf(PT.shape()),
  loading: PT.bool.isRequired,
  theme: PT.oneOf(["dark", "light"]),
};
