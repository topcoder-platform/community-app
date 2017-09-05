/**
 * Submissions icon with count of submissions. Acts as the link to Submissions
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
import SubmissionsIcon from '../../Icons/SubmissionsIcon';

import './style.scss';

const ID_LENGTH = 6;
const MM_BASE_URL
  = `${config.URL.COMMUNITY}/longcontest/?module=ViewStandings&rd=`;

export default function NumSubmissions({
  challenge: { id, numSubmissions, track },
  selectChallengeDetailsTab,
}) {
  let tip;
  switch (numSubmissions) {
    case 0: tip = 'No submissions'; break;
    case 1: tip = '1 total submission'; break;
    default: tip = `${numSubmissions} total submissions`;
  }
  const query = numSubmissions ? `?tab=${DETAIL_TABS.SUBMISSIONS}` : '';
  const link = track === 'DATA_SCIENCE' && _.toString(id).length < ID_LENGTH
    ? `${MM_BASE_URL}${id}` : `/challenges/${id}${query}`;
  return (
    <div styleName="container">
      <Tooltip
        content={
          <div styleName="tooltip">{tip}</div>
        }
      >
        <Link
          onClick={() => (
            selectChallengeDetailsTab(
              numSubmissions ? DETAIL_TABS.SUBMISSIONS : DETAIL_TABS.DETAILS,
            )
          )}
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
    track: PT.string.isRequired,
  }).isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
};
