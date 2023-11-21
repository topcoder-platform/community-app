/**
 * Component for rendering a Review Opportunity and associated Challenge
 * information.  Will be contained within a Bucket.
 */
import _ from 'lodash';
import { Link } from 'topcoder-react-utils';
import moment from 'moment';
import React, { useMemo } from 'react';
import PT from 'prop-types';

import TrackIcon from 'components/TrackIcon';
import Tooltip from 'components/Tooltip';

import { time } from 'topcoder-react-lib';
import { REVIEW_OPPORTUNITY_TYPES } from 'utils/tc';

import Tags from '../Tags';

import TrackAbbreviationTooltip from '../Tooltips/TrackAbbreviationTooltip';

import SubmissionsIcon from '../Icons/SubmissionsIcon';
import OpenPositionsIcon from '../Icons/RegistrantsIcon';

import './style.scss';

const { formatDuration } = time;

/**
 * Generates text for the tooltip that describes the number of submissions or
 * open positions in a grammatical fashion
 * @param {Number} num The total count of submissions/positions
 * @param {String} suffix The suffix without pluralization
 * @return {String} The text label
 */
const quantityText = (num, suffix) => {
  if (num === 0) return `No ${suffix}s`;
  if (num === 1) return `1 ${suffix}`;
  return `${num} ${suffix}s`;
};

// Functional implementation of ReviewOpportunityCard component
function ReviewOpportunityCard({
  challengesUrl,
  expandedTags,
  expandTag,
  onTechTagClicked,
  opportunity,
  challengeType,
}) {
  const { challenge } = opportunity;
  let tags = challenge.tags || challenge.technologies;
  const skills = useMemo(() => _.uniq((challenge.skills || []).map(skill => skill.name)), [
    challenge.skills,
  ]);
  tags = tags.filter(tag => tag.trim().length);
  const { track } = challenge.track;
  const start = moment(opportunity.startDate);
  return (
    <div styleName="reviewOpportunityCard">
      <div styleName="left-panel">
        { /* START - DISABLED UNTIL REVIEW OPPORTUNITY RECEIVE UPDATE TO API V5 */
        false
        && (
        <div styleName="challenge-track">
          <TrackAbbreviationTooltip
            track={track}
            type={challengeType}
          >
            <span>
              <TrackIcon
                track={track}
                type={challengeType}
                isDataScience={tags.includes('Data Science')}
              />
            </span>
          </TrackAbbreviationTooltip>
        </div>
        ) /* END - DISABLED UNTIL REVIEW OPPORTUNITY RECEIVE UPDATE TO API V5 */ }
        <div styleName="challenge-details">
          <Link
            to={`${challengesUrl}/${challenge.id}`}
          >
            {challenge.title}
          </Link>
          <div styleName="details-footer">
            <span styleName="date">
              Starts
              {' '}
              {start.format('MMM DD')}
            </span>
            { (tags.length + skills.length) > 0
              && (
              <Tags
                tags={tags}
                skills={skills}
                isExpanded={(expandedTags || []).includes(challenge.id)}
                expand={() => expandTag(challenge.id)}
                onTechTagClicked={onTechTagClicked}
              />
              ) }
          </div>
        </div>
      </div>
      <div styleName="right-panel">
        <Tooltip
          content={(
            <div styleName="tooltip">
              {opportunity.payments.map(payment => (
                <div key={payment.role}>
                  {payment.role}
                  {' '}
                  - $
                  {payment.payment.toLocaleString()}
                </div>
              ))}
            </div>
          )}
        >
          <div styleName="payment">
            <span>
              $
            </span>
            {_.sumBy(opportunity.payments, 'payment').toLocaleString()}
            <div styleName="payment-type">
              Payment
            </div>
          </div>
        </Tooltip>
        <span styleName="review-type">
          {REVIEW_OPPORTUNITY_TYPES[opportunity.type]}
        </span>
        <div styleName="review-stats">
          <Tooltip
            content={(
              <div styleName="tooltip">
                {quantityText(opportunity.openPositions, 'open position')}
              </div>
            )}
          >
            <OpenPositionsIcon />
            <span styleName="number">
              {opportunity.openPositions}
            </span>
          </Tooltip>
          <Tooltip
            content={(
              <div styleName="tooltip">
                {quantityText(opportunity.submissions, 'submission')}
              </div>
            )}
          >
            <SubmissionsIcon />
            <span styleName="number">
              {opportunity.submissions}
            </span>
          </Tooltip>
        </div>
        <Link
          to={`/challenges/${challenge.legacyId || challenge.id}/review-opportunities`}
          styleName="register-button"
        >
          <span>
            Late by<br />
            { start.isAfter() ? formatDuration(start.diff()) : ` ${formatDuration(-start.diff())}` }
          </span>
          <span styleName="to-register">
            to Apply
          </span>
        </Link>
      </div>
    </div>
  );
}

// Default Props
ReviewOpportunityCard.defaultProps = {
  expandedTags: [],
  expandTag: null,
  onTechTagClicked: _.noop,
};

// Prop Validation
ReviewOpportunityCard.propTypes = {
  expandedTags: PT.arrayOf(PT.number),
  expandTag: PT.func,
  challengesUrl: PT.string.isRequired,
  onTechTagClicked: PT.func,
  opportunity: PT.shape().isRequired,
  challengeType: PT.shape().isRequired,
};

export default ReviewOpportunityCard;
