/**
 * Finalists Component.  Renders the tracks in the event with winners and lists of
 * finalists.
 */
import React from 'react';
import PT from 'prop-types';

import { getFinalistsMax } from 'utils/hall-of-fame';

import Track from './Track';

import algorithmAndMarathonTheme from './algorithmAndMarathon.scss';
import developmentAndFirst2finishTheme from './developmentAndFirst2finish.scss';
import uiDesignAndPrototypeTheme from './uiDesignAndPrototype.scss';
import styles from './styles.scss';

const Finalists = ({ data }) => {
  const maxFinalists = getFinalistsMax(data);

  return (
    <div className={styles.container}>
      <Track
        count={maxFinalists}
        data={data.algorithm}
        theme={algorithmAndMarathonTheme}
        track="ALGORITHM"
      />
      <Track
        count={maxFinalists}
        data={data.marathon}
        theme={algorithmAndMarathonTheme}
        track="MARATHON"
      />
      <Track
        count={maxFinalists}
        data={data.development}
        theme={developmentAndFirst2finishTheme}
        track="DEVELOPMENT"
      />
      <Track
        count={maxFinalists}
        data={data.first2finish}
        theme={developmentAndFirst2finishTheme}
        track="FIRST2FINISH"
      />
      <Track
        count={maxFinalists}
        data={data.uiDesign}
        theme={uiDesignAndPrototypeTheme}
        track="UI DESIGN"
      />
      <Track
        count={maxFinalists}
        data={data.uiPrototype}
        theme={uiDesignAndPrototypeTheme}
        track="UI PROTOTYPE"
      />
    </div>
  );
};

Finalists.propTypes = {
  data: PT.shape().isRequired,
};

export default Finalists;
