/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * Challenge filters cards type.
 *
 */

import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';

import './style.scss';

const FiltersCardsType = ({ hideSrm, isCardTypeSet }) => (
  <div styleName="cards-type-col">
    <h1
      styleName={`${isCardTypeSet === 'Challenges' ? 'active' : ''}`}
    >
Challenges
    </h1>
    {
      hideSrm ? null : (
        <a
          href={config.URL.ARENA}
          target="_blank"
          rel="noopener noreferrer"
        >
SRMs
        </a>
      )
    }
  </div>
);

FiltersCardsType.defaultProps = {
  isCardTypeSet: false,
};

FiltersCardsType.propTypes = {
  hideSrm: PT.bool.isRequired,
  isCardTypeSet: PT.oneOfType([PT.bool, PT.string]),
};

export default FiltersCardsType;
