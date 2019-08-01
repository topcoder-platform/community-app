import _ from 'lodash';
import moment from 'moment';
import 'moment-duration-format';
import NumRegistrants from
  'components/challenge-listing/ChallengeCard/NumRegistrants';
import NumSubmissions from
  'components/challenge-listing/ChallengeCard/NumSubmissions';
import PT from 'prop-types';
import React from 'react';

import { config, Link } from 'topcoder-react-utils';

import {
  Button,
  // DangerButton,
  // DataScienceTrackTag,
  DataScienceTrackEventTag,
  // DesignTrackTag,
  DesignTrackEventTag,
  // DevelopmentTrackTag,
  DevelopmentTrackEventTag,
} from 'topcoder-react-ui-kit';

import style from './style.scss';

/* Holds day and hour range in ms. */
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const ALERT_TIME = 24 * HOUR_MS;

function normalizeSubTrackTagForRendering(subTrack) {
  let x;
  switch (subTrack) {
    case 'WEB_DESIGNS': x = 'Web Design'; break;
    default: x = subTrack;
  }
  return _.startCase(_.toLower(x));
}

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
  // let TrackTag;
  switch (track) {
    case 'DATA_SCIENCE':
      EventTag = DataScienceTrackEventTag;
      // TrackTag = DataScienceTrackTag;
      break;
    case 'DESIGN':
      EventTag = DesignTrackEventTag;
      // TrackTag = DesignTrackTag;
      break;
    case 'DEVELOP':
      EventTag = DevelopmentTrackEventTag;
      // TrackTag = DevelopmentTrackTag;
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

  let showOrLink = _.intersection(roles, [
    'Approver',
    'Copilot',
    'Reviewer',
  ]).length;

  const submitter = roles.includes('Submitter');
  const submitted = _.get(userDetails, 'hasUserSubmittedForReview');
  const nextPhase = currentPhases && _.last(currentPhases);

  const nextPhaseType = _.get(nextPhase, 'phaseType');

  if (submitted && _.intersection(nextPhaseType, [
    'Appeals',
    'Appeal Response',
  ]).length) showOrLink = true;

  const submissionOpen = nextPhaseType === 'Submission';

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
    else if (deadlineMsg < ALERT_TIME) msgStyleModifier = ' warning';

    let format;
    if (deadlineMsg > DAY_MS) format = 'D[d] H[h]';
    else if (deadlineMsg > HOUR_MS) format = 'H[h] m[min]';
    else format = 'm[min] s[s]';

    deadlineMsg = moment.duration(deadlineMsg).format(format);
    deadlineMsg = late ? `Late for ${deadlineMsg}` : `Ends in ${deadlineMsg}`;
  } else if (moment(registrationStartDate).isAfter(now)) {
    deadlineMsg = moment(registrationStartDate).diff(now);
    const late = deadlineMsg <= 0;
    deadlineMsg = Math.abs(deadlineMsg);

    if (late) msgStyleModifier = ' alert';
    else if (deadlineMsg < ALERT_TIME) msgStyleModifier = ' warning';

    let format;
    if (deadlineMsg > DAY_MS) format = 'D[d] H[h]';
    else if (deadlineMsg > HOUR_MS) format = 'H[h] m[min]';
    else format = 'm[min] s[s]';

    deadlineMsg = moment.duration(deadlineMsg).format(format);
    deadlineMsg = late ? `Late by ${deadlineMsg}` : `Starts in ${deadlineMsg}`;

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
            <EventTag
              onClick={
                () => setImmediate(
                  () => setChallengeListingFilter({ subtracks: [subTrack] }),
                )
              }
              theme={{ button: style.tag }}
              to={`/challenges?filter[subtracks][0]=${
                encodeURIComponent(subTrack)}`}
            >
              {normalizeSubTrackTagForRendering(challenge.subTrack)}
            </EventTag>
            {
              isTco ? (
                <EventTag
                  openNewTab
                  theme={{ button: style.tag }}
                  to="https://tco18.topcoder.com"
                >
TCO
                </EventTag>
              ) : null
            }
          </div>
          <Link
            styleName="title"
            to={`/challenges/${challenge.id}`}
          >
            {challenge.name}
          </Link>
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
          >
Forum
          </Link>
        </div>
        <div styleName="statusPanel">
          <h3 styleName={`statusMsg${msgStyleModifier}`}>
            {statusMsg}
          </h3>
          <div styleName={`deadlineMsg${msgStyleModifier}`}>
            {deadlineMsg}
          </div>
          {
            showDirectLink ? (
              <Button
                openNewTab
                size="sm"
                theme={{ button: style.button }}
                to={`${config.URL.BASE}/direct/contest/detail.action?projectId=${id}`}
              >
Direct
              </Button>
            ) : null
          }
          {
            showOrLink ? (
              <Button
                openNewTab
                size="sm"
                theme={{ button: style.button }}
                to={`${config.URL.ONLINE_REVIEW}/review/actions/ViewProjectDetails?method=viewProjectDetails&pid=${id}`}
              >
Online Review
              </Button>
            ) : null
          }
          {
            submitter && submissionOpen ? (
              <Button
                size="sm"
                theme={{ button: style.button }}
                to={`/challenges/${id}/submit`}
              >
Submit
              </Button>
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
      </div>
      <div>
        <div styleName="roles">
          {roles.join(', ')}
        </div>
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
    currentPhases: PT.any,
    registrationStartDate: PT.any,
    status: PT.any,
    userDetails: PT.any,
    events: PT.any,
    subTrack: PT.string.isRequired,
  }).isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  // unregisterFromChallenge: PT.func.isRequired,
};
