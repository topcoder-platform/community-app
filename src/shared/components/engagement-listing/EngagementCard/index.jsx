import React from 'react';
import PT from 'prop-types';
import moment from 'moment-timezone';
import { config } from 'topcoder-react-utils';
import IconBlackDuration from 'assets/images/icon-black-calendar.svg';
import IconBlackLocation from 'assets/images/icon-black-location.svg';
import IconBlackPayment from 'assets/images/icon-black-payment.svg';
import iconBlackSkills from 'assets/images/icon-skills.png';

import './style.scss';

const ROLE_LABELS = {
  DESIGNER: 'Designer',
  SOFTWARE_DEVELOPER: 'Software Developer',
  DATA_SCIENTIST: 'Data Scientist',
  DATA_ENGINEER: 'Data Engineer',
};

const WORKLOAD_LABELS = {
  FULL_TIME: 'Full Time',
  FRACTIONAL: 'Fractional',
};

const STATUS_LABELS = {
  OPEN: 'Open',
  PENDING_ASSIGNMENT: 'Pending Assignment',
  ACTIVE: 'Active',
  CANCELLED: 'Cancelled',
  CLOSED: 'Closed',
};

const DEFAULT_LOCALE = 'en-US';

const REGION_NAME_OVERRIDES = {
  UK: 'United Kingdom',
};
const regionDisplayNames = typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function'
  ? new Intl.DisplayNames([DEFAULT_LOCALE], { type: 'region' })
  : null;

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toTitleCase(value) {
  return value
    .toLowerCase()
    .split(' ')
    .map(part => (part ? `${part[0].toUpperCase()}${part.slice(1)}` : ''))
    .join(' ');
}

function normalizeLabel(value, normalizedMap) {
  if (typeof value === 'object' && value !== null) {
    const label = value.name || value.title;
    if (label) return String(label);
  }

  if (!value) return 'Not Specified';

  const raw = String(value).trim();
  if (!raw) return 'Not Specified';

  const normalized = raw.toUpperCase().replace(/[\s-]+/g, '_');
  if (normalizedMap && normalizedMap[normalized]) {
    return normalizedMap[normalized];
  }

  const hasSeparators = /[_-]+/.test(raw);
  const isAllCaps = raw === raw.toUpperCase();
  const spaced = raw.replace(/[_-]+/g, ' ').trim();

  if (hasSeparators || isAllCaps) {
    return spaced ? toTitleCase(spaced) : raw;
  }

  return spaced || raw;
}

function normalizeLocationValue(value) {
  if (!value) return null;
  if (typeof value === 'object' && value !== null) {
    const label = value.name || value.title;
    if (label) return String(label);
  }
  return String(value);
}

function normalizeRegionValue(value) {
  const normalized = normalizeLocationValue(value);
  if (!normalized) return null;
  const trimmed = normalized.trim();
  if (!trimmed) return null;
  const lowered = trimmed.toLowerCase();
  if (lowered === 'any') return 'Any';
  if (lowered === 'remote') return 'Remote';
  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    const regionCode = trimmed.toUpperCase();
    if (REGION_NAME_OVERRIDES[regionCode]) {
      return REGION_NAME_OVERRIDES[regionCode];
    }
    if (regionDisplayNames) {
      const displayName = regionDisplayNames.of(regionCode);
      if (displayName) return displayName;
    }
    return regionCode;
  }
  return trimmed;
}

function uniqNormalizedStrings(values) {
  const seen = new Set();
  return values.reduce((acc, value) => {
    const normalized = value.trim();
    if (!normalized) return acc;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return acc;
    seen.add(key);
    acc.push(normalized);
    return acc;
  }, []);
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
  return normalizeLabel(role, ROLE_LABELS);
}

function getWorkloadDisplay(workload) {
  return normalizeLabel(workload, WORKLOAD_LABELS);
}

function getCompensationDisplay(compensationRange) {
  if (typeof compensationRange === 'object' && compensationRange !== null) {
    const label = compensationRange.name || compensationRange.title;
    return label ? String(label) : 'Not Specified';
  }
  return compensationRange ? String(compensationRange) : 'Not Specified';
}

function getStatusDisplay(status) {
  if (typeof status === 'object' && status !== null) {
    const label = status.name || status.title;
    if (label) return String(label);
  }

  if (!status) return 'Not Specified';

  const normalized = String(status).trim().toUpperCase().replace(/[\s-]+/g, '_');
  if (!normalized) return 'Not Specified';

  return STATUS_LABELS[normalized] || 'Not Specified';
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
    location,
    locations: engagementLocations,
    countries,
    status,
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

  const baseLocations = [
    ...asArray(location),
    ...asArray(engagementLocations),
  ]
    .map(normalizeRegionValue)
    .filter(Boolean);
  const countryValues = asArray(countries)
    .map(normalizeRegionValue)
    .filter(Boolean);
  const isAnyValue = value => value.trim().toLowerCase() === 'any';
  const hasAnyLocation = [...baseLocations, ...countryValues].some(isAnyValue);
  const filteredBaseLocations = baseLocations.filter(value => !isAnyValue(value));
  const filteredCountries = countryValues.filter(value => !isAnyValue(value));
  const locations = uniqNormalizedStrings([
    ...(hasAnyLocation ? ['Remote'] : []),
    ...filteredBaseLocations,
    ...filteredCountries,
  ]);
  const locationText = locations.length ? locations.join(', ') : 'Remote';

  const resolvedEngagementId = nanoId || id || engagementId;
  const engagementLink = resolvedEngagementId
    ? `${config.URL.ENGAGEMENTS_APP}/${resolvedEngagementId}`
    : config.URL.ENGAGEMENTS_APP;
  const statusText = getStatusDisplay(status);

  return (
    <div styleName="container">
      <div styleName="header">
        <a styleName="gig-name" href={engagementLink}>
          {displayTitle}
        </a>
        <span styleName="status-badge">{statusText}</span>
      </div>
      <div styleName="job-infos">
        <div styleName="icon-val">
          <img src={iconBlackSkills} alt="role-icon" /> {getRoleDisplay(role)}
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
