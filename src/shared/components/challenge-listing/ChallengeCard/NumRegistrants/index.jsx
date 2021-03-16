/**
 * Registrants icon with count of registrants. Acts as the link to Registrants
 * tab of Challenge Details page (to Details tab, when there is no registrants
 * in the challenge yet). Shows a tooltip when hovered.
 */
import PT from 'prop-types';
import React from 'react';
import Tooltip from 'components/Tooltip';
import { TABS as DETAIL_TABS } from 'actions/page/challenge-details';
import { config, Link } from 'topcoder-react-utils';
import { COMPETITION_TRACKS } from 'utils/tc';

/* TODO: The icon should be converted back to SVG and imported using the
 * the standard approach for our code! */
import RegistrantsIcon from '../../Icons/RegistrantsIcon';

import './style.scss';

export default function NumRegistrants({
  challenge: {
    id, numOfRegistrants, track,
  },
  challengesUrl,
  newChallengeDetails,
  selectChallengeDetailsTab,
  openChallengesInNewTabs,
}) {
  let tip;
  const numOfReg = numOfRegistrants || 0;
  switch (numOfReg) {
    case 0: tip = 'No registrants'; break;
    case 1: tip = '1 total registrant'; break;
    default: tip = `${numOfReg} total registrants`;
  }
  const query = numOfReg ? `?tab=${DETAIL_TABS.REGISTRANTS}` : '';
  let link = `${challengesUrl}/${id}${query}`;
  if (!newChallengeDetails && track !== COMPETITION_TRACKS.DS) {
    link = `${config.URL.BASE}/challenge-details/${id}/?type=develop#viewRegistrant`;
  }
  return (
    <span styleName="container">
      <Tooltip
        content={(
          <div styleName="tooltip">
            {tip}
          </div>
        )}
      >
        <Link
          disabled={!numOfReg}
          onClick={() => (
            selectChallengeDetailsTab(numOfReg
              ? DETAIL_TABS.REGISTRANTS : DETAIL_TABS.DETAILS)
          )}
          styleName="link"
          to={link}
          openNewTab={openChallengesInNewTabs}
          aria-label={`Number of registrants ${numOfReg}`}
        >
          <RegistrantsIcon />
          <span styleName="number">
            {numOfReg}
          </span>
        </Link>
      </Tooltip>
    </span>
  );
}

NumRegistrants.defaultProps = {
  openChallengesInNewTabs: false,
};

NumRegistrants.propTypes = {
  challenge: PT.shape({
    id: PT.oneOfType([PT.number, PT.string]).isRequired,
    numOfRegistrants: PT.number,
    track: PT.string.isRequired,
  }).isRequired,
  challengesUrl: PT.string.isRequired,
  newChallengeDetails: PT.bool.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  openChallengesInNewTabs: PT.bool,
};
