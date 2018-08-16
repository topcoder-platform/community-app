/**
 * Container for HallOfFamePage Component.
 * Connects redux state for TCO Hall of Fame.
 */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import React from 'react';
import PT from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import Error404 from 'components/Error404';
import HoF from './HoF';

export default function HallOfFameContainer({ match }) {
  const { eventId: selectedEvent, type: selectedEventType } = match.params;

  return (
    <ContentfulLoader
      entryQueries={{
        content_type: 'hallOfFame',
        'fields.title': selectedEventType,
        include: 10,
      }}
      render={(data) => {
        if (data.entries.matches[0].total > 0) {
          let hallOfFame = data.entries.matches[0].items[0];
          if (!hallOfFame) return null;
          const result = data.entries.items[hallOfFame];
          hallOfFame = result.fields;
          const verionsIds = _.map(hallOfFame.versions, item => (item.sys.id));
          return (
            <ContentfulLoader
              entryIds={verionsIds}
              preview={data.preview}
              render={(verionResult) => {
                for (let i = 0; i !== verionsIds.length; i += 1) {
                  hallOfFame.versions[i].fields = verionResult
                    .entries.items[verionsIds[i]].fields;
                }
                return (
                  <HoF
                    eventId={
                      selectedEvent || hallOfFame.versions[0].fields.versionId
                    }
                    hallOfFame={hallOfFame}
                  />
                );
              }}
              renderPlaceholder={LoadingIndicator}
            />
          );
        }
        return (<Error404 />);
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

HallOfFameContainer.propTypes = {
  match: PT.shape({
    params: PT.shape({
      eventId: PT.string,
      type: PT.string,
    }),
  }).isRequired,
};
