/**
 * Registrants icon with count of registrants. Acts as the link to Registrants
 * tab of Challenge Details page (to Details tab, when there is no registrants
 * in the challenge yet). Shows a tooltip when hovered.
 */

import _ from 'lodash';
import config from 'utils/config';
import PT from 'prop-types';
import React from 'react';
import Tooltip from 'components/Tooltip';
import { DETAIL_TABS } from 'actions/challenge';
import { Link } from 'utils/router';

/* TODO: The icon should be converted back to SVG and imported using the
 * the standard approach for our code! */
import RegistrantsIcon from '../../Icons/RegistrantsIcon';

import './style.scss';

const ID_LENGTH = 6;
const MM_BASE_URL
  = `${config.URL.COMMUNITY}/longcontest/?module=ViewRegistrants&rd=`;

export default function NumRegistrants({
  challenge: { id, numRegistrants, track },
  selectChallengeDetailsTab,
}) {
  let tip;
  switch (numRegistrants) {
    case 0: tip = 'No registrants'; break;
    case 1: tip = '1 total registrant'; break;
    default: tip = `${numRegistrants} total registrants`;
  }
  const query = numRegistrants ? `?tab=${DETAIL_TABS.REGISTRANTS}` : '';
  const link = track === 'DATA_SCIENCE' && _.toString(id).length < ID_LENGTH
    ? `${MM_BASE_URL}${id}` : `/challenges/${id}${query}`;
  return (
    <span styleName="container">
      <Tooltip
        content={
          <div styleName="tooltip">{tip}</div>
        }
      >
        <Link
          onClick={() => (
            numRegistrants
              ? selectChallengeDetailsTab(DETAIL_TABS.REGISTRANTS) : null
          )}
          to={link}
        >
          <RegistrantsIcon />
          <span styleName="number">{numRegistrants}</span>
        </Link>
      </Tooltip>
    </span>
  );
}

NumRegistrants.propTypes = {
  challenge: PT.shape({
    id: PT.oneOfType([PT.number, PT.string]).isRequired,
    numRegistrants: PT.number.isRequired,
    track: PT.string.isRequired,
  }).isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
};
