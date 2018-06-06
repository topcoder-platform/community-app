import TrackIcon from 'components/TrackIcon';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import LeaderboardAvatar from 'components/challenge-listing/LeaderboardAvatar';

import TrackAbbreviationTooltip from '../Tooltips/TrackAbbreviationTooltip';
import PastSRMCard from './PastSRMCard';

require('./style.scss');

// Mock REGISTRANTS array
let MOCK_REGISTRANTS = [
  {
    handle: 'ACRush',
    photoURL: 'https://acrobatusers.com/assets/images/template/author_generic.jpg',
    isSmr: true,
  },
  {
    handle: 'tourist',
    photoURL: 'https://acrobatusers.com/assets/images/template/author_generic.jpg',
    isSmr: true,
  },
  {
    handle: 'RiaDWaW',
    isSmr: true,
  },
  {
    handle: 'KalininN',
    isSmr: true,
  },
  {
    handle: 'KalininN',
    isSmr: true,
  },
  {
    handle: 'KalininN',
    isSmr: true,
  },
];

const MAX_VISIBLE_REGISTRANTS = 4;

const lastItem = {
  handle: `+${MOCK_REGISTRANTS.length - MAX_VISIBLE_REGISTRANTS}`,
};
MOCK_REGISTRANTS = MOCK_REGISTRANTS.slice(0, MAX_VISIBLE_REGISTRANTS);
MOCK_REGISTRANTS.push(lastItem);

const renderLeaderboard = MOCK_REGISTRANTS.map((winner, index) => (
  <div className="avatar-container" key={winner.handle}>
    <LeaderboardAvatar member={winner} />
    {index < MOCK_REGISTRANTS.length - 1 ? <div className="name">{winner.handle}</div> : ''}
  </div>
));

// Happening now
const HappeningNow = () => (
  <div className="SRMCard now">
    <div className="left-panel">
      <div className="SRM-track">
        <TrackAbbreviationTooltip track="DATA_SCIENCE" subTrack="SRM">
          <TrackIcon track="DATA_SCIENCE" subTrack="SRM" tcoEligible="TCO" />
        </TrackAbbreviationTooltip>
      </div>
      <div className="SRM-details">
        <p className="open-title">Happening now: SRM 678</p>
        <div className="SRM-open-info">
          <p className="registered">156 registered members</p>
          <p className="registeration-ends">Registration ends in 24 min.</p>
        </div>
      </div>
    </div>
    <div className="right-panel now">
      <div className="SRM-registrants">
        {renderLeaderboard}
      </div>
    </div>
    <a href="" className="register-button">
      <span className="to-register">+ Register</span>
    </a>
  </div>
);

// upcoming SRMs
const UpcomingSRMs = ({ srmChallenge }) => (
  <div className="SRMCard upcoming">
    <div className="left-panel upcoming">
      <div className="SRM-track">
        <TrackAbbreviationTooltip track="DATA_SCIENCE" subTrack="SRM">
          <TrackIcon track="DATA_SCIENCE" subTrack="SRM" />
        </TrackAbbreviationTooltip>
      </div>
      <div className="SRM-details">
        <p className="upcoming-title">Competitive Programming - {srmChallenge.name}</p>
        <div className="SRM-date">{moment(srmChallenge.startDate).format('MMM DD, YYYY hh:mm a')}</div>
      </div>
    </div>
    <div className="right-panel upcoming">
      <div className="SRM-date">{moment(srmChallenge.startDate).format('MMM DD, YYYY hh:mm a')}</div>
      <a href="" className="notify-me">Notify me</a>
    </div>
    <a href="" className="notify-button">
      <span className="notify-me">+ Notify me</span>
    </a>
  </div>
);

UpcomingSRMs.defaultProps = {
  srmChallenge: null,
};

UpcomingSRMs.propTypes = {
  srmChallenge: PT.shape().isRequired,
};

// past SRMs
const PastSRMs = () => (
  <div>
    <PastSRMCard />
    <PastSRMCard />
    <PastSRMCard />
  </div>
);

/*
* SRM card
*/
const SRMCard = ({ category, srmChallenge }) => (
  <div className="SRMCard-container">
    {category === 'now' ? <HappeningNow /> : ''}
    {category === 'upcoming' ? <UpcomingSRMs srmChallenge={srmChallenge} /> : ''}
    {category === 'past' ? <PastSRMs /> : ''}
  </div>
);

SRMCard.defaultProps = {
  category: null,
  srmChallenge: null,
};

SRMCard.propTypes = {
  category: PT.string.isRequired,
  srmChallenge: PT.shape(),
};

export default SRMCard;
