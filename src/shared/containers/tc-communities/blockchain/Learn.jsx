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

class LearnPageContainer extends React.Component {
  componentDidMount() {
    this.updateConsenSysRss();
  }

  /**
   * Updates ConsenSys blog feed RSS, if necessary.
   */
  updateConsenSysRss() {
    const { consenSysRss, loadConsenSysRss } = this.props;
    if (consenSysRss && Date.now() - consenSysRss.timestamp < 5 * MIN) return;
    loadConsenSysRss();
  }

  render() {
    const {
      consenSysRss,
    } = this.props;
    return (
      <LearnPage
        consenSysRss={consenSysRss}
      />
    );
  }
}

LearnPageContainer.defaultProps = {
  consenSysRss: null,
};

LearnPageContainer.propTypes = {
  consenSysRss: PT.shape({
    data: PT.object,
    loadingUuid: PT.string.isRequired,
    timestamp: PT.number.isRequired,
  }),
  loadConsenSysRss: PT.func.isRequired,
};

function mapStateToProps(state) {
  return {
    consenSysRss: state.rss.ConsenSys,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LearnPageContainer);
