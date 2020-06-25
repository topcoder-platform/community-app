import _ from 'lodash';
import moment from 'moment';
import 'moment-duration-format';
import NumRegistrants from
  'components/challenge-listing/ChallengeCard/NumRegistrants';
import NumSubmissions from
  'components/challenge-listing/ChallengeCard/NumSubmissions';
import PT from 'prop-types';
import React from 'react';
import {
  getTimeLeft,
} from 'utils/challenge-detail/helper';

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
  userResources,
  challengeSubtracksMap,
}) {
  const {
    phases,
    legacy,
    id,
    status,
    userDetails,
    type,
  } = challenge;

  let subTrackId = _.findKey(challengeSubtracksMap, { description: type });

  if (!subTrackId) {
    subTrackId = _.findKey(challengeSubtracksMap, { description: 'Code' });
  }

  const { track } = legacy;

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
      EventTag = DevelopmentTrackEventTag;
  }

  const STALLED_MSG = 'Stalled';
  const DRAFT_MSG = 'In Draft';

  const forumEndpoint = _.toLower(legacy.track) === 'design'
    ? `/?module=ThreadList&forumID=${legacy.forumId}`
    : `/?module=Category&categoryID=${legacy.forumId}`;

  const isTco = challenge.events
  && challenge.events.find(x => x.eventName && x.eventName.match(/tco\d{2}/));

  const roles = _.get(userDetails, 'roles') || [];
  const role = _.find(userResources, { id }) || {};

  const showDirectLink = _.intersection(roles, [
    'Approver',
    'Copilot',
  ]).length;

  let showOrLink = _.intersection(roles, [
    'Approver',
    'Copilot',
    'Reviewer',
  ]).length;

  const submitter = role.name === 'Submitter';
  const submitted = _.get(userDetails, 'hasUserSubmittedForReview');
  const nextPhase = phases && _.last(phases);

  const nextPhaseType = _.get(nextPhase, 'phaseType');

  if (submitted && _.intersection(nextPhaseType, [
    'Appeals',
    'Appeal Response',
  ]).length) showOrLink = true;

  const isChallengeOpen = status === 'Active';

  const allPhases = phases || [];
  let statusPhase = allPhases
    .filter(p => p.name !== 'Registration' && p.isOpen)
    .sort((a, b) => moment(a.scheduledEndDate).diff(b.scheduledEndDate))[0];

  if (!statusPhase && type === 'FIRST_2_FINISH' && allPhases.length) {
    statusPhase = _.clone(allPhases[0]);
    statusPhase.name = 'Submission';
  }

  let phaseMessage = STALLED_MSG;
  if (statusPhase) phaseMessage = statusPhase.name;
  else if (status === 'Draft') phaseMessage = DRAFT_MSG;

  let msgStyleModifier = '';
  const now = moment();
  const deadlineEnd = moment(nextPhase.scheduledEndDate);
  const late = deadlineEnd.diff(now) <= 0;
  const statusMsg = phaseMessage;
  const deadlineMsg = getTimeLeft(statusPhase, 'to go').text;

  if (late || phaseMessage === STALLED_MSG) msgStyleModifier = ' alert';

  return (
    <div styleName="container">
      <div>
        <div styleName="header">
          <div styleName="tags">
            <EventTag
              onClick={
                () => setImmediate(
                  () => setChallengeListingFilter({ subtracks: [subTrackId] }),
                )
              }
              theme={{ button: style.tag }}
              to={`/challenges?filter[subtracks][0]=${
                encodeURIComponent(subTrackId)}`}
            >
              {normalizeSubTrackTagForRendering(type)}
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
            submitter && isChallengeOpen && phaseMessage !== STALLED_MSG ? (
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
          { role.name }
        </div>
      </div>
    </div>
  );
}

ChallengeCard.defaultProps = {
  userResources: [],
};

ChallengeCard.propTypes = {
  challenge: PT.shape({
    legacy: PT.shape({
      track: PT.oneOf(['DATA_SCIENCE', 'DESIGN', 'DEVELOP']).isRequired,
      forumId: PT.oneOfType([PT.number, PT.string]),
    }).isRequired,
    id: PT.oneOfType([PT.number, PT.string]).isRequired,
    name: PT.string.isRequired,
    phases: PT.any,
    registrationStartDate: PT.any,
    status: PT.any,
    userDetails: PT.any,
    events: PT.any,
    type: PT.string,
  }).isRequired,
  selectChallengeDetailsTab: PT.func.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  // unregisterFromChallenge: PT.func.isRequired,
  userResources: PT.arrayOf(PT.shape()),
  challengeSubtracksMap: PT.shape().isRequired,
};
