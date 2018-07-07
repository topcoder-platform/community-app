/**
 * SRM tile.
 */
/* eslint-env browser */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import { formatDate } from 'utils/tc';
import './style.scss';

const SRMTile = ({ challenge, userId }) => {
  const roundId = challenge.rounds.length ? challenge.rounds[0].id : 0;
  const codingEndAt = challenge.rounds.length ? challenge.rounds[0].codingEndAt : '2000-01-01T00:00:00.000Z';
  const finalPoints = _.get(challenge.rounds, '0.userSRMDetails.finalPoints') || 0;
  const division = _.get(challenge.rounds, '0.userSRMDetails.division') || 0;
  const divisionPlacement = _.get(challenge.rounds, '0.userSRMDetails.divisionPlacement') || 0;
  const roomPlacement = _.get(challenge.rounds, '0.userSRMDetails.roomPlacement') || 0;

  return (
    <div key={`challenge-tile-${challenge.id}`} styleName="challenge tile srm-tile">
      <div styleName="srm tile-view">
        <div styleName="past-srm">
          <div styleName="challenge-track" />
          <header>
            <a href={`${config.URL.COMMUNITY}/stat?c=round_overview&rd=${roundId}`}>
              {challenge.name}
            </a>
            <div styleName="ended-on">
              <span>
                {formatDate(codingEndAt, true, true)}
              </span>
            </div>
          </header>
          <div styleName="member-stats">
            <p styleName="points">
              <span>
                {finalPoints}
              </span>
              <span>
Points
              </span>
            </p>
            <div styleName="ranks">
              <a styleName="division" href={`${config.URL.COMMUNITY}/stat?c=round_stats&rd=${roundId}&dn=${division}`}>
                <p>
                  {divisionPlacement}
                </p>
                <p styleName="last-child">
                  <span>
Division
                    {division}
                  </span>
                </p>
              </a>
              <a styleName="room" href={`${config.URL.COMMUNITY}/stat?c=coder_room_stats&cr=${userId}&rd=${roundId}`}>
                <p>
                  {roomPlacement}
                </p>
                <p styleName="last-child">
                  <span>
Room
                  </span>
                </p>
              </a>
            </div>
            <p styleName="placement">
Placement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

SRMTile.propTypes = {
  challenge: PT.shape().isRequired,
  userId: PT.number.isRequired,
};

export default SRMTile;
