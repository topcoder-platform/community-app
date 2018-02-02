/**
 * Payment row in payments listing.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from 'topcoder-react-ui-kit';

import PaymentStatus from '../PaymentStatus';
import TrackAbbreviationTooltip from '../../../../challenge-listing/Tooltips/TrackAbbreviationTooltip';
import TrackIcon from '../../../../TrackIcon';
import './style.scss';

export default function PaymentRow({ challenge }) {
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
        >{challenge.name}</Link>
      </td>
      <td styleName="price">{`$${_.get(challenge, 'prizes[0]', '-')}`}</td>
      <td><Avatar styleName="memberAvatar" /><span styleName="memberName">{challenge.member || 'TOPCODER'}</span></td>
      <td><PaymentStatus status={challenge.status} text={challenge.status} /></td>
    </tr>
  );
}

PaymentRow.propTypes = {
  challenge: PT.shape({
    id: PT.number,
  }).isRequired,
};
