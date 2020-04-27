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
    id, numOfSubmissions, track,
  },
  challengesUrl,
  newChallengeDetails,
  selectChallengeDetailsTab,
  openChallengesInNewTabs,
}) {
  let tip;
  switch (numOfSubmissions) {
    case 0: tip = 'No submissions'; break;
    case 1: tip = '1 total submission'; break;
    default: tip = `${numOfSubmissions} total submissions`;
  }
  const query = numOfSubmissions ? `?tab=${DETAIL_TABS.SUBMISSIONS}` : '';
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
            selectChallengeDetailsTab(numOfSubmissions
              ? DETAIL_TABS.SUBMISSIONS : DETAIL_TABS.DETAILS)
          )}
          styleName="link"
          to={link}
          openNewTab={openChallengesInNewTabs}
        >
          <SubmissionsIcon />
          <span styleName="number">
            {numOfSubmissions}
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
    track: PT.string.isRequired,
  }).isRequired,
  challengesUrl: PT.string.isRequired,
  newChallengeDetails: PT.bool.isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  openChallengesInNewTabs: PT.bool,
};
