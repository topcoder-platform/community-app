import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { config } from 'topcoder-react-utils';
import IconBlackDuration from 'assets/images/icon-black-calendar.svg';
import IconBlackLocation from 'assets/images/icon-black-location.svg';
import IconBlackPayment from 'assets/images/icon-black-payment.svg';
import iconBlackSkills from 'assets/images/icon-skills.png';

import './style.scss';

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function formatDuration(value, unitLabel) {
  if (value === null || value === undefined || value === '') return null;
  const numericValue = Number(value);
  if (Number.isNaN(numericValue) || numericValue <= 0) return null;
  return `${numericValue} ${unitLabel}${numericValue === 1 ? '' : 's'}`;
}

function getDuration(startDate, endDate, durationWeeks, durationMonths) {
  const weekDuration = formatDuration(durationWeeks, 'Week');
  if (weekDuration) return weekDuration;
  const monthDuration = formatDuration(durationMonths, 'Month');
  if (monthDuration) return monthDuration;
  if (!startDate || !endDate) return 'TBD';
  const start = moment(startDate);
  const end = moment(endDate);
  if (!start.isValid() || !end.isValid()) return 'TBD';

  const diffDays = end.diff(start, 'days');
  if (diffDays < 0) return 'TBD';
  const weeks = Math.max(1, Math.ceil(diffDays / 7));
  return `${weeks} Week${weeks === 1 ? '' : 's'}`;
}

function getRoleDisplay(role) {
  if (typeof role === 'object' && role !== null) {
    const label = role.name || role.title;
    return label ? String(label) : 'Not Specified';
  }
  return role ? String(role) : 'Not Specified';
}

function getWorkloadDisplay(workload) {
  if (typeof workload === 'object' && workload !== null) {
    const label = workload.name || workload.title;
    return label ? String(label) : 'Not Specified';
  }
  return workload ? String(workload) : 'Not Specified';
}

function getCompensationDisplay(compensationRange) {
  if (typeof compensationRange === 'object' && compensationRange !== null) {
    const label = compensationRange.name || compensationRange.title;
    return label ? String(label) : 'Not Specified';
  }
  return compensationRange ? String(compensationRange) : 'Not Specified';
}

function EngagementCard({ engagement }) {
  const {
    title,
    name,
    startDate,
    start,
    endDate,
    end,
    durationStartDate,
    durationEndDate,
    durationWeeks,
    durationMonths,
    role,
    workload,
    compensationRange,
    skills: engagementSkills,
    requiredSkills,
    skillsets,
    location,
    locations: engagementLocations,
    timezone,
    timezones,
    timeZones,
    countries,
    nanoId,
    id,
    engagementId,
  } = engagement;

  const displayTitle = title || name || 'Engagement';
  const normalizedStartDate = startDate || start || durationStartDate;
  const normalizedEndDate = endDate || end || durationEndDate;
  const durationText = getDuration(
    normalizedStartDate,
    normalizedEndDate,
    durationWeeks,
    durationMonths,
  );

  const skills = asArray(engagementSkills || requiredSkills || skillsets)
    .map(skill => (skill && skill.name) || (skill && skill.title) || skill)
    .filter(Boolean);
  const skillsText = skills.length
    ? skills.slice(0, 2).join(', ')
    : 'Not Specified';
  const limitedSkillsText = skills.length > 2
    ? `${skillsText},...`
    : skillsText;

  const locations = [
    ...asArray(location),
    ...asArray(engagementLocations),
    ...asArray(timezone),
    ...asArray(timezones),
    ...asArray(timeZones),
    ...asArray(countries),
  ]
    .map(item => (item && item.name) || item)
    .filter(Boolean);
  const locationText = locations.length ? locations.join(', ') : 'Remote';

  const resolvedEngagementId = nanoId || id || engagementId;
  const engagementLink = resolvedEngagementId
    ? `${config.URL.ENGAGEMENTS_APP}/${resolvedEngagementId}`
    : config.URL.ENGAGEMENTS_APP;

  return (
    <div styleName="container">
      <a styleName="gig-name" href={engagementLink}>
        {displayTitle}
      </a>
      <div styleName="job-infos">
        <div styleName="icon-val">
          <img src={iconBlackSkills} alt="role-icon" /> {getRoleDisplay(role)}
        </div>
        <div styleName="icon-val">
          <img src={iconBlackSkills} alt="skills-icon" /> {limitedSkillsText}
        </div>
        <div styleName="icon-val">
          <IconBlackLocation /> {locationText}
        </div>
        <div styleName="icon-val">
          <IconBlackDuration /> {getWorkloadDisplay(workload)}
        </div>
        <div styleName="icon-val">
          <IconBlackPayment /> {getCompensationDisplay(compensationRange)}
        </div>
        <div styleName="icon-val">
          <IconBlackDuration /> {durationText}
        </div>
        <div styleName="row-btn">
          <a styleName="primary-green-md" href={engagementLink}>
            VIEW DETAILS
          </a>
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
