/**
 * Submissions icon with count of submissions. Acts as the link to Submissions
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
import SubmissionsIcon from '../../Icons/SubmissionsIcon';

import './style.scss';

export default function NumSubmissions({
  challenge: {
    componentId,
    contestId,
    id,
    isLegacy,
    numSubmissions,
    roundId,
    status,
    subTrack,
  },
  challengesUrl,
  selectChallengeDetailsTab,
}) {
  let tip;
  switch (numSubmissions) {
    case 0: tip = 'No submissions'; break;
    case 1: tip = '1 total submission'; break;
    default: tip = `${numSubmissions} total submissions`;
  }

  const query = numSubmissions && status === 'COMPLETED'
    ? `?tab=${DETAIL_TABS.SUBMISSIONS}` : '';

  let link = `${challengesUrl}/${id}${query}`;

  if (subTrack === 'MARATHON_MATCH' && isLegacy) {
    link = `${config.URL.COMMUNITY}/longcontest/?module=Submit&rd=${
      roundId}&compid=${componentId}&cd=${contestId}`;
  }

  return (
    <div styleName="container">
      <Tooltip
        content={
          <div styleName="tooltip">{tip}</div>
        }
      >
        <Link
          forceA={subTrack === 'MARATHON_MATCH' && isLegacy}
          onClick={() => (
            selectChallengeDetailsTab(
              numSubmissions ? DETAIL_TABS.SUBMISSIONS : DETAIL_TABS.DETAILS,
            )
          )}
          styleName="link"
          to={link}
        >
          <SubmissionsIcon />
          <span styleName="number">{numSubmissions}</span>
        </Link>
      </Tooltip>
    </div>
  );
}

NumSubmissions.propTypes = {
  challenge: PT.shape({
    id: PT.oneOfType([PT.number, PT.string]).isRequired,
    numSubmissions: PT.number.isRequired,
    rounds: PT.arrayOf(PT.object),
    status: PT.string.isRequired,
    track: PT.string.isRequired,
  }).isRequired,
  challengesUrl: PT.string.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
};
