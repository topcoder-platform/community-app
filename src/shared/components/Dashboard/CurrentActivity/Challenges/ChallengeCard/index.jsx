import _ from 'lodash';
import config from 'utils/config';
import moment from 'moment';
import NumRegistrants from
  'components/challenge-listing/ChallengeCard/NumRegistrants';
import NumSubmissions from
  'components/challenge-listing/ChallengeCard/NumSubmissions';
import PT from 'prop-types';
import React from 'react';

import { Link } from 'topcoder-react-utils';

import {
  // DangerButton,
  DataScienceTrackTag,
  DataScienceTrackEventTag,
  DesignTrackTag,
  DesignTrackEventTag,
  DevelopmentTrackTag,
  DevelopmentTrackEventTag,
  PrimaryButton,
} from 'topcoder-react-ui-kit';

import style from './style.scss';

/* Holds day and hour range in ms. */
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const ALERT_TIME = 24 * HOUR_MS;

export default function ChallengeCard({
  challenge,
  selectChallengeDetailsTab,
  setChallengeListingFilter,
  // unregisterFromChallenge,
}) {
  const {
    currentPhases,
    forumId,
    id,
    registrationStartDate,
    status,
    subTrack,
    track,
    userDetails,
  } = challenge;

  let EventTag;
  let TrackTag;
  switch (track) {
    case 'DATA_SCIENCE':
      EventTag = DataScienceTrackEventTag;
      TrackTag = DataScienceTrackTag;
      break;
    case 'DESIGN':
      EventTag = DesignTrackEventTag;
      TrackTag = DesignTrackTag;
      break;
    case 'DEVELOP':
      EventTag = DevelopmentTrackEventTag;
      TrackTag = DevelopmentTrackTag;
      break;
    default:
  }

  const forumEndpoint = _.toLower(track) === 'design'
    ? `/?module=ThreadList&forumID=${forumId}`
    : `/?module=Category&categoryID=${forumId}`;

  const isTco = challenge.events
  && challenge.events.find(x => x.eventName.match(/tco\d{2}/));

  const roles = _.get(userDetails, 'roles') || [];

  const showDirectLink = _.intersection(roles, [
    'Approver',
    'Copilot',
  ]).length;

  const showOrLink = _.intersection(roles, [
    'Approver',
    'Copilot',
    'Reviewer',
  ]).length;

  const submitter = roles.includes('Submitter');
  // const submitted = userDetails.hasUserSubmittedForReview;
  let nextPhase = currentPhases && currentPhases[0];
  if (submitter && nextPhase && nextPhase.phaseType === 'Registration') {
    nextPhase = currentPhases[1];
  }

  let statusMsg;
  let deadlineMsg;
  let msgStyleModifier = '';
  const now = moment();
  if (nextPhase) {
    statusMsg = nextPhase.phaseType;
    const deadlineEnd = moment(nextPhase.scheduledEndTime);
    deadlineMsg = deadlineEnd.diff(now);
    const late = deadlineMsg <= 0;
    deadlineMsg = Math.abs(deadlineMsg);

    if (late) msgStyleModifier = ' alert';
    else if (deadlineMsg < 24 * 60 * 60 * 1000) msgStyleModifier = ' warning';

    let format;
    if (deadlineMsg > DAY_MS) format = 'D[d] H[h]';
    else if (deadlineMsg > HOUR_MS) format = 'H[h] m[min]';
    else format = 'm[min] s[s]';

    deadlineMsg = moment.duration(deadlineMsg).format(format);
    deadlineMsg = late ? `Late for ${deadlineMsg}` : `Ends in ${deadlineMsg}`;
  } else if (moment(registrationStartDate).isAfter(now)) {
    if (moment(registrationStartDate).diff(now) < ALERT_TIME) {
      msgStyleModifier = ' warning';
    }
    statusMsg = 'Scheduled';
  } else if (status === 'COMPLETED') {
    statusMsg = 'Completed';
  } else {
    msgStyleModifier = ' alert';
    statusMsg = 'Stalled';
  }

  return (
    <div styleName="container">
      <div>
        <div styleName="header">
          <div styleName="tags">
            <TrackTag
              onClick={() =>
                setImmediate(() =>
                  setChallengeListingFilter({ subtracks: [subTrack] }),
                )
              }
              to={`/challenges?filter[subtracks][0]=${
                encodeURIComponent(subTrack)}`}
            >{_.startCase(_.toLower(challenge.subTrack))}</TrackTag>
            {
              isTco ? (
                <EventTag
                  openNewTab
                  to="https://tco18.topcoder.com"
                >TCO</EventTag>
              ) : null
            }
          </div>
          <Link
            styleName="title"
            to={`/challenges/${challenge.id}`}
          >{challenge.name}</Link>
        </div>
        <div styleName="challengeTabLinks">
          <NumRegistrants
            challenge={challenge}
            challengesUrl="/challenges"
            newChallengeDetails
            selectChallengeDetailsTab={selectChallengeDetailsTab}
          />
          <NumSubmissions
            challenge={challenge}
            challengesUrl="/challenges"
            newChallengeDetails
            selectChallengeDetailsTab={selectChallengeDetailsTab}
          />
          <Link
            openNewTab
            styleName="forumLink"
            to={`${config.URL.FORUMS}${forumEndpoint}`}
          >Forum</Link>
        </div>
      </div>
      <div>
        <div styleName="statusPanel">
          <h3 styleName={`statusMsg${msgStyleModifier}`}>{statusMsg}</h3>
          <div styleName={`deadlineMsg${msgStyleModifier}`}>
            {deadlineMsg}
          </div>
          {
            showDirectLink ? (
              <PrimaryButton
                openNewTab
                size="sm"
                theme={{ button: style.button }}
                to={`${config.URL.BASE}/direct/contest/detail.action?projectId=${id}`}
              >Direct</PrimaryButton>
            ) : null
          }
          {
            showOrLink ? (
              <PrimaryButton
                openNewTab
                size="sm"
                theme={{ button: style.button }}
                to={`${config.URL.ONLINE_REVIEW}/review/actions/ViewProjectDetails?method=viewProjectDetails&pid=${id}`}
              >Online Review</PrimaryButton>
            ) : null
          }
          {
            submitter ? (
              <PrimaryButton
                size="sm"
                theme={{ button: style.button }}
                to={`/challenges/${id}/submit`}
              >Submit</PrimaryButton>
            ) : null
          }
          {
            /*
            submitter && !submitted ? (
              <DangerButton
                disabled
                size="sm"
                theme={{ button: style.button }}
                onClick={() => unregisterFromChallenge(id)}
              >Unregister</DangerButton>
            ) : null
            */
          }
        </div>
        <div styleName="roles">{roles.join(', ')}</div>
      </div>
    </div>
  );
}

ChallengeCard.propTypes = {
  challenge: PT.shape({
    forumId: PT.number.isRequired,
    id: PT.number.isRequired,
    name: PT.string.isRequired,
    track: PT.oneOf(['DATA_SCIENCE', 'DESIGN', 'DEVELOP']).isRequired,
  }).isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  // unregisterFromChallenge: PT.func.isRequired,
};
