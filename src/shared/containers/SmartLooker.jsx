/**
 * SmartLooker bridges legacy <Looker lookerId="..." /> usages to the new
 * reports-api-v6 endpoints for the /community/statistics page. The reports
 * service now mirrors the original Looker schemas, so we simply proxy data
 * from the API to the existing Looker component.
 */
import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import Looker from 'components/Looker';

const LOOKER_TO_REPORTS_PATH = {
  1127: '/statistics/development/challenges-technology',
  1129: '/statistics/development/countries-represented',
  1130: '/statistics/development/first-place-wins',
  1131: '/statistics/development/prototype-wins',
  1132: '/statistics/development/code-wins',
  1133: '/statistics/development/f2f-wins',
  1135: '/statistics/design/first-place-by-country',
  1136: '/statistics/design/countries-represented',
  1138: '/statistics/design/ui-design-wins',
  1140: '/statistics/design/wireframe-wins',
  1141: '/statistics/design/f2f-wins',
  1146: '/statistics/general/copiloted-challenges',
  1148: '/statistics/general/countries-represented',
  1149: '/statistics/general/first-place-by-country',
  1150: '/statistics/general/reviews-by-member',
  1172: '/statistics/development/first-time-submitters',
  1178: '/statistics/design/first-time-submitters',
  1571: '/statistics/design/lux-first-place-wins',
  1572: '/statistics/design/lux-placements',
  1573: '/statistics/design/rux-first-place-wins',
  1574: '/statistics/design/rux-placements',
  1652: '/statistics/mm/top-rated',
  1653: '/statistics/srm/top-rated',
  1654: '/statistics/srm/competitions-count',
  1655: '/statistics/mm/competitions-count',
  1656: '/statistics/mm/top-10-finishes',
  1657: '/statistics/srm/country-ratings',
  1658: '/statistics/mm/country-ratings',
  1700: '/statistics/qa/wins',
};

function inferFromProps(property, render) {
  if (property) {
    const normalized = String(property).toLowerCase();
    if (normalized === 'user.count') {
      return { path: '/statistics/general/member-count' };
    }
    if (normalized === 'challenge.count') {
      return { path: '/statistics/general/completed-challenges' };
    }
    if (
      normalized === 'total'
      || normalized.includes('total')
      || normalized.includes('prize')
      || normalized.includes('payment')
      || normalized.includes('amount')
    ) {
      return {
        path: '/statistics/general/total-prizes',
        transform: data => ([{ [property]: data.total }]),
      };
    }
  }

  if (!property && render) {
    try {
      const source = String(render).replace(/&q;/g, '"').replace(/'/g, '"');
      const matches = Array.from(
        source.matchAll(/data\s*\[\s*0\s*]\s*\[\s*"([^"]+)"\s*]/g),
      );
      const referenced = matches.map(match => (match && match[1] ? match[1] : ''));
      const hasTotalPrizes = referenced.some((ref) => {
        const lower = ref.toLowerCase();
        return (
          lower.includes('total')
          || lower.includes('prize')
          || lower.includes('payment')
          || lower.includes('amount')
        );
      });
      if (hasTotalPrizes) {
        const key = referenced.find(ref => ref) || 'total';
        return {
          path: '/statistics/general/total-prizes',
          transform: data => ([{ [key]: data.total }]),
        };
      }
    } catch (err) {
      // swallow and fall through to unsupported handling
    }
  }

  return null;
}

export default function SmartLooker(props) {
  const { lookerId, property, render } = props;
  const directPath = LOOKER_TO_REPORTS_PATH[lookerId];
  const inferred = React.useMemo(
    () => (directPath ? null : inferFromProps(property, render)),
    [directPath, property, render],
  );
  const reportsPath = directPath || (inferred && inferred.path);
  const transformer = inferred && inferred.transform;

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
          } else {
            lookerData = [];
          }
        }
        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            lookerInfo: { lookerData },
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            loading: false,
            error: err.message,
            lookerInfo: { lookerData: [] },
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [lookerId, reportsPath, transformer]);

  if (!reportsPath) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(`SmartLooker: no reports mapping for Looker ID ${lookerId}`);
    }
    return 'Statistics report mapping missing.';
  }

  if (state.loading && !state.lookerInfo) return 'loading...';
  if (state.error) return state.error;

  return <Looker {...props} lookerInfo={state.lookerInfo} />;
}

SmartLooker.propTypes = {
  lookerId: PT.string.isRequired,
  property: PT.string,
  render: PT.func,
};
