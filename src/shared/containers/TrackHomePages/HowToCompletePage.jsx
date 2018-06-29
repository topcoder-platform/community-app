/**
 * Container for HowToCompletePage Component.
 * Connects redux state for How to Complete Page of Track.
 */

import React from 'react';
import PT from 'prop-types';
import { withRouter } from 'react-router-dom';
import HowToCompletePage from 'components/TrackHomePages/HowToCompletePage';
import LoadingIndicator from 'components/LoadingIndicator';
import Error404 from 'components/Error404';
import ContentfulLoader from '../ContentfulLoader';

const HowToCompletePageContainer = ({ match }) => (
  <ContentfulLoader
    entryQueries={{
      content_type: 'trackHowToCompete',
      'fields.track': match.params.track,
      include: 10,
    }}
    render={(data) => {
      if (data.entries.matches[0].total > 0) {
        let howToComplete = data.entries.matches[0].items[0];
        if (!howToComplete) return null;
        const result = data.entries.items[howToComplete];
        howToComplete = result.fields;
        howToComplete.includes = data.includes;
        return (
          <ContentfulLoader
            preview={data.preview}
            render={() => (
              <HowToCompletePage
                howToComplete={howToComplete}
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

HowToCompletePageContainer.propTypes = {
  match: PT.shape({
    params: PT.shape({
      track: PT.string,
    }),
  }).isRequired,
};

export default withRouter(HowToCompletePageContainer);
