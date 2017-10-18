/**
 * Payment row in payments listing.
 */

import PT from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import PaymentStatus from '../PaymentStatus';
import TrackAbbreviationTooltip from '../../../../challenge-listing/Tooltips/TrackAbbreviationTooltip';
import TrackIcon from '../../../../TrackIcon';
import Avatar from '../../../../Avatar';
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
      <td styleName="name"><Link to="/sandbox/payments/123">{challenge.name}</Link></td>
      <td styleName="price">{`$${challenge.prizes[0]}`}</td>
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
