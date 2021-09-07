/**
 * Container for blog feed.
 */

import BlogFeed from 'components/Dashboard/BlogFeed';
import PT from 'prop-types';
import React from 'react';
import actions from 'actions/blog';
import { connect } from 'react-redux';


class BlogFeedContainer extends React.Component {
  componentDidMount() {
    const {
      getBlogs,
      blogs,
      itemCount,
    } = this.props;

    // This gets articles.
    if (!blogs || blogs.length === 0) {
      getBlogs({
        limit: itemCount,
      });
    }
  }

  render() {
    const {
      blogs,
      theme,
      loading,
    } = this.props;

    return (
      <BlogFeed blogs={blogs} theme={theme} loading={loading} />
    );
  }
}

BlogFeedContainer.defaultProps = {
  itemCount: 5,
  blogs: [],
  loading: true,
  theme: 'light',
};

BlogFeedContainer.propTypes = {
  blogs: PT.oneOfType([PT.arrayOf(PT.shape()), PT.shape]),
  itemCount: PT.number,
  getBlogs: PT.func.isRequired,
  loading: PT.bool,
  theme: PT.oneOf(['dark', 'light']),
};

function mapStateToProps(state) {
  const data = state.blog;
  return {
    blogs: data ? data.communityStories : [],
    loading: data ? data.communityStoriesLoading : true,
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.blog;
  return {
    getBlogs: (ownProps) => {
      dispatch(a.getCommunityStoriesInit());
      dispatch(a.getCommunityStoriesDone(ownProps));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlogFeedContainer);
