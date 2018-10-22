/**
 * Quote component.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';

import Countdown from 'components/Countdown';

/* Loads the countdown entry. */
export default function CountdownLoader(props) {
  const {
    id, preview, spaceName, environment,
  } = props;
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={data => (
        <Countdown
          title={data.entries.items[id].fields.title}
          end={new Date(data.entries.items[id].fields.endDate)}
        />
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

CountdownLoader.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

CountdownLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
