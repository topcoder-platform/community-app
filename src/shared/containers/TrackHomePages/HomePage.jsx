/**
 * Container for HomePage Component.
 * Connects redux state for Home Page of Track.
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import HomePage from 'components/TrackHomePages/HomePage';
import LoadingIndicator from 'components/LoadingIndicator';
import Error404 from 'components/Error404';
import ContentfulLoader from '../ContentfulLoader';


const HomePageContainer = ({ match, auth }) => (
  <ContentfulLoader
    entryQueries={{
      content_type: 'trackHomepage',
      'fields.track': match.params.track,
    }}
    render={(data) => {
      if (data.entries.matches[0].total > 0) {
        let homePage = data.entries.matches[0].items[0];
        if (!homePage) return null;
        const result = data.entries.items[homePage];
        homePage = result.fields;
        return (
          <ContentfulLoader
            preview={data.preview}
            render={() => (
              <HomePage
                homePage={homePage}
                auth={auth}
              />
            )}
            renderPlaceholder={LoadingIndicator}
          />
        );
      }
      return (<Error404 />);
    }}
    enderPlaceholder={LoadingIndicator}
  />
);

HomePageContainer.propTypes = {
  auth: PT.shape({
    profile: PT.shape(),
    tokenV3: PT.string,
    user: PT.shape(),
  }).isRequired,
  match: PT.shape({
    params: PT.shape({
      track: PT.string,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});


const Container = connect(mapStateToProps)(HomePageContainer);

export default withRouter(Container);
