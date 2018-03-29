/**
 * Registrants icon with count of registrants. Acts as the link to Registrants
 * tab of Challenge Details page (to Details tab, when there is no registrants
 * in the challenge yet). Shows a tooltip when hovered.
 */


import config from 'utils/config';
import PT from 'prop-types';
import React from 'react';
import Tooltip from 'components/Tooltip';
import { DETAIL_TABS } from 'actions/challenge';
import { Link } from 'topcoder-react-utils';

/* TODO: The icon should be converted back to SVG and imported using the
 * the standard approach for our code! */
import RegistrantsIcon from '../../Icons/RegistrantsIcon';

import './style.scss';

// This link use to marathon match in the future
// const MM_BASE_URL
//   = `${config.URL.COMMUNITY}/longcontest/?module=ViewReg&rd=`;


export default function NumRegistrants({ challenge: { id, numRegistrants, subTrack },
  challengesUrl, newChallengeDetails, selectChallengeDetailsTab }) {
  let tip;
  switch (numRegistrants) {
    case 0: tip = 'No registrants'; break;
    case 1: tip = '1 total registrant'; break;
    default: tip = `${numRegistrants} total registrants`;
  }
  const query = numRegistrants ? `?tab=${DETAIL_TABS.REGISTRANTS}` : '';
  // This link use to marathon match in the future
  // let link = subTrack === 'MARATHON_MATCH' ?
  // `${MM_BASE_URL}${challenge.roundId}` : `${challengesUrl}/${id}${query}`;
  let link = `${challengesUrl}/${id}${query}`;
  if (!newChallengeDetails && subTrack !== 'MARATHON_MATCH') {
    link = `${config.URL.BASE}/challenge-details/${id}/?type=develop#viewRegistrant`;
  }
  return (
    <span styleName="container">
      <Tooltip
        content={
          <div styleName="tooltip">{tip}</div>
        }
      >
        <Link
          disabled={!numRegistrants}
          onClick={() => (
            selectChallengeDetailsTab(
              numRegistrants ? DETAIL_TABS.REGISTRANTS : DETAIL_TABS.DETAILS,
            )
          )}
          styleName="link"
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
    rounds: PT.arrayOf(PT.object),
    track: PT.string.isRequired,
  }).isRequired,
  challengesUrl: PT.string.isRequired,
  newChallengeDetails: PT.bool.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
};
