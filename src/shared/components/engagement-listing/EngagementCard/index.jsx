import React from 'react';
import PT from 'prop-types';
import moment from 'moment-timezone';
import { config } from 'topcoder-react-utils';
import IconBlackDuration from 'assets/images/icon-black-calendar.svg';
import IconBlackLocation from 'assets/images/icon-black-location.svg';
import IconBlackPayment from 'assets/images/icon-black-payment.svg';
import iconBlackSkills from 'assets/images/icon-skills.png';
import IconTimezone from 'assets/images/icon-timezone.svg';

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

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UNKNOWN_SKILL_LABEL = 'Unknown skill';
const DEFAULT_LOCALE = 'en-US';
const SIMPLE_TZ_PATTERN = /^[A-Za-z]{2,6}$/;
const OFFSET_TZ_PATTERN = /^(?:UTC|GMT)?\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?$/i;
const BARE_OFFSET_PATTERN = /^([+-])(\d{2})(?::?(\d{2}))$/;
const TIMEZONE_ABBREVIATION_LONG_NAMES = {
  ACDT: 'Australian Central Daylight Time',
  ACST: 'Australian Central Standard Time',
  AEDT: 'Australian Eastern Daylight Time',
  AEST: 'Australian Eastern Standard Time',
  AKDT: 'Alaska Daylight Time',
  AKST: 'Alaska Standard Time',
  AWST: 'Australian Western Standard Time',
  BST: 'British Summer Time',
  CDT: 'Central Daylight Time',
  CEST: 'Central European Summer Time',
  CET: 'Central European Standard Time',
  CST: 'Central Standard Time',
  EDT: 'Eastern Daylight Time',
  EEST: 'Eastern European Summer Time',
  EET: 'Eastern European Standard Time',
  EST: 'Eastern Standard Time',
  GMT: 'Greenwich Mean Time',
  HST: 'Hawaii-Aleutian Standard Time',
  IST: 'India Standard Time',
  JST: 'Japan Standard Time',
  KST: 'Korea Standard Time',
  MDT: 'Mountain Daylight Time',
  MST: 'Mountain Standard Time',
  NZDT: 'New Zealand Daylight Time',
  NZST: 'New Zealand Standard Time',
  PDT: 'Pacific Daylight Time',
  PST: 'Pacific Standard Time',
  SAST: 'South Africa Standard Time',
  UTC: 'Coordinated Universal Time',
  WEST: 'Western European Summer Time',
  WET: 'Western European Standard Time',
};
const REGION_NAME_OVERRIDES = {
  UK: 'United Kingdom',
};
const regionDisplayNames = typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function'
  ? new Intl.DisplayNames([DEFAULT_LOCALE], { type: 'region' })
  : null;
let timezoneAbbreviationMap;

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function isUuid(value) {
  return typeof value === 'string' && UUID_PATTERN.test(value);
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

function normalizeSkillLabel(skill) {
  if (!skill) return null;

  if (typeof skill === 'object' && skill !== null) {
    const label = skill.name || skill.title;
    if (label) return String(label);
    const skillId = skill.id || skill.value;
    if (isUuid(skillId)) return UNKNOWN_SKILL_LABEL;
    return skillId ? String(skillId) : null;
  }

  if (isUuid(skill)) return UNKNOWN_SKILL_LABEL;
  return String(skill);
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

function getIntlTimeZoneName(timeZone, style) {
  if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat !== 'function') {
    return null;
  }

  try {
    const formatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      timeZone,
      timeZoneName: style,
    });

    if (typeof formatter.formatToParts !== 'function') {
      return null;
    }

    const parts = formatter.formatToParts(new Date());
    const namePart = parts.find(part => part.type === 'timeZoneName');
    return namePart && namePart.value ? namePart.value : null;
  } catch (error) {
    return null;
  }
}

function getMomentTimeZoneName(timeZone) {
  if (!moment || !moment.tz || !moment.tz.zone) {
    return null;
  }

  if (!moment.tz.zone(timeZone)) {
    return null;
  }

  try {
    return moment.tz(new Date(), timeZone).format('z');
  } catch (error) {
    return null;
  }
}

function getTimeZoneAbbreviationMap() {
  if (timezoneAbbreviationMap) return timezoneAbbreviationMap;
  timezoneAbbreviationMap = new Map();
  if (!moment || !moment.tz || typeof moment.tz.names !== 'function') {
    return timezoneAbbreviationMap;
  }

  moment.tz.names().forEach((zoneName) => {
    try {
      const abbr = moment.tz(new Date(), zoneName).format('z');
      if (!abbr) return;
      const normalized = abbr.toUpperCase();
      if (!timezoneAbbreviationMap.has(normalized)) {
        timezoneAbbreviationMap.set(normalized, zoneName);
      }
    } catch (error) {
      // ignore invalid timezone data
    }
  });

  return timezoneAbbreviationMap;
}

function resolveTimeZoneAbbreviationName(abbreviation) {
  const normalized = abbreviation.toUpperCase();
  if (TIMEZONE_ABBREVIATION_LONG_NAMES[normalized]) {
    return TIMEZONE_ABBREVIATION_LONG_NAMES[normalized];
  }

  const map = getTimeZoneAbbreviationMap();
  const zoneName = map.get(normalized);
  if (!zoneName) return null;

  return (
    getIntlTimeZoneName(zoneName, 'long')
    || getIntlTimeZoneName(zoneName, 'longGeneric')
  );
}

function formatUtcOffset(sign, hours, minutes) {
  const hourValue = Number(hours);
  const minuteValue = Number(minutes || 0);

  if (Number.isNaN(hourValue) || Number.isNaN(minuteValue)) {
    return null;
  }

  const normalizedHours = String(Math.abs(hourValue)).padStart(2, '0');
  const normalizedMinutes = String(Math.abs(minuteValue)).padStart(2, '0');
  const suffix = normalizedMinutes !== '00' ? `:${normalizedMinutes}` : '';

  return `UTC${sign}${normalizedHours}${suffix}`;
}

function normalizeUtcOffset(value) {
  if (!value) return null;
  const normalized = String(value).trim();
  if (!normalized) return null;

  if (/^(utc|gmt)$/i.test(normalized)) {
    return 'UTC';
  }

  const offsetMatch = normalized.match(OFFSET_TZ_PATTERN);
  if (offsetMatch) {
    return formatUtcOffset(offsetMatch[1], offsetMatch[2], offsetMatch[3]);
  }

  const bareMatch = normalized.match(BARE_OFFSET_PATTERN);
  if (bareMatch) {
    return formatUtcOffset(bareMatch[1], bareMatch[2], bareMatch[3]);
  }

  return null;
}

function normalizeTimezoneValue(value) {
  const normalizedValue = normalizeLocationValue(value);
  if (!normalizedValue) return null;

  const trimmed = normalizedValue.trim();
  if (!trimmed) return null;

  if (trimmed.toLowerCase() === 'any') {
    return 'Any';
  }

  const longName = getIntlTimeZoneName(trimmed, 'long') || getIntlTimeZoneName(trimmed, 'longGeneric');
  if (longName) {
    return longName;
  }

  const offset = normalizeUtcOffset(trimmed);
  if (offset) {
    return offset;
  }

  if (SIMPLE_TZ_PATTERN.test(trimmed)) {
    return resolveTimeZoneAbbreviationName(trimmed) || trimmed.toUpperCase();
  }

  const fallbackShortName = getMomentTimeZoneName(trimmed) || getIntlTimeZoneName(trimmed, 'short');
  if (fallbackShortName) {
    return fallbackShortName;
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

function formatDeadline(dateValue) {
  if (!dateValue) return 'TBD';
  const deadline = moment(dateValue);
  if (!deadline.isValid()) return 'TBD';
  return deadline.format('MMM DD, YYYY');
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
    skills: engagementSkills,
    requiredSkills,
    skillsets,
    location,
    locations: engagementLocations,
    timezone,
    timezones,
    timeZones,
    countries,
    status,
    applicationDeadline,
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
  const deadlineText = formatDeadline(applicationDeadline);

  const skillsSource = [engagementSkills, requiredSkills, skillsets]
    .find(value => Array.isArray(value) && value.length)
    || engagementSkills
    || requiredSkills
    || skillsets;
  const skills = Array.from(new Set(
    asArray(skillsSource)
      .map(normalizeSkillLabel)
      .filter(Boolean),
  ));
  const skillsText = skills.length
    ? skills.slice(0, 2).join(', ')
    : 'Not Specified';
  const limitedSkillsText = skills.length > 2
    ? `${skillsText},...`
    : skillsText;

  const baseLocations = [
    ...asArray(location),
    ...asArray(engagementLocations),
  ]
    .map(normalizeRegionValue)
    .filter(Boolean);
  const timezoneValues = [
    ...asArray(timezone),
    ...asArray(timezones),
    ...asArray(timeZones),
  ]
    .map(normalizeTimezoneValue)
    .filter(Boolean);
  const countryValues = asArray(countries)
    .map(normalizeRegionValue)
    .filter(Boolean);
  const isAnyValue = value => value.trim().toLowerCase() === 'any';
  const hasAnyLocation = [...baseLocations, ...countryValues].some(isAnyValue);
  const hasAnyTimezone = timezoneValues.some(isAnyValue);
  const filteredBaseLocations = baseLocations.filter(value => !isAnyValue(value));
  const filteredCountries = countryValues.filter(value => !isAnyValue(value));
  const locations = uniqNormalizedStrings([
    ...(hasAnyLocation ? ['Remote'] : []),
    ...filteredBaseLocations,
    ...filteredCountries,
  ]);
  const locationText = locations.length ? locations.join(', ') : 'Remote';
  const filteredTimezones = uniqNormalizedStrings(
    timezoneValues.filter(value => !isAnyValue(value)),
  );
  let timezoneText = 'Not Specified';
  if (filteredTimezones.length) {
    timezoneText = filteredTimezones.join(', ');
  } else if (hasAnyTimezone) {
    timezoneText = 'Any';
  }

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
          <img src={iconBlackSkills} alt="skills-icon" /> {limitedSkillsText}
        </div>
        <div styleName="icon-val">
          <IconTimezone /> {timezoneText}
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
        <div styleName="icon-val">
          <IconBlackDuration /> {`Apply by ${deadlineText}`}
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
