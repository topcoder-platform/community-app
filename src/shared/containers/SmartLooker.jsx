/**
 * SmartLooker bridges legacy <Looker lookerId="..." /> usages to new
 * reports-api-v6 endpoints for specific Looker IDs used by the
 * /community/statistics page. Unknown IDs fall back to the original Looker
 * container (which fetches from the v4 Looks API).  That fallback is a "just in case"
 * item.
 */
import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import Looker from 'components/Looker';
import OriginalLookerContainer from 'containers/Looker';
import { getCountryObjFromAlpha3 } from 'utils/countries';

// Safely parse a possible JSON string table definition into an array of columns.
function parseTableDef(table) {
  if (!table && table !== '') return null;
  if (Array.isArray(table)) return table;
  if (table === '') return [];
  try {
    // Contentful markdown encodes quotes as &q; in some places; normalize first
    const normalized = String(table).replace(/&q;/g, '"').replace(/'/g, '"');
    const cols = JSON.parse(normalized);
    return Array.isArray(cols) ? cols : null;
  } catch (e) {
    return null;
  }
}

// Convert a 3-letter country code to its English full name.
// Falls back to the original code if unknown.
function countryNameFromCode(code) {
  if (!code) return code;
  const obj = getCountryObjFromAlpha3(String(code).toUpperCase());
  return (obj && obj.name) ? obj.name : code;
}

function pickDefined(...values) {
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

// Direct mappings from known Looker IDs to reports-api-v6 endpoints.
// These are the specific Looker tiles used by the /community/statistics page
// that we want to source from the new reports service instead of legacy Looker.
const LOOKER_TO_REPORTS_MAP = {
  // SRM datasets (static JSON served by reports-api-v6)
  1653: '/statistics/srm/top-rated',
  1657: '/statistics/srm/country-ratings',
  1654: '/statistics/srm/competitions-count',
  // Marathon Match datasets (static JSON served by reports-api-v6)
  1652: '/statistics/mm/top-rated',
  1658: '/statistics/mm/country-ratings',
  1656: '/statistics/mm/top-10-finishes',
  1655: '/statistics/mm/competitions-count',
  // General tab datasets (fetched from DB via reports-api-v6)
  // Development Challenges by Technology (fallback to countries represented)
  1127: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const lowerProps = propList.map(p => p.toLowerCase());
    const looksLikeCountries = lowerProps.some(p => p.includes('country'));
    const looksLikeTechnologyBreakdown = lowerProps.some(p => p.includes('challenge_technology'))
      || lowerProps.some(p => p.includes('technology'))
      || (!propList.length && !looksLikeCountries);

    if (looksLikeTechnologyBreakdown) {
      const technologyProp = propList.find(p => p.toLowerCase().includes('challenge_technology'))
        || propList.find(p => p.toLowerCase().includes('technology'))
        || 'challenge_technology.name';
      const challengeCountProp = propList.find(p => p.toLowerCase().includes('challenge_stats.count'))
        || propList.find(p => (p && p.toLowerCase().includes('challenge') && p.toLowerCase().includes('count')))
        || propList.find(p => (p && p.toLowerCase().endsWith('.count')))
        || 'challenge_stats.count';
      const rankProp = propList.find(p => p.toLowerCase() === 'rank') || 'rank';

      return {
        path: '/statistics/development/challenges-technology',
        transform: rows => (Array.isArray(rows) ? rows : [rows]).map((r) => {
          const technologyName = pickDefined(
            r && r['challenge_technology.name'],
            r && r.challenge_technology_name,
            r && r.challenge_technology,
            r && r.technology,
            r && r.skill_name,
            null,
          );
          const challengeCount = Number(pickDefined(
            r && r['challenge_stats.count'],
            r && r.challenge_stats_count,
            r && r.challenge_count,
            r && r.count,
            r && r.challenge_stats && r.challenge_stats.count,
            0,
          )) || 0;
          const technologyNameValue = (
            technologyName === undefined || technologyName === null
          ) ? technologyName : String(technologyName);
          const rankValue = Number(pickDefined(
            r && r.rank,
            r && rankProp && r[rankProp],
            0,
          )) || 0;

          const mapped = {
            [technologyProp]: technologyNameValue,
            [challengeCountProp]: challengeCount,
          };

          if (rankProp && rankProp !== technologyProp && rankProp !== challengeCountProp) {
            mapped[rankProp] = rankValue;
          }

          return mapped;
        }),
      };
    }

    const countryProp = propList.find(p => p.toLowerCase().includes('country')) || 'country.country_name';
    const countProp = propList.find(p => p.toLowerCase() === 'user.count') || 'user.count';
    return {
      path: '/statistics/general/countries-represented',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
        [countryProp]: countryNameFromCode(r.country_code),
        [countProp]: Number(r.members_count) || 0,
      })),
    };
  },
  // Countries Represented (Development)
  1129: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const countryProp = propList.find(p => p.toLowerCase().includes('country')) || 'country.country_name';
    const countProp = propList.find(p => p.toLowerCase() === 'user.count') || 'user.count';
    return {
      path: '/statistics/development/countries-represented',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
        [countryProp]: countryNameFromCode(r.country_code),
        [countProp]: Number(r.members_count) || 0,
      })),
    };
  },
  // Countries Represented (Design)
  1136: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    return {
      path: '/statistics/design/countries-represented',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
        [propList.find(p => p.toLowerCase().includes('country')) || 'country.country_name']:
          countryNameFromCode(r.country_code),
        [propList.find(p => p.toLowerCase() === 'user.count') || 'user.count']:
          Number(r.members_count) || 0,
      })),
    };
  },
  // First Time Submitters (Design)
  1178: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const nameProp = propList.find(p => p.toLowerCase().includes('handle')) || 'handle';
    const dateProp = propList.find(p => p.toLowerCase().includes('date'))
      || propList.find(p => (p && p.toLowerCase() !== 'rank' && !p.toLowerCase().includes('handle')))
      || 'first_submission_date';
    return {
      path: '/statistics/design/first-time-submitters',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
        [nameProp]: r.handle,
        [dateProp]: r.first_submission_date,
      })),
    };
  },
  // 1st Place Finishes (by country)
  1135: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const nameProp = propList.find(p => p.toLowerCase().includes('country')) || 'country.country_name';
    const valueProp = propList.find(p => p.toLowerCase().includes('first_place'))
      || propList.find(p => (p && p.toLowerCase() !== 'rank' && !p.toLowerCase().includes('country')))
      || 'first_place_count';
    return {
      path: '/statistics/design/first-place-by-country',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
        [nameProp]: countryNameFromCode(r.country_code),
        [valueProp]: Number(r.first_place_count) || 0,
      })),
    };
  },
  // 1st place by country
  1149: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const countryProp = propList.find(p => p.toLowerCase().includes('country')) || 'country.country_name';
    let valueProp = propList.find(p => p.toLowerCase().includes('first_place'))
      || propList.find(p => p.toLowerCase() === 'user.count');
    if (!valueProp) {
      valueProp = propList.find(p => (p && !p.toLowerCase().includes('country') && p.toLowerCase() !== 'rank'))
        || 'first_place_count';
    }
    return {
      path: '/statistics/general/first-place-by-country',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
        [countryProp]: countryNameFromCode(r.country_code),
        [valueProp]: Number(r.first_place_count) || 0,
      })),
    };
  },
  // Copiloted challenges (by member)
  1146: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const handleProp = propList.find(p => p.toLowerCase().includes('copilot'))
      || propList.find(p => p.toLowerCase().includes('handle'))
      || 'copilot.handle';
    const countProp = 'challenge.count';
    return {
      path: '/statistics/general/copiloted-challenges',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
        [handleProp]: r.handle,
        [countProp]: Number(r.copiloted_challenges) || 0,
      })),
    };
  },
  // Number of Reviews (by member)
  1150: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const handleProp = propList.find(p => p.toLowerCase().includes('handle')) || 'handle';
    const valueProp = propList.find(p => p.toLowerCase().includes('review')) || 'review.count';
    return {
      path: '/statistics/general/reviews-by-member',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
        [handleProp]: r.handle,
        [valueProp]: Number(r.review_count) || 0,
      })),
    };
  },
  // DEVELOPMENT tab datasets (fetched from DB via reports-api-v6)
  // Development First Place Wins (by member)
  1130: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const registrantHandleProp = propList.find(p => p.toLowerCase().includes('registrant_handle'))
      || propList.find(p => p.toLowerCase().includes('winner_handle'))
      || propList.find(p => p.toLowerCase().includes('handle'))
      || 'challenge_stats.registrant_handle';
    const handleProp = propList.find(p => p.toLowerCase() === 'handle') || null;
    const challengeCountProp = propList.find(p => p.toLowerCase().includes('challenge_stats.count'))
      || propList.find(p => p.toLowerCase().includes('win'))
      || 'challenge_stats.count';
    const countProp = propList.find(p => p.toLowerCase() === 'count') || null;
    const maxRatingProp = propList.find(p => p.toLowerCase().includes('max_rating'))
      || 'member_profile_advanced.max_rating';
    const rankProp = propList.find(p => p.toLowerCase() === 'rank') || 'rank';
    return {
      path: '/statistics/development/first-place-wins',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map((r) => {
        const wins = Number(pickDefined(
          r && r['challenge_stats.count'],
          r && r.count,
          r && r.wins,
          0,
        )) || 0;
        const registrantHandle = pickDefined(
          r && r['challenge_stats.registrant_handle'],
          r && r['challenge_stats.winner_handle'],
          r && r.handle,
          null,
        );
        const maxRating = pickDefined(
          r && r['member_profile_advanced.max_rating'],
          r && r.max_rating,
          null,
        );
        const rankValue = Number(pickDefined(r && r.rank, 0)) || 0;

        const mapped = {
          [registrantHandleProp]: registrantHandle,
          [challengeCountProp]: wins,
          [maxRatingProp]: maxRating,
          [rankProp]: rankValue,
        };

        if (handleProp && handleProp !== registrantHandleProp) {
          mapped[handleProp] = registrantHandle;
        }
        if (countProp && countProp !== challengeCountProp) mapped[countProp] = wins;

        return mapped;
      }),
    };
  },
  // Development Prototype Wins (by member)
  1131: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const winnerHandleProp = propList.find(p => p.toLowerCase().includes('winner_handle'))
      || propList.find(p => p.toLowerCase().includes('handle'))
      || 'challenge_stats.winner_handle';
    const handleProp = propList.find(p => p.toLowerCase() === 'handle') || null;
    const challengeCountProp = propList.find(p => p.toLowerCase().includes('challenge_stats.count'))
      || propList.find(p => p.toLowerCase().includes('win'))
      || 'challenge_stats.count';
    const countProp = propList.find(p => p.toLowerCase() === 'count') || null;
    const maxRatingProp = propList.find(p => p.toLowerCase().includes('max_rating'))
      || 'member_profile_advanced.max_rating';
    const rankProp = propList.find(p => p.toLowerCase() === 'rank') || 'rank';
    return {
      path: '/statistics/development/prototype-wins',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map((r) => {
        const wins = Number(pickDefined(
          r && r['challenge_stats.count'],
          r && r.count,
          r && r.wins,
          0,
        )) || 0;
        const winnerHandle = pickDefined(
          r && r['challenge_stats.winner_handle'],
          r && r.handle,
          null,
        );
        const maxRating = pickDefined(r && r['member_profile_advanced.max_rating'], null);
        const rankValue = Number(pickDefined(r && r.rank, 0)) || 0;

        const mapped = {
          [winnerHandleProp]: winnerHandle,
          [challengeCountProp]: wins,
          [maxRatingProp]: maxRating,
          [rankProp]: rankValue,
        };

        if (handleProp && handleProp !== winnerHandleProp) mapped[handleProp] = winnerHandle;
        if (countProp && countProp !== challengeCountProp) mapped[countProp] = wins;

        return mapped;
      }),
    };
  },
  // Development Code Wins (by member)
  1132: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const winnerHandleProp = propList.find(p => p.toLowerCase().includes('winner_handle'))
      || propList.find(p => p.toLowerCase().includes('handle'))
      || 'challenge_stats.winner_handle';
    const handleProp = propList.find(p => p.toLowerCase() === 'handle') || null;
    const challengeCountProp = propList.find(p => p.toLowerCase().includes('challenge_stats.count'))
      || propList.find(p => p.toLowerCase().includes('win'))
      || 'challenge_stats.count';
    const countProp = propList.find(p => p.toLowerCase() === 'count') || null;
    const maxRatingProp = propList.find(p => p.toLowerCase().includes('max_rating'))
      || 'member_profile_advanced.max_rating';
    const rankProp = propList.find(p => p.toLowerCase() === 'rank') || 'rank';
    return {
      path: '/statistics/development/code-wins',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map((r) => {
        const wins = Number(pickDefined(
          r && r['challenge_stats.count'],
          r && r.count,
          r && r.wins,
          0,
        )) || 0;
        const winnerHandle = pickDefined(
          r && r['challenge_stats.winner_handle'],
          r && r.handle,
          null,
        );
        const maxRating = pickDefined(r && r['member_profile_advanced.max_rating'], null);
        const rankValue = Number(pickDefined(r && r.rank, 0)) || 0;

        const mapped = {
          [winnerHandleProp]: winnerHandle,
          [challengeCountProp]: wins,
          [maxRatingProp]: maxRating,
          [rankProp]: rankValue,
        };

        if (handleProp && handleProp !== winnerHandleProp) mapped[handleProp] = winnerHandle;
        if (countProp && countProp !== challengeCountProp) mapped[countProp] = wins;

        return mapped;
      }),
    };
  },
  // Development First Time Submitters
  1172: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const handleProp = propList.find(p => p.toLowerCase().includes('handle')) || 'user.handle';
    const challengeProp = propList.find(p => p.toLowerCase().includes('challenge')) || 'challenge.challenge_name';
    const dateProp = propList.find(p => p.toLowerCase().includes('submit_date')) || 'newest_submitters.submit_date_date';
    const ratingProp = propList.find(p => p.toLowerCase().includes('max_rating')) || null;
    return {
      path: '/statistics/development/first-time-submitters',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map((r) => {
        const handleValue = pickDefined(
          r && r['user.handle'],
          r && r.handle,
          r && r.member_handle,
          null,
        );
        const challengeValue = pickDefined(
          r && r['challenge.challenge_name'],
          r && r.challenge_name,
          null,
        );
        const dateValueRaw = pickDefined(
          r && r['newest_submitters.submit_date_date'],
          r && r.submit_date,
          r && r.first_submission_date,
          null,
        );
        const dateValue = dateValueRaw ? String(dateValueRaw).split('T')[0] : dateValueRaw;
        const ratingValue = pickDefined(
          r && r['submitter_profile.max_rating'],
          r && r.max_rating,
          null,
        );

        const mapped = {
          [handleProp]: handleValue,
          [challengeProp]: challengeValue,
          [dateProp]: dateValue,
        };
        if (ratingProp) mapped[ratingProp] = ratingValue;
        return mapped;
      }),
    };
  },
  // DEVELOPMENT tab datasets (fetched from DB via reports-api-v6)
  // Development F2F Wins (by member)
  1133: '/statistics/development/f2f-wins',
  // QA tab datasets (fetched from DB via reports-api-v6)
  // QA Wins (by member)
  1700: '/statistics/qa/wins',
  // DESIGN tab datasets (fetched from DB via reports-api-v6)
  // UI Design Wins (by member)
  1138: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const nameProp = propList.find(p => p.toLowerCase().includes('handle')) || 'handle';
    const valueProp = propList.find(p => p.toLowerCase().includes('win'))
      || propList.find(p => (p && p.toLowerCase() !== 'rank' && !p.toLowerCase().includes('handle')))
      || 'wins';
    return {
      path: '/statistics/design/ui-design-wins',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
        [nameProp]: r.handle,
        [valueProp]: Number(pickDefined(r && r.wins_count, r && r.count, 0)) || 0,
      })),
    };
  },
  // Design F2F Wins (by member)
  1141: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const nameProp = propList.find(p => p.toLowerCase().includes('handle')) || 'handle';
    const valueProp = propList.find(p => p.toLowerCase().includes('win'))
      || propList.find(p => (p && p.toLowerCase() !== 'rank' && !p.toLowerCase().includes('handle')))
      || 'wins';
    return {
      path: '/statistics/design/f2f-wins',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
        [nameProp]: r.handle,
        [valueProp]: Number(pickDefined(r && r.wins_count, r && r.count, 0)) || 0,
      })),
    };
  },
  // LUX 1st Place Wins (Design)
  1571: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const winnerHandleProp = propList.find(p => p.toLowerCase().includes('winner_handle'))
      || 'challenge_stats.winner_handle';
    const handleProp = propList.find(p => p.toLowerCase() === 'handle') || 'handle';
    const challengeCountProp = propList.find(p => p.toLowerCase().includes('challenge_stats.count'))
      || 'challenge_stats.count';
    const countProp = propList.find(p => p.toLowerCase() === 'count') || 'count';
    const maxRatingProp = propList.find(p => p.toLowerCase().includes('max_rating'))
      || 'member_profile_advanced.max_rating';
    const rankProp = propList.find(p => p.toLowerCase() === 'rank') || 'rank';
    return {
      path: '/statistics/design/lux-first-place-wins',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map((r) => {
        const wins = Number(pickDefined(r && r.wins_count, r && r.count, 0)) || 0;
        const maxRating = pickDefined(r && r.max_rating, null);
        const mapped = {
          [winnerHandleProp]: r.handle,
          [handleProp]: r.handle,
          [challengeCountProp]: wins,
          [countProp]: wins,
          [maxRatingProp]: maxRating,
          [rankProp]: Number(r && r.rank) || 0,
        };
        return mapped;
      }),
    };
  },
  // LUX Placements (Design)
  1572: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const winnerHandleProp = propList.find(p => p.toLowerCase().includes('winner_handle'))
      || 'challenge_stats.winner_handle';
    const handleProp = propList.find(p => p.toLowerCase() === 'handle') || 'handle';
    const challengeCountProp = propList.find(p => p.toLowerCase().includes('challenge_stats.count'))
      || 'challenge_stats.count';
    const countProp = propList.find(p => p.toLowerCase() === 'count') || 'count';
    const maxRatingProp = propList.find(p => p.toLowerCase().includes('max_rating'))
      || 'member_profile_advanced.max_rating';
    const rankProp = propList.find(p => p.toLowerCase() === 'rank') || 'rank';
    return {
      path: '/statistics/design/lux-placements',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map((r) => {
        const placements = Number(pickDefined(r && r.placements_count, r && r.count, 0)) || 0;
        const maxRating = pickDefined(r && r.max_rating, null);
        const mapped = {
          [winnerHandleProp]: r.handle,
          [handleProp]: r.handle,
          [challengeCountProp]: placements,
          [countProp]: placements,
          [maxRatingProp]: maxRating,
          [rankProp]: Number(r && r.rank) || 0,
        };
        return mapped;
      }),
    };
  },
  // RUX 1st Place Wins (Design)
  1573: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const winnerHandleProp = propList.find(p => p.toLowerCase().includes('winner_handle'))
      || 'challenge_stats.winner_handle';
    const handleProp = propList.find(p => p.toLowerCase() === 'handle') || 'handle';
    const challengeCountProp = propList.find(p => p.toLowerCase().includes('challenge_stats.count'))
      || 'challenge_stats.count';
    const countProp = propList.find(p => p.toLowerCase() === 'count') || 'count';
    const maxRatingProp = propList.find(p => p.toLowerCase().includes('max_rating'))
      || 'member_profile_advanced.max_rating';
    const rankProp = propList.find(p => p.toLowerCase() === 'rank') || 'rank';
    return {
      path: '/statistics/design/rux-first-place-wins',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map((r) => {
        const wins = Number(pickDefined(r && r.wins_count, r && r.count, 0)) || 0;
        const maxRating = pickDefined(r && r.max_rating, null);
        const mapped = {
          [winnerHandleProp]: r.handle,
          [handleProp]: r.handle,
          [challengeCountProp]: wins,
          [countProp]: wins,
          [maxRatingProp]: maxRating,
          [rankProp]: Number(r && r.rank) || 0,
        };
        return mapped;
      }),
    };
  },
  // RUX Placements (Design)
  1574: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
    const winnerHandleProp = propList.find(p => p.toLowerCase().includes('winner_handle'))
      || 'challenge_stats.winner_handle';
    const handleProp = propList.find(p => p.toLowerCase() === 'handle') || 'handle';
    const challengeCountProp = propList.find(p => p.toLowerCase().includes('challenge_stats.count'))
      || 'challenge_stats.count';
    const countProp = propList.find(p => p.toLowerCase() === 'count') || 'count';
    const maxRatingProp = propList.find(p => p.toLowerCase().includes('max_rating'))
      || 'member_profile_advanced.max_rating';
    const rankProp = propList.find(p => p.toLowerCase() === 'rank') || 'rank';
    return {
      path: '/statistics/design/rux-placements',
      transform: rows => (Array.isArray(rows) ? rows : [rows]).map((r) => {
        const placements = Number(pickDefined(r && r.placements_count, r && r.count, 0)) || 0;
        const maxRating = pickDefined(r && r.max_rating, null);
        const mapped = {
          [winnerHandleProp]: r.handle,
          [handleProp]: r.handle,
          [challengeCountProp]: placements,
          [countProp]: placements,
          [maxRatingProp]: maxRating,
          [rankProp]: Number(r && r.rank) || 0,
        };
        return mapped;
      }),
    };
  },
};

// Infer a reports-api-v6 endpoint and a transformer based on Looker props.
// This allows us to support the community/statistics page without knowing all
// Looker IDs ahead of time, by recognizing common property/table patterns.
function inferFromProps(props) {
  const { property, table, render } = props;
  const cols = parseTableDef(table);
  const headers = (cols || []).map(c => String(c.headerName || ''));
  const lowerHeaders = headers.map(h => h.toLowerCase());
  const lowerProps = (cols || []).map(c => String(c.property || '').toLowerCase());

  // Header metrics (single value)
  if (property && !cols) {
    const prop = String(property).toLowerCase();
    if (prop === 'user.count') {
      return {
        path: '/statistics/general/member-count',
        transform: data => [{ 'user.count': Number(data.count) || 0 }],
      };
    }
    if (prop === 'challenge.count') {
      return {
        path: '/statistics/general/completed-challenges',
        transform: data => [{ 'challenge.count': Number(data.count) || 0 }],
      };
    }
    if (
      prop === 'total'
      || prop.includes('total')
      || prop.includes('prize')
      || prop.includes('payment')
      || prop.includes('amount')
    ) {
      return {
        path: '/statistics/general/total-prizes',
        transform: data => [{ [property]: data.total }],
      };
    }
  }

  // General tab tables
  if (cols && cols.length) {
    const propList = cols.map(c => String(c.property || ''));
    const hasCountry = propList.some(p => p.toLowerCase().includes('country'));
    const hasHandle = propList.some(p => p.toLowerCase().includes('handle'));
    const hasCopilot = propList.some(p => p.toLowerCase().includes('copilot'));
    const hasReview = propList.some(p => p.toLowerCase().includes('review'));
    const hasChallengeCount = propList.some(p => p.toLowerCase() === 'challenge.count');
    const hasUserCount = propList.some(p => p.toLowerCase() === 'user.count');
    const hasFirstPlace = propList.some(p => p.toLowerCase().includes('first_place'));

    // Design tab: UI Design Wins (by member)
    const looksLikeUiDesignWins = (
      hasHandle
      && (
        lowerHeaders.some(h => (h.includes('ui') && h.includes('win')))
        || lowerProps.some(p => (p.includes('ui') && p.includes('win')))
        || lowerHeaders.some(h => (h.includes('design') && h.includes('wins')))
      )
    );
    if (looksLikeUiDesignWins) {
      const nameProp = propList.find(p => p.toLowerCase().includes('handle')) || 'handle';
      const valueProp = propList.find(p => p.toLowerCase().includes('win'))
        || propList.find(p => (p && p.toLowerCase() !== 'rank' && !p.toLowerCase().includes('handle')))
        || 'wins';
      return {
        path: '/statistics/design/ui-design-wins',
        transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
          [nameProp]: r.handle,
          [valueProp]: Number(pickDefined(r && r.wins_count, r && r.count, 0)) || 0,
        })),
      };
    }

    // Design tab: F2F Wins (by member)
    const containsF2FSynonym = s => (
      s.includes('f2f')
      || s.includes('first2finish')
      || s.includes('first 2 finish')
      || s.includes('first-to-finish')
      || s.includes('first to finish')
    );
    const headersMentionF2F = lowerHeaders.some(h => containsF2FSynonym(h));
    const propsMentionF2F = lowerProps.some(p => containsF2FSynonym(p));
    const headersMentionF2FWins = lowerHeaders.some(
      h => containsF2FSynonym(h) && (h.includes('win') || h.includes('wins')),
    );
    const propsMentionF2FWins = lowerProps.some(
      p => containsF2FSynonym(p) && (p.includes('win') || p.includes('wins')),
    );
    const looksLikeF2FWins = (
      hasHandle
      && (headersMentionF2FWins || propsMentionF2FWins || headersMentionF2F || propsMentionF2F)
    );
    if (looksLikeF2FWins) {
      const nameProp = propList.find(p => p.toLowerCase().includes('handle')) || 'handle';
      const valueProp = propList.find(p => p.toLowerCase().includes('win'))
        || propList.find(p => (p && p.toLowerCase() !== 'rank' && !p.toLowerCase().includes('handle')))
        || 'wins';
      return {
        path: '/statistics/design/f2f-wins',
        transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
          [nameProp]: r.handle,
          [valueProp]: Number(pickDefined(r && r.wins_count, r && r.count, 0)) || 0,
        })),
      };
    }

    // Design tab: First Time Submitters (by date)
    const looksLikeFirstTimeSubmitters = (
      hasHandle && (
        lowerHeaders.some(h => (h.includes('first time') || h.includes('first-time')))
        || lowerProps.some(p => p.includes('first') && p.includes('submission'))
        || lowerProps.some(p => p.includes('date'))
      )
    );
    if (looksLikeFirstTimeSubmitters) {
      const nameProp = propList.find(p => p.toLowerCase().includes('handle')) || 'handle';
      const dateProp = propList.find(p => p.toLowerCase().includes('date'))
        || propList.find(p => (p && p.toLowerCase() !== 'rank' && !p.toLowerCase().includes('handle')))
        || 'first_submission_date';
      return {
        path: '/statistics/design/first-time-submitters',
        transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
          [nameProp]: r.handle,
          [dateProp]: r.first_submission_date,
        })),
      };
    }

    // Design tab: Countries Represented (Design submitters)
    const looksLikeDesignCountries = (
      lowerHeaders.some(h => h.includes('countries represented'))
      || (hasCountry && hasUserCount && lowerHeaders.some(h => h.includes('design')))
    );
    if (looksLikeDesignCountries) {
      return {
        path: '/statistics/design/countries-represented',
        transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
          [propList.find(p => p.toLowerCase().includes('country')) || 'country.country_name']:
            countryNameFromCode(r.country_code),
          [propList.find(p => p.toLowerCase() === 'user.count') || 'user.count']:
            Number(r.members_count) || 0,
        })),
      };
    }

    // Design tab: 1st Place Finishes by Country
    const looksLikeDesignFirstPlace = (
      hasCountry && (
        lowerHeaders.some(h => (h.includes('1st place') || h.includes('first place')))
        || hasFirstPlace
      )
    );
    if (looksLikeDesignFirstPlace) {
      const nameProp = propList.find(p => p.toLowerCase().includes('country')) || 'country.country_name';
      const valueProp = propList.find(p => p.toLowerCase().includes('first_place'))
        || propList.find(p => (p && p.toLowerCase() !== 'rank' && !p.toLowerCase().includes('country')))
        || 'first_place_count';
      return {
        path: '/statistics/design/first-place-by-country',
        transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
          [nameProp]: countryNameFromCode(r.country_code),
          [valueProp]: Number(r.first_place_count) || 0,
        })),
      };
    }

    // Countries represented: expect country + user.count
    if (hasCountry && hasUserCount) {
      return {
        path: '/statistics/general/countries-represented',
        transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
          [propList.find(p => p.toLowerCase().includes('country')) || 'country.country_name']:
            countryNameFromCode(r.country_code),
          [propList.find(p => p.toLowerCase() === 'user.count') || 'user.count']:
            Number(r.members_count) || 0,
        })),
      };
    }

    // First place by country: expect country + a numeric count field.
    if (hasCountry && (hasFirstPlace || (!hasUserCount && !hasCopilot && !hasReview))) {
      let valueProp = propList.find(p => p.toLowerCase().includes('first_place'))
        || propList.find(p => p.toLowerCase() === 'user.count');
      if (!valueProp) {
        valueProp = propList.find(p => (
          p
          && !p.toLowerCase().includes('country')
          && p.toLowerCase() !== 'rank'
        )) || 'first_place_count';
      }

      const nameProp = propList.find(p => p.toLowerCase().includes('country')) || 'country.country_name';

      if (valueProp && valueProp.toLowerCase() === 'user.count') {
        // Do nothing; countries-represented case above will match.
      } else {
        return {
          path: '/statistics/general/first-place-by-country',
          transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
            [nameProp]: countryNameFromCode(r.country_code),
            [valueProp]: Number(r.first_place_count) || 0,
          })),
        };
      }
    }

    // Copiloted challenges: expect copilot handle + challenge.count
    if ((hasCopilot || hasHandle) && hasChallengeCount) {
      const nameProp = propList.find(p => p.toLowerCase().includes('copilot'))
        || propList.find(p => p.toLowerCase().includes('handle'))
        || 'copilot.handle';
      return {
        path: '/statistics/general/copiloted-challenges',
        transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
          [nameProp]: r.handle,
          'challenge.count': Number(r.copiloted_challenges) || 0,
        })),
      };
    }

    // Reviews by member: expect handle + review count
    if ((hasHandle || hasCopilot) && hasReview) {
      const nameProp = propList.find(p => p.toLowerCase().includes('handle')) || 'handle';
      const valueProp = propList.find(p => p.toLowerCase().includes('review')) || 'review.count';
      return {
        path: '/statistics/general/reviews-by-member',
        transform: rows => (Array.isArray(rows) ? rows : [rows]).map(r => ({
          [nameProp]: r.handle,
          [valueProp]: Number(r.review_count) || 0,
        })),
      };
    }
  }

  // Render-based single value (e.g. used to prefix with currency symbol)
  if (!property && !cols && render) {
    try {
      const r = String(render).replace(/&q;/g, '"').replace(/'/g, '"');
      const matches = Array.from(r.matchAll(/data\s*\[\s*0\s*\]\s*\[\s*"([^"]+)"\s*\]/g));
      const referenced = matches.map(m => (m && m[1] ? m[1] : ''));
      const hasTotalPrizes = referenced.some((p) => {
        const pl = String(p).toLowerCase();
        return pl.includes('total') || pl.includes('prize') || pl.includes('payment') || pl.includes('amount');
      });
      if (hasTotalPrizes) {
        const key = referenced.find(p => p) || 'total';
        return {
          path: '/statistics/general/total-prizes',
          transform: data => [{ [key]: data.total }],
        };
      }
    } catch (e) {
      // swallow and fall back to legacy looker
    }
  }

  return null;
}

export default function SmartLooker(props) {
  const { lookerId } = props;
  const directEntry = LOOKER_TO_REPORTS_MAP[lookerId];
  let directConfig = null;
  if (typeof directEntry === 'function') directConfig = directEntry(props);
  else if (typeof directEntry === 'string') directConfig = { path: directEntry };
  else if (directEntry && typeof directEntry === 'object') directConfig = directEntry;

  const inferred = inferFromProps(props);
  const reportsPath = (directConfig && directConfig.path) || (inferred && inferred.path);
  const transformer = (directConfig && directConfig.transform) || (inferred && inferred.transform);

  const [state, setState] = React.useState({
    loading: !!reportsPath,
    error: null,
    lookerInfo: null,
  });

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!reportsPath) return;
      setState(s => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetch(`${config.API.V6}/reports${reportsPath}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let lookerData = Array.isArray(data) ? data : [data];
        if (typeof transformer === 'function') {
          const transformed = transformer(data);
          if (Array.isArray(transformed)) lookerData = transformed;
          else if (transformed !== undefined && transformed !== null) {
            lookerData = [transformed];
          } else lookerData = [];
        }
        if (!cancelled) setState({ loading: false, error: null, lookerInfo: { lookerData } });
      } catch (e) {
        if (!cancelled) {
          setState({
            loading: false,
            error: e.message,
            lookerInfo: { lookerData: [] },
          });
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [lookerId, reportsPath]);

  if (!reportsPath) {
    // Fall back to legacy behavior for non-mapped lookerIds
    return (
      <OriginalLookerContainer {...props} />
    );
  }

  if (state.loading && !state.lookerInfo) return 'loading...';
  if (state.error) return state.error;

  return (
    <Looker {...props} lookerInfo={state.lookerInfo} />
  );
}

SmartLooker.propTypes = {
  lookerId: PT.string.isRequired,
};
