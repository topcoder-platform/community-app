/**
 * Champions Component.  Renders the tracks in the event with all-time champions
 * and their number of wins.
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
    case 'DEVELOPMENT':
    case 'FIRST2FINISH':
      return developmentAndFirst2finishTheme;
    case 'UI DESIGN':
    case 'UI PROTOTYPE':
    default:
      return uiDesignAndPrototypeTheme;
  }
}

const Champions = ({ data }) => {
  const maxChampions = _.max(_.map(data.list, track => (track.members.length)));
  return (
    <div className={styles.container}>
      {
        data.list.map(list => (
          <Track
            key={list.track}
            count={maxChampions}
            data={getSingleTrackList(list.track, data.list)}
            theme={findTheme(list.track)}
            track={list.track}
            icon={data.icon.file.url}
          />
        ))
      }
    </div>
  );
};

Champions.propTypes = {
  data: PT.shape().isRequired,
};

export default Champions;
