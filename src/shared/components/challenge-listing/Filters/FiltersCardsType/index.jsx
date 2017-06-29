/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * Challenge filters cards type.
 *
 */

import React from 'react';
import PT from 'prop-types';
import config from 'utils/config';
import './style.scss';

const FiltersCardsType = ({ isCardTypeSet }) => (
  <div styleName="cards-type-col">
    <a
      styleName={`${isCardTypeSet === 'Challenges' ? 'active' : ''}`}
      onClick={e => e.preventDefault()}
    >Challenges</a>
    <a
      href={config.URL.ARENA}
      target="_blank"
      rel="noopener noreferrer"
    >SRMs</a>
  </div>
);

FiltersCardsType.defaultProps = {
  isCardTypeSet: false,
};

FiltersCardsType.propTypes = {
  isCardTypeSet: PT.oneOfType([PT.bool, PT.string]),
};

export default FiltersCardsType;
