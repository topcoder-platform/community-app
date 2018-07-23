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
  const { id, preview } = props;
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
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
};

CountdownLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
};
