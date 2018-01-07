/**
 * Container for the Learn page of Blockchain community.
 */

import LearnPage from 'components/tc-communities/communities/blockchain/Learn';
import rssActions from 'actions/rss';
import PT from 'prop-types';
import React from 'react';
import shortId from 'shortid';

import { connect } from 'react-redux';

/* Holds 1 min in ms. */
const MIN = 60 * 1000;

const CONSENSYS_RSS_ID = 'ConsenSys';
const CONSENSYS_RSS_URL = `/community-app-assets/api/proxy-get?url=${
  encodeURIComponent('https://medium.com/feed/@ConsenSys')
}`;

const TOPCODER_BLOCKCHAIN_BLOG_RSS_ID = 'TopcoderBlockchainBlog';
const TOPCODER_BLOCKCHAIN_BLOG_RSS_URL =
`/community-app-assets/api/proxy-get?url=${
  encodeURIComponent('https://www.topcoder.com/blog/tag/blockchain/feed/')
}`;

class LearnPageContainer extends React.Component {
  componentDidMount() {
    this.updateConsenSysRss();
    this.updateTopcoderBlockchainBlogRss();
  }

  /**
   * Updates ConsenSys blog feed RSS, if necessary.
   */
  updateConsenSysRss() {
    const { consenSysRss, loadConsenSysRss } = this.props;
    if (consenSysRss && Date.now() - consenSysRss.timestamp < 5 * MIN) return;
    loadConsenSysRss();
  }

  /**
   * Updates Topcoder Blog feed, if necessary.
   */
  updateTopcoderBlockchainBlogRss() {
    const {
      topcoderBlockchainBlogRss,
      loadTopcoderBlockchainBlogRss,
    } = this.props;
    if (topcoderBlockchainBlogRss
    && Date.now() - topcoderBlockchainBlogRss.timestamp < 5 * MIN) return;
    loadTopcoderBlockchainBlogRss();
  }

  render() {
    const {
      baseUrl,
      consenSysRss,
      topcoderBlockchainBlogRss,
    } = this.props;
    return (
      <LearnPage
        baseUrl={baseUrl}
        consenSysRss={consenSysRss}
        topcoderBlockchainBlogRss={topcoderBlockchainBlogRss}
      />
    );
  }
}

LearnPageContainer.defaultProps = {
  consenSysRss: null,
  topcoderBlockchainBlogRss: null,
};

LearnPageContainer.propTypes = {
  baseUrl: PT.string.isRequired,
  consenSysRss: PT.shape({
    data: PT.object,
    loadingUuid: PT.string.isRequired,
    timestamp: PT.number.isRequired,
  }),
  loadConsenSysRss: PT.func.isRequired,
  loadTopcoderBlockchainBlogRss: PT.func.isRequired,
  topcoderBlockchainBlogRss: PT.shape({
    data: PT.object,
    loadingUuid: PT.string.isRequired,
    timestamp: PT.number.isRequired,
  }),
};

function mapStateToProps(state, ownProps) {
  return {
    baseUrl: ownProps.baseUrl,
    consenSysRss: state.rss.ConsenSys,
    topcoderBlockchainBlogRss: state.rss.TopcoderBlockchainBlog,
  };
}

function mapDispatchToProps(dispatch) {
  const a = rssActions.rss;
  return {
    loadConsenSysRss: () => {
      const uuid = shortId();
      dispatch(a.getInit(CONSENSYS_RSS_ID, uuid));
      dispatch(a.getDone(CONSENSYS_RSS_ID, uuid, CONSENSYS_RSS_URL));
    },
    loadTopcoderBlockchainBlogRss: () => {
      const uuid = shortId();
      dispatch(a.getInit(TOPCODER_BLOCKCHAIN_BLOG_RSS_ID, uuid));
      dispatch(a.getDone(TOPCODER_BLOCKCHAIN_BLOG_RSS_ID, uuid, TOPCODER_BLOCKCHAIN_BLOG_RSS_URL));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LearnPageContainer);
