/**
 * BlogFeed container.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import BlogFeed from 'components/Contentful/BlogFeed';
import rssActions from 'actions/rss';
import shortId from 'shortid';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

/* Holds 1 min in ms. */
const MIN = 60 * 1000;
const FEED_ID_PREFIX = 'feedFor';

class BlogFeedContainer extends React.Component {
  componentDidMount() {
    this.updateRssFeedData();
  }

  /*
  * Updates Rss feed data, if necessary.
  */
  updateRssFeedData() {
    const { rssFeedData, loadRssFeedData } = this.props;
    if (rssFeedData && Date.now() - rssFeedData.timestamp < 5 * MIN) return;
    loadRssFeedData();
  }

  render() {
    const {
      blogFeed,
      rssFeedData,
    } = this.props;

    return (
      rssFeedData && rssFeedData.data ? (
        <BlogFeed
          blogFeed={blogFeed}
          rssFeedData={rssFeedData}
        />
      ) : <LoadingIndicator />
    );
  }
}

BlogFeedContainer.propTypes = {
  blogFeed: PT.shape().isRequired,
  rssFeedData: PT.shape().isRequired,
  loadRssFeedData: PT.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { id } = ownProps.blogFeed.sys;
  const feedId = FEED_ID_PREFIX + id;
  return {
    rssFeedData: state.rss[feedId] || {},
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const rssAction = rssActions.rss;
  const { fields: { rssFeedUrl }, sys: { id } } = ownProps.blogFeed;
  const proxyUrl = `/community-app-assets/api/proxy-get?url=${
    encodeURIComponent(rssFeedUrl)
  }`;
  const feedId = FEED_ID_PREFIX + id;
  return {
    loadRssFeedData: () => {
      const uuid = shortId();
      dispatch(rssAction.getInit(feedId, uuid));
      dispatch(rssAction.getDone(feedId, uuid, proxyUrl));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogFeedContainer);
