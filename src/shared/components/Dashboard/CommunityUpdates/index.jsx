/* eslint react/no-danger:0 */

import React from 'react';
import PT from 'prop-types';

import config from 'utils/config';
import './styles.scss';

const CommunityUpdates = (props) => {
  const { blogs } = props;
  return (
    <div styleName="community-updates">
      <header>
        <h1 styleName="section-title">From the Community Blog</h1>
      </header>
      <div styleName="posts">
        {
          blogs.map(blog => (
            <div styleName="post" key={blog.link}>
              <div styleName="blog-link">
                <a href={blog.link} target="_blank" title={blog.title}>{blog.title}</a>
              </div>
              <div styleName="description" dangerouslySetInnerHTML={{ __html: blog.description }} />
            </div>
          ))
        }
      </div>
      <div styleName="blog-links">
        <a href={`https://www.${config.DOMAIN}/blog/`}>View More</a>
      </div>
    </div>
  );
};

CommunityUpdates.propTypes = {
  blogs: PT.arrayOf(PT.shape()),
};

CommunityUpdates.defaultProps = {
  blogs: [],
};

export default CommunityUpdates;
