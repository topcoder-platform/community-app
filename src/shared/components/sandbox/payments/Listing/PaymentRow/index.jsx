/**
 * Payment row in payments listing.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import { config, Link } from 'topcoder-react-utils';
import { Avatar } from 'topcoder-react-ui-kit';
import { getCdnAvatarUrl } from 'utils/tc';

import PaymentStatus from '../PaymentStatus';
import TrackAbbreviationTooltip from '../../../../challenge-listing/Tooltips/TrackAbbreviationTooltip';
import TrackIcon from '../../../../TrackIcon';
import './style.scss';

export default function PaymentRow({ challenge }) {
  let winner = challenge.winners || [];
  [winner] = winner.filter(x => x.type === 'final');

  return (
    <tr styleName="paymentRow">
      <td styleName="icon">
        <TrackAbbreviationTooltip track={challenge.track} subTrack={challenge.subTrack}>
          <span>
            <TrackIcon
              track={challenge.track}
              subTrack={challenge.subTrack}
              tcoEligible={challenge.events ? challenge.events[0].eventName : ''}
              isDataScience={challenge.isDataScience}
            />
          </span>
        </TrackAbbreviationTooltip>
      </td>
      <td styleName="name">
        <Link
          to={`/sandbox/payments/${challenge.id}`}
        >{challenge.name}
        </Link>
      </td>
      <td styleName="price">{`$${_.get(challenge, 'prizes[0]', '-')}`}</td>
      <td>
        {
          winner ? (
            <div styleName="member">
              <Avatar
                styleName="memberAvatar"
                url={getCdnAvatarUrl(winner.photoURL, 32)}
              />
              <span
                styleName="memberName"
              >
                <Link
                  enforceA
                  openNewTab
                  to={`${config.URL.BASE}/members/${winner.handle}`}
                >{winner.handle}
                </Link>
              </span>
            </div>
          ) : 'N/A'
        }
      </td>
      <td><PaymentStatus status={challenge.status} text={challenge.status} /></td>
    </tr>
  );
}

PaymentRow.propTypes = {
  challenge: PT.shape({
    id: PT.number,
    winners: PT.arrayOf(PT.object),
  }).isRequired,
};
