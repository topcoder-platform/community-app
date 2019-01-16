import React from 'react';
import PT from 'prop-types';

import { timeDiff, localTime } from 'utils/tc';
import { config } from 'topcoder-react-utils';

import './SRMTile.scss';

const SRMTile = (props) => {
  const { srm } = props;
  return (
    <div styleName="srm tile-view">
      {
        srm.status === 'FUTURE'
        && (
        <div>
          <div styleName="challenge-track" />
          <header>
            <a styleName="noclick">
              {srm.name}
            </a>
          </header>
          <div styleName="srm-details">
            <p styleName="starts-in">
              Starts in
              {' '}
              {
                <span>
                  {`${timeDiff(srm.rounds[0].registrationStartAt, 'quantity')}
                  ${timeDiff(srm.rounds[0].registrationStartAt, 'unit')}`}
                </span>
              }
            </p>
            <div styleName="srm-calendar">
              <span styleName="day">
                {localTime(srm.rounds[0].registrationStartAt, 'DD')}
              </span>
              <span styleName="month">
                {localTime(srm.rounds[0].registrationStartAt, 'MMM')}
              </span>
              <span styleName="hour">
                {localTime(srm.rounds[0].registrationStartAt, 'hh:mm a')}
              </span>
              <span styleName="time-zone">
                {localTime(srm.rounds[0].registrationStartAt, 'z')}
              </span>
            </div>
          </div>
          <div styleName="phase-status">
            {srm.userStatus === 'registered' && (
            <div styleName="registered">
Registered
            </div>
            )}
            {
              srm.userStatus !== 'registered'
              && (
              <div>
                <a
                  href={`${config.URL.COMMUNITY}/tc`
                    + `?module=MatchDetails&rd=${srm.rounds[0] && srm.rounds[0].id}`}
                  styleName="tc-btn"
                  className="tc-btn tc-btn-s tc-btn-wide"
                >
Register
                </a>
              </div>
              )
            }
          </div>
        </div>
        )
      }
    </div>
  );
};

SRMTile.propTypes = {
  srm: PT.shape().isRequired,
};

export default SRMTile;
