/**
 * Community content container component.
 *
 * It renders community page content depend on the pageId
 * There are two kind of pages:
 *    - typical pages like leaderboard and challenges which has same relative url
 *      for all communities, these are kind of reserved pageId
 *    - also there could be pages created by a landing page editor with arbitrary pageId
 *      renderCustomPage() method has to return a page made in the editor
 */

import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from 'components/LoadingIndicator';
import ChallengeListing from 'containers/ChallengeListing';
import Leaderboard from 'containers/Leaderboard';
import WiproHome from 'components/tc-communities/communities/wipro/Home';
import WiproAbout from 'components/tc-communities/communities/wipro/About';
import { Redirect } from 'react-router-dom';

// The container component
class ContentContainer extends React.Component {
  /**
   * Returns custom page content which is created by landing page editor
   *
   * TODO: as editor is not implemented yet, this method returns static
   *       mock pages. It has to be rewritten when landing page editor is available
   */
  renderCustomPage() {
    let pageContent;

    // as for now landing page editor is not implemented yet
    // for Wipro community we return static pages
    // TODO: this have to be removed when editor implemented
    if (this.props.loadedCommunityId === 'wipro') {
      if (this.props.pageId === 'home') {
        pageContent = <WiproHome />;
      } else if (this.props.pageId === 'about') {
        pageContent = <WiproAbout />;
      }
    }

    // if page it not found redirect to 404
    if (!pageContent) {
      pageContent = <Redirect to={{ pathname: '/404' }} />;
    }

    return pageContent;
  }

  /**
   * Returns community page content depend on the pageId
   * There are two kind of pages:
   *   - typical pages like leaderboard and challenges which has same relative url
   *     for all challenges, these are kind of reserved pageId
   *   - also there could be pages created by a landing page editor with arbitrary pageId
   *     renderCustomPage() method has to return a page made in the editor
   */
  renderPageContent() {
    let pageContent = <div />;

    switch (this.props.pageId) {
      case 'leaderboard':
        pageContent = (<Leaderboard
          apiUrl={this.props.leaderboardApiUrl}
        />);
        break;
      case 'challenges':
        pageContent = (<ChallengeListing
          tag="JavaScript"
          history={this.props.history}
          location={this.props.location}
        />);
        break;
      default:
        pageContent = this.renderCustomPage();
        break;
    }

    return pageContent;
  }

  render() {
    // is community meta information loaded for current community
    const isLoaded = (this.props.loadedCommunityId === this.props.communityId)
      && !this.props.isLoading;

    return (
      !isLoaded ? (
        <LoadingIndicator />
      ) : (
        <div>
          {/*
            Include styles for static pages of the Wipro here for all community pages
            We do it here for all pages and not in corresponding page components to make them load
            once for the community to avoid unstyled flash when we navigate
            between pages of one community.
            We do it to make demo looks more tidy.
            TODO: remove these style when we don't need static Home about About page examples
          */}
          {/* eslint-disable max-len */}
          <link
            rel="stylesheet"
            type="text/css"
            href="http://topgear.tcmini.wpengine.com/wp-content/themes/nokia/bower_components/bootstrap/dist/css/bootstrap.min.css?ver=4.7.4"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="http://topgear.tcmini.wpengine.com/wp-content/themes/nokia/css/styles.css?v=20170307&#038;ver=4.7.4"
          />
          {/* eslint-enable max-len */}
          {this.renderPageContent()}
        </div>
      )
    );
  }
}

ContentContainer.defaultProps = {
  isLoading: false,
  loadedCommunityId: null,
  leaderboardApiUrl: null,
};

ContentContainer.propTypes = {
  isLoading: PT.bool,
  loadedCommunityId: PT.string,
  leaderboardApiUrl: PT.string,
  communityId: PT.string.isRequired,
  pageId: PT.string.isRequired,
  history: PT.shape().isRequired,
  location: PT.shape().isRequired,
};

const mapStateToProps = (state, props) => ({
  isLoading: state.tcCommunities.meta.loading,
  leaderboardApiUrl: state.tcCommunities.meta.leaderboardApiUrl,
  loadedCommunityId: state.tcCommunities.meta.communityId,
  communityId: props.match.params.communityId,
  pageId: props.match.params.pageId,
});

export default connect(
  mapStateToProps,
)(ContentContainer);
