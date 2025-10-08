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

const LOOKER_TO_REPORTS_MAP = {
  // SRM datasets (static JSON served by reports-api-v6)
  1653: '/statistics/srm/top-rated',
  1657: '/statistics/srm/country-ratings',
  1654: '/statistics/srm/competitions-count',
};

export default function SmartLooker(props) {
  const { lookerId } = props;
  const reportsPath = LOOKER_TO_REPORTS_MAP[lookerId];

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
        const lookerData = Array.isArray(data) ? data : [data];
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
  }, [lookerId]);

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
