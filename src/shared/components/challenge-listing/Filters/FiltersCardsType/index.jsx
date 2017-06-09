/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * Challenge filters cards type.
 *
 */

import React from 'react';
import PT from 'prop-types';
import config from 'utils/config';
import './style.scss';

const FiltersCardsType = ({ isCardTypeSet, ARENA_URL }) => (
  <div styleName="cards-type-col">
    <a
      styleName={`${isCardTypeSet === 'Challenges' ? 'active' : ''}`}
      onClick={e => e.preventDefault()}
    >
      Challenges
    </a>
    <a
      href={ARENA_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      SRMs
    </a>
  </div>
);

FiltersCardsType.defaultProps = {
  isCardTypeSet: false,
  ARENA_URL: config.ARENA_URL,
};

FiltersCardsType.propTypes = {
  isCardTypeSet: PT.oneOfType([PT.bool, PT.string]),
  ARENA_URL: PT.string,
};

export default FiltersCardsType;
