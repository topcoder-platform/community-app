/**
 * Finalists Component.  Renders the tracks in the event with winners and lists of
 * finalists.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { getSingleTrackList } from 'utils/hall-of-fame';

import Track from './Track';

import algorithmAndMarathonTheme from './algorithmAndMarathon.scss';
import developmentAndFirst2finishTheme from './developmentAndFirst2finish.scss';
import uiDesignAndPrototypeTheme from './uiDesignAndPrototype.scss';
import styles from './styles.scss';

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
  const maxFinalists = _.max(_.map(data.data, track => (track.members.length)));

  return (
    <div className={styles.container}>
      {
        data.data.map(list => (
          <Track
            key={list.track}
            count={maxFinalists}
            data={getSingleTrackList(list.track.toUpperCase(), data.data)}
            theme={findTheme(list.track.toUpperCase())}
            track={list.track.toUpperCase()}
          />
        ))
      }
    </div>
  );
};

Finalists.propTypes = {
  data: PT.shape().isRequired,
};

export default Finalists;
