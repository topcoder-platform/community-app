/**
 * Champions Component.  Renders the tracks in the event with all-time champions
 * and their number of wins.
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
  const championsData = data;
  const iconId = championsData.icon.sys.id;
  const listIds = _.map(championsData.list, item => (item.sys.id));
  let maxChampions = 0;
  let memberIds = [];
  return (
    <ContentfulLoader
      assetIds={iconId}
      entryIds={listIds}
      render={(result) => {
        // processs list
        for (let i = 0; i !== listIds.length; i += 1) {
          championsData.list[i].fields = result.entries.items[listIds[i]].fields;
        }
        // process icon
        championsData.icon.fields = result.assets.items[iconId].fields;
        const championIds = [];
        championsData.list.forEach((item) => {
          const { champion } = item.fields;
          if (champion) championIds.push(champion.sys.id);
        });
        const members = _.map(championsData.list, item => (item.fields.members));
        for (let i = 0; i !== members.length; i += 1) {
          memberIds = memberIds.concat(_.map(members[i], item => (item.sys.id)));
          if (maxChampions < members[i].length) {
            maxChampions = members[i].length;
          }
        }
        const entryIds = championIds.concat(memberIds);
        return (
          <ContentfulLoader
            entryIds={entryIds}
            render={(memberResult) => {
              // process members
              for (let i = 0; i !== members.length; i += 1) {
                for (let j = 0; j !== members[i].length; j += 1) {
                  championsData.list[i].fields.members[j]
                    .fields = memberResult.entries.items[members[i][j].sys.id].fields;
                }
              }
              // process champion
              for (let i = 0; i !== championIds.length; i += 1) {
                championsData.list[i].fields.champion
                  .fields = memberResult.entries.items[championIds[i]].fields;
              }
              return (
                <div className={styles.container}>
                  {
                    data.list.map(list => (
                      <Track
                        key={list.fields.track}
                        count={maxChampions}
                        data={getSingleTrackList(list.fields.track, data.list)}
                        theme={findTheme(list.fields.track)}
                        track={list.fields.track}
                        icon={data.icon.fields.file.url}
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

Champions.propTypes = {
  data: PT.shape().isRequired,
};

export default Champions;
