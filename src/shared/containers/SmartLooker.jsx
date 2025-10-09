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

// Direct mappings from known Looker IDs to reports-api-v6 endpoints.
// These are the specific Looker tiles used by the /community/statistics page
// that we want to source from the new reports service instead of legacy Looker.
const LOOKER_TO_REPORTS_MAP = {
  // SRM datasets (static JSON served by reports-api-v6)
  1653: '/statistics/srm/top-rated',
  1657: '/statistics/srm/country-ratings',
  1654: '/statistics/srm/competitions-count',
  // NOTE: Additional general statistics Looker IDs can be added here as they
  // are identified in content (e.g. header metrics and general tab tables).
};

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

// Infer a reports-api-v6 endpoint and a transformer based on Looker props.
// This allows us to support the community/statistics page without knowing all
// Looker IDs ahead of time, by recognizing common property/table patterns.
function inferFromProps(props) {
  const { property, table, render } = props;
  const cols = parseTableDef(table);

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

    // Countries represented: expect country + user.count
    if (hasCountry && hasUserCount) {
      return {
        path: '/statistics/general/countries-represented',
        transform: rows => rows.map(r => ({
          // Use whatever property the table asked for to label country
          [propList.find(p => p.toLowerCase().includes('country')) || 'country.country_name']:
            r.country_code,
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
            [nameProp]: r.country_code,
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
  const direct = LOOKER_TO_REPORTS_MAP[lookerId];
  const inferred = inferFromProps(props);
  const reportsPath = direct || (inferred && inferred.path);

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
        if (inferred && typeof inferred.transform === 'function') {
          lookerData = inferred.transform(Array.isArray(data) ? data : data);
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
