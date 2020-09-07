import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { config, Link } from 'topcoder-react-utils';
import qs from 'qs';

export default function TrackInfoInner(props) {
  const { track, taxonomy, theme } = props;
  return (
    <div className={theme.trackInfosInner}>
      <Link className={theme.trackTitle} to={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_TRACKS_PATH}?${qs.stringify({ track })}`}>
        {track}
      </Link>
      {
        taxonomy[track] ? (
          <div className={theme.trackSubs}>
            {
              _.map(
                _.sortBy(taxonomy[track], ['name']), tax => <Link to={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_TRACKS_PATH}?${qs.stringify({ track, tax: tax.name })}`} key={`${track}:${tax.name}`}>{tax.name}</Link>,
              )
            }
          </div>
        ) : null
      }
    </div>
  );
}

TrackInfoInner.propTypes = {
  track: PT.string.isRequired,
  taxonomy: PT.shape().isRequired,
  theme: PT.shape().isRequired,
};
