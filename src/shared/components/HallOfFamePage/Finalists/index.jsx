/**
 * Finalists Component.  Renders the tracks in the event with winners and lists of
 * finalists.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { getSingleTrackList } from 'utils/hall-of-fame';
import ContentfulLoader from 'containers/ContentfulLoader';

import Track from './Track';

import algorithmAndMarathonTheme from './algorithmAndMarathon.scss';
import developmentAndFirst2finishTheme from './developmentAndFirst2finish.scss';
import uiDesignAndPrototypeTheme from './uiDesignAndPrototype.scss';
import styles from './styles.scss';

const CENTERED_CONTENT_MAX = 6;

/**
 * Return theme by track name
 * for good performance default condition uses design theme
 * when add new track ,just add new track name to switch condition
 * @param {string} track
 */
function findTheme(track) {
  switch (track) {
    case 'ALGORITHM':
    case 'MARATHON':
      return algorithmAndMarathonTheme;
    case 'ARCHITECTURE':
    case 'ASSEMBLY':
    case 'DEVELOPMENT':
    case 'FIRST2FINISH':
    case 'MOD DASH':
      return developmentAndFirst2finishTheme;
    case 'STUDIO':
    case 'UI DESIGN':
    case 'DESIGN':
    case 'UI PROTOTYPE':
    case 'SPECIFICATION':
    default:
      return uiDesignAndPrototypeTheme;
  }
}

const Finalists = ({ data }) => {
  const finalData = data;
  const championIds = _.map(finalData.data, item => (item.fields.champion.sys.id));
  const members = _.map(finalData.data, item => (item.fields.members));
  let memberIds = [];
  for (let i = 0; i !== members.length; i += 1) {
    memberIds = memberIds.concat(_.map(members[i], item => (item.sys.id)));
  }
  const entryIds = championIds.concat(memberIds);
  return (
    <ContentfulLoader
      entryIds={entryIds}
      render={(result) => {
        // process champion
        for (let i = 0; i !== championIds.length; i += 1) {
          finalData.data[i].fields.champion.fields = result.entries.items[championIds[i]].fields;
        }
        // process member
        for (let i = 0; i !== members.length; i += 1) {
          for (let j = 0; j !== members[i].length; j += 1) {
            finalData.data[i].fields.members[j].fields = result
              .entries.items[members[i][j].sys.id].fields;
          }
        }
        const imageIds = _.map(finalData.data, item => (item.fields.champion.fields.image.sys.id));
        return (
          <ContentfulLoader
            assetIds={imageIds}
            render={(imageResult) => {
              // process champion image
              for (let i = 0; i !== imageIds.length; i += 1) {
                finalData.data[i].fields.champion.fields.image
                  .fields = imageResult.assets.items[imageIds[i]].fields;
              }
              return (
                <div className={[styles.container, (finalData.data.length < CENTERED_CONTENT_MAX ? styles.centered : '')].join(' ')}>
                  {
                    finalData.data.map(list => (
                      <Track
                        key={list.fields.track}
                        data={getSingleTrackList(list.fields.track.toUpperCase(), finalData.data)}
                        theme={findTheme(list.fields.track.toUpperCase())}
                        track={list.fields.track.toUpperCase()}
                      />
                    ))
                  }
                </div>
              );
            }}
          />
        );
      }}
    />
  );
};

Finalists.propTypes = {
  data: PT.shape().isRequired,
};

export default Finalists;
