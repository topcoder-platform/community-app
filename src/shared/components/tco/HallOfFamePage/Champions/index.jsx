/**
 * Champions Component.  Renders the tracks in the event with all-time champions
 * and their number of wins.
 */
import React from 'react';

import champions from 'utils/hall-of-fame/champions.json';

import Track from './Track';

import algorithmAndMarathonTheme from './algorithmAndMarathon.scss';
import developmentAndFirst2finishTheme from './developmentAndFirst2finish.scss';
import uiDesignAndPrototypeTheme from './uiDesignAndPrototype.scss';
import styles from './styles.scss';

const Champions = () => (
  <div className={styles.container}>
    <Track
      count={champions.maxCount}
      data={champions.algorithm}
      theme={algorithmAndMarathonTheme}
      track="ALGORITHM"
    />
    <Track
      count={champions.maxCount}
      data={champions.marathon}
      theme={algorithmAndMarathonTheme}
      track="MARATHON"
    />
    <Track
      count={champions.maxCount}
      data={champions.development}
      theme={developmentAndFirst2finishTheme}
      track="DEVELOPMENT"
    />
    <Track
      count={champions.maxCount}
      data={champions.first2finish}
      theme={developmentAndFirst2finishTheme}
      track="FIRST2FINISH"
    />
    <Track
      count={champions.maxCount}
      data={champions.uiDesign}
      theme={uiDesignAndPrototypeTheme}
      track="UI DESIGN"
    />
    <Track
      count={champions.maxCount}
      data={champions.uiPrototype}
      theme={uiDesignAndPrototypeTheme}
      track="UI PROTOTYPE"
    />
  </div>
);

export default Champions;
