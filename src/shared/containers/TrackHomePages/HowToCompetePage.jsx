/**
 * Container for HowToCompetePage Component.
 * Connects redux state for How to Compete Page of Track.
 */

import React from 'react';
import PT from 'prop-types';
import { withRouter } from 'react-router-dom';
import HowToCompetePage from 'components/TrackHomePages/HowToCompetePage';
import LoadingIndicator from 'components/LoadingIndicator';
import Error404 from 'components/Error404';
import ContentfulLoader from '../ContentfulLoader';

const HowToCompetePageContainer = ({ match, location }) => (
  <ContentfulLoader
    entryQueries={{
      content_type: 'trackHowToCompete',
      'fields.track': match.params.track,
      include: 10,
    }}
    render={(data) => {
      if (data.entries.matches[0].total > 0) {
        let howToCompete = data.entries.matches[0].items[0];
        if (!howToCompete) return null;
        const result = data.entries.items[howToCompete];
        howToCompete = result.fields;
        howToCompete.includes = data.includes;
        return (
          <ContentfulLoader
            preview={data.preview}
            render={() => (
              <HowToCompetePage
                howToCompete={howToCompete}
                location={location}
              />
            )}
            renderPlaceholder={LoadingIndicator}
          />
        );
      }
      return (<Error404 />);
    }}
    renderPlaceholder={LoadingIndicator}
  />
);

HowToCompetePageContainer.propTypes = {
  match: PT.shape({
    params: PT.shape({
      track: PT.string,
    }),
  }).isRequired,
  location: PT.shape().isRequired,
};

export default withRouter(HowToCompetePageContainer);
