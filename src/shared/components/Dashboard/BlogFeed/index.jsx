/**
 * Blog Feed component
 */

import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import './styles.scss';
import { config } from 'topcoder-react-utils';

export default function BlogFeed({ blogs, loading, theme }) {
  return (
    <div styleName={`container ${theme}`}>
      <div styleName="header">
        <div styleName="title">
          <span>Blog Articles</span>
        </div>
        <a
          styleName="allLink"
          href={`${config.URL.BASE}/blog/category/community-stories`}
          target="_blank"
          rel="noreferrer"
        >
          View all
        </a>
      </div>
      <div styleName="blogs">
        {loading ? (
          <div styleName="loading">
            <LoadingIndicator />
          </div>
        ) : (
          blogs.map(blog => (
            <div
              styleName="row"
              key={`blog-feed-${blog.link}`}
            >
              <a
                href={`${blog.link}`}
                target="_blank"
                rel="noreferrer"
              >
                {blog.title}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

BlogFeed.defaultProps = {
  blogs: [],
  theme: 'light',
};

BlogFeed.propTypes = {
  blogs: PT.arrayOf(PT.shape()),
  loading: PT.bool.isRequired,
  theme: PT.oneOf(['dark', 'light']),
};
