import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { config } from 'topcoder-react-utils';

import './style.scss';

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function formatDate(value) {
  if (!value) return '';
  const date = moment(value);
  return date.isValid() ? date.format('MMM DD, YYYY') : '';
}

function getDuration(startDate, endDate) {
  if (!startDate || !endDate) return 'TBD';
  const start = moment(startDate);
  const end = moment(endDate);
  if (!start.isValid() || !end.isValid()) return 'TBD';

  const diffDays = end.diff(start, 'days');
  if (diffDays >= 7) {
    const weeks = Math.ceil(diffDays / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'}`;
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function getStatusLabel(status) {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('pending')) return 'Pending Assignment';
  if (normalized.includes('closed')) return 'Closed';
  return 'Open';
}

function getStatusClass(status) {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('pending')) return 'status-pending';
  if (normalized.includes('closed')) return 'status-closed';
  return 'status-open';
}

function EngagementCard({ engagement }) {
  const title = engagement.title || engagement.name || 'Engagement';
  const description = engagement.description || engagement.summary || '';
  const truncatedDescription = description.length > 150
    ? `${description.slice(0, 147).trim()}...`
    : description;
  const status = engagement.status || engagement.state || 'open';
  const startDate = engagement.startDate || engagement.start;
  const endDate = engagement.endDate || engagement.end;
  const durationText = getDuration(startDate, endDate);
  const deadline = engagement.applicationDeadline
    || engagement.applicationEndDate
    || engagement.applyBy
    || engagement.applyByDate;
  const deadlineText = formatDate(deadline);

  const skills = asArray(engagement.skills || engagement.requiredSkills || engagement.skillsets)
    .map(skill => (skill && skill.name) || (skill && skill.title) || skill)
    .filter(Boolean);
  const visibleSkills = skills.slice(0, 5);
  const extraSkills = skills.length - visibleSkills.length;

  const locations = [
    ...asArray(engagement.location),
    ...asArray(engagement.locations),
    ...asArray(engagement.timezone),
    ...asArray(engagement.timezones),
  ]
    .map(item => (item && item.name) || item)
    .filter(Boolean);
  const locationText = locations.length ? locations.join(', ') : 'Remote';

  const engagementId = engagement.nanoId || engagement.id || engagement.engagementId;
  const engagementLink = engagementId
    ? `${config.URL.ENGAGEMENTS_APP}/engagements/${engagementId}`
    : config.URL.ENGAGEMENTS_APP;

  const handleEngagementClick = () => {
    if (!engagementLink || typeof window === 'undefined') return;
    window.location.href = engagementLink;
  };

  return (
    <div styleName="engagementCard">
      <div styleName="left-panel">
        <span styleName={`statusBadge ${getStatusClass(status)}`}>
          {getStatusLabel(status)}
        </span>
      </div>
      <div styleName="right-panel">
        <div styleName="header">
          <button type="button" styleName="title" onClick={handleEngagementClick}>
            {title}
          </button>
          {deadlineText ? (
            <span styleName="deadline">Apply by {deadlineText}</span>
          ) : null}
        </div>
        {truncatedDescription ? (
          <p styleName="description">{truncatedDescription}</p>
        ) : null}
        <div styleName="meta">
          <div styleName="meta-item">
            <span styleName="meta-label">Duration</span>
            <span styleName="meta-value">{durationText}</span>
          </div>
          <div styleName="meta-item">
            <span styleName="meta-label">Location</span>
            <span styleName="meta-value">{locationText}</span>
          </div>
        </div>
        {visibleSkills.length ? (
          <div styleName="skills">
            {visibleSkills.map(skill => (
              <span styleName="skill-tag" key={skill}>{skill}</span>
            ))}
            {extraSkills > 0 ? (
              <span styleName="skill-tag more">+{extraSkills}</span>
            ) : null}
          </div>
        ) : null}
        <div styleName="footer">
          <button type="button" styleName="details-button" onClick={handleEngagementClick}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

EngagementCard.defaultProps = {
  engagement: {},
};

EngagementCard.propTypes = {
  engagement: PT.shape(),
};

export default EngagementCard;
