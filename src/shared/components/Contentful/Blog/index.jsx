/**
 * New Blog component.
 */

import React, { Component } from 'react';
import PT from 'prop-types';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import Blog from './Blog';

const entryQueries = {
  content_type: 'blogPost',
  order: '-sys.createdAt',
};

/* Loads the blog posts based on url. */
class BlogLoader extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event, page) {
    event.preventDefault();
    const num = /[0-9]+/.exec(page);
    if (!num || num[0] !== page || page < 1 || page > this.totalPage) return;

    const {
      history,
      baseUrl,
    } = this.props;
    history.push(`${baseUrl}/${page}`);
  }

  render() {
    const {
      baseUrl,
      id,
      limit,
      page,
      preview,
    } = this.props;
    entryQueries['fields.blog'] = id;
    entryQueries.limit = limit;
    entryQueries.skip = (page - 1) * limit;
    return (
      <ContentfulLoader
        preview={preview}
        entryQueries={entryQueries}
        render={(data) => {
          this.totalPage = Math.ceil(data.entries.matches[0].total / entryQueries.limit);
          return (
            <Blog
              baseUrl={`${baseUrl}`}
              blogPosts={data.entries.items}
              pageNo={page}
              handleSubmit={this.handleSubmit}
              totalPage={this.totalPage}
              preview={preview}
            />
          );
        }}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }
}

BlogLoader.defaultProps = {
  preview: false,
  limit: 10,
  page: 1,
};

BlogLoader.propTypes = {
  history: PT.shape().isRequired,
  baseUrl: PT.string.isRequired,
  id: PT.string.isRequired,
  limit: PT.number,
  page: PT.number,
  preview: PT.bool,
};

export default BlogLoader;
