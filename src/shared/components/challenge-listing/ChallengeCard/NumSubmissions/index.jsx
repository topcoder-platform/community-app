/**
 * Submissions icon with count of submissions. Acts as the link to Submissions
 * tab of Challenge Details page (to Details tab, when there is no registrants
 * in the challenge yet). Shows a tooltip when hovered.
 */
import PT from 'prop-types';
import React from 'react';
import Tooltip from 'components/Tooltip';
import { TABS as DETAIL_TABS } from 'actions/page/challenge-details';
import { config, Link } from 'topcoder-react-utils';

/* TODO: The icon should be converted back to SVG and imported using the
 * the standard approach for our code! */
import SubmissionsIcon from '../../Icons/SubmissionsIcon';

import './style.scss';

export default function NumSubmissions({
  challenge: {
    id, numOfSubmissions, legacy,
  },
  challengesUrl,
  newChallengeDetails,
  selectChallengeDetailsTab,
  openChallengesInNewTabs,
  isLoggedIn,
}) {
  let tip;
  const numOfSub = numOfSubmissions || 0;
  switch (numOfSub) {
    case 0: tip = 'No submissions'; break;
    case 1: tip = '1 total submission'; break;
    default: tip = `${numOfSub} total submissions`;
  }

  const query = (numOfSub && isLoggedIn) ? `?tab=${DETAIL_TABS.SUBMISSIONS}` : '';
  const { track } = legacy;
  let link = `${challengesUrl}/${id}${query}`;
  if (!newChallengeDetails && track !== 'DATA_SCIENCE') {
    link = `${config.URL.BASE}/challenge-details/${id}/?type=develop#viewRegistrant`;
  }
  return (
    <div styleName="container">
      <Tooltip
        content={(
          <div styleName="tooltip">
            {tip}
          </div>
        )}
      >
        <Link
          onClick={() => (
            selectChallengeDetailsTab((numOfSub && isLoggedIn)
              ? DETAIL_TABS.SUBMISSIONS : DETAIL_TABS.DETAILS)
          )}
          styleName="link"
          to={link}
          openNewTab={openChallengesInNewTabs}
        >
          <SubmissionsIcon />
          <span styleName="number">
            {numOfSub}
          </span>
        </Link>
      </Tooltip>
    </div>
  );
}
NumSubmissions.defaultProps = {
  openChallengesInNewTabs: false,
};

NumSubmissions.propTypes = {
  challenge: PT.shape({
    id: PT.oneOfType([PT.number, PT.string]).isRequired,
    numOfSubmissions: PT.number,
    status: PT.string.isRequired,
    legacy: PT.shape({
      track: PT.string.isRequired,
    }),
  }).isRequired,
  challengesUrl: PT.string.isRequired,
  newChallengeDetails: PT.bool.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  openChallengesInNewTabs: PT.bool,
  isLoggedIn: PT.bool.isRequired,
};
