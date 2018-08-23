/**
 * Video component.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import YouTubeVideo from 'components/YouTubeVideo';

/* Loads the video entry and render the YouTubeVideo component. */
export default function VideoLoader(props) {
  const {
    id, preview, spaceName, environment,
  } = props;
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={(data) => {
        const video = data.entries.items[id].fields;
        return (
          <YouTubeVideo
            autoplay={video.autoplay}
            showRelatedVideoSuggestions={video.showRelatedVideoSuggestions}
            src={video.source}
            title={video.title}
          />);
      }
        }
      renderPlaceholder={LoadingIndicator}
    />
  );
}

VideoLoader.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

VideoLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
