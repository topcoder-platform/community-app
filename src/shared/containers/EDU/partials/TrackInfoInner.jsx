import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import qs from 'qs';

export default function TrackInfoInner(props) {
  const { track, taxonomy, theme } = props;
  return (
    <div className={theme.trackInfosInner}>
      <a className={theme.trackTitle} href={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_TRACKS_PATH}?${qs.stringify({ track })}`}>
        {track}
      </a>
      {
        taxonomy[track] ? (
          <div className={theme.trackSubs}>
            {
              _.map(taxonomy[track], tax => <a href={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_TRACKS_PATH}?${qs.stringify({ track, tax: tax.name })}`} key={`${track}:${tax.name}`}>{tax.name}</a>)
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
