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
  // Countries Represented
  1127: (props) => {
    const cols = parseTableDef(props.table) || [];
    const propList = cols.map(c => String(c.property || ''));
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
        [valueProp]: Number((r && (r.wins_count ?? r.count)) || 0),
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
        [valueProp]: Number((r && (r.wins_count ?? r.count)) || 0),
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
    // Total prizes: property names may vary. Cover common cases.
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

    const removedOption = lowerHeaders.some(h => (
      h.includes('wireframe wins')
      || h.includes('lux 1st place wins')
      || h.includes('lux placements')
      || h.includes('rux 1st place wins')
      || h.includes('rux placements')
      || (h.includes('wireframe') && h.includes('win'))
      || (h.includes('lux') && (h.includes('1st') || h.includes('first')) && (h.includes('win')))
      || (h.includes('lux') && h.includes('placement'))
      || (h.includes('rux') && (h.includes('1st') || h.includes('first')) && (h.includes('win')))
      || (h.includes('rux') && h.includes('placement'))
    ));
    if (removedOption) {
      return {
        path: null,
        transform: () => ([]),
      };
    }

    // MM tiles are handled via direct Looker ID mappings.

    // Design tab: UI Design Wins (by member)
    const looksLikeUiDesignWins = (
      (hasHandle)
      && (
        lowerHeaders.some(h => (h.includes('ui') && h.includes('win'))) // header mentions UI + wins
        || lowerProps.some(p => (p.includes('ui') && p.includes('win')))
        || lowerHeaders.some(h => (h.includes('design') && h.includes('wins')))
      )
    );
    if (looksLikeUiDesignWins) {
      const nameProp = propList.find(p => p.toLowerCase().includes('handle')) || 'handle';
      // choose a numeric/value column property name from the table definition
      const valueProp = propList.find(p => p.toLowerCase().includes('win'))
        || propList.find(p => (p && p.toLowerCase() !== 'rank' && !p.toLowerCase().includes('handle')))
        || 'wins';
      return {
        path: '/statistics/design/ui-design-wins',
        transform: rows => rows.map(r => ({
          [nameProp]: r.handle,
          [valueProp]: Number((r && (r.wins_count ?? r.count)) || 0),
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
    const looksLikeF2FWins = (
      hasHandle && (
        lowerHeaders.some(h => (containsF2FSynonym(h) && (h.includes('win') || h.includes('wins') || true)))
        || lowerProps.some(p => (containsF2FSynonym(p) && (p.includes('win') || p.includes('wins') || true)))
      )
    );
    if (looksLikeF2FWins) {
      const nameProp = propList.find(p => p.toLowerCase().includes('handle')) || 'handle';
      const valueProp = propList.find(p => p.toLowerCase().includes('win'))
        || propList.find(p => (p && p.toLowerCase() !== 'rank' && !p.toLowerCase().includes('handle')))
        || 'wins';
      return {
        path: '/statistics/design/f2f-wins',
        transform: rows => rows.map(r => ({
          [nameProp]: r.handle,
          [valueProp]: Number((r && (r.wins_count ?? r.count)) || 0),
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
        transform: rows => rows.map(r => ({
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
        transform: rows => rows.map(r => ({
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
        transform: rows => rows.map(r => ({
          [nameProp]: countryNameFromCode(r.country_code),
          [valueProp]: Number(r.first_place_count) || 0,
        })),
      };
    }

    // Countries represented: expect country + user.count
    if (hasCountry && hasUserCount) {
      return {
        path: '/statistics/general/countries-represented',
        transform: rows => rows.map(r => ({
          // Use whatever property the table asked for to label country
          [propList.find(p => p.toLowerCase().includes('country')) || 'country.country_name']:
            countryNameFromCode(r.country_code),
          [propList.find(p => p.toLowerCase() === 'user.count') || 'user.count']:
            Number(r.members_count) || 0,
        })),
      };
    }

    // First place by country: expect country + a numeric count field.
    // In Contentful, the numeric column property has varied, so fall back to
    // the first non-country, non-rank property when we don't explicitly see
    // `first_place` or `user.count`.
    if (hasCountry && (hasFirstPlace || (!hasUserCount && !hasCopilot && !hasReview))) {
      // Prefer an explicit first_place column, else user.count, else the first
      // non-country/non-rank column as the value property.
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

      // Heuristic guard: if this looks like the Countries Represented table
      // (i.e. valueProp resolved to user.count) let the dedicated block above
      // handle it instead of mapping to first-place.
      if (valueProp && valueProp.toLowerCase() === 'user.count') {
        // Do nothing; countries-represented case above will match.
      } else {
        return {
          path: '/statistics/general/first-place-by-country',
          transform: rows => rows.map(r => ({
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
        transform: rows => rows.map(r => ({
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
        transform: rows => rows.map(r => ({
          [nameProp]: r.handle,
          [valueProp]: Number(r.review_count) || 0,
        })),
      };
    }
  }

  // Render-based single value (e.g. used to prefix with currency symbol)
  // Try to infer the data source by inspecting referenced fields in the render function.
  if (!property && !cols && render) {
    try {
      const r = String(render).replace(/&q;/g, '"').replace(/'/g, '"');
      // Find all occurrences of data[0]["prop"]
      const matches = Array.from(r.matchAll(/data\s*\[\s*0\s*\]\s*\[\s*"([^"]+)"\s*\]/g));
      const referenced = matches.map(m => (m && m[1] ? m[1] : ''));
      const hasTotalPrizes = referenced.some((p) => {
        const pl = String(p).toLowerCase();
        return pl.includes('total') || pl.includes('prize') || pl.includes('payment') || pl.includes('amount');
      });
      if (hasTotalPrizes) {
        // Use the first referenced property as the key expected by the render function
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
  const blocked = Boolean(inferred && Object.prototype.hasOwnProperty.call(inferred, 'path') && inferred.path === null);

  const [state, setState] = React.useState({
    loading: !!reportsPath,
    error: null,
    lookerInfo: null,
  });

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (blocked) return; // Hide removed/unsupported tiles entirely
      if (!reportsPath) return;
      setState(s => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetch(`${config.API.V6}/reports${reportsPath}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let lookerData = Array.isArray(data) ? data : [data];
        if (typeof transformer === 'function') {
          lookerData = transformer(Array.isArray(data) ? data : data);
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

  if (blocked) return null; // Do not render removed options

  if (!reportsPath && !blocked) {
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
