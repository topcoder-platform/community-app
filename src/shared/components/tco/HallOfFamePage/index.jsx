/**
 * TCO Hall of Fame Page.  Allow user to select a TCO event and view the winners, contestants
 * and other information about the event.
 */
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton, Button } from 'topcoder-react-ui-kit';

import { getEvent, getChampionsCount, getFinalistsCount } from 'utils/hall-of-fame';

import countriesIcon from 'assets/images/tco-countries-icon.png';
import finalistsIcon from 'assets/images/tco-finalists-icon.png';
import prizesIcon from 'assets/images/tco-prizes-icon.png';
import trophyIcon from 'assets/images/tco-trophy-icon.png';

import Champions from './Champions';
import EventCarousel from './EventCarousel';
import Finalists from './Finalists';
import TripWinners from './TripWinners';

import './styles.scss';

const HallOfFamePage = ({ eventId, onSelectEvent }) => {
  const data = getEvent(eventId).data;

  return (
    <div styleName="outer-container">
      <div styleName="page">

        <div styleName="header">
          <h1>TCO Hall of Fame</h1>
          <EventCarousel eventId={eventId} onSelectEvent={onSelectEvent} />
        </div>

        <div styleName="body">
          <div styleName="event">

            <div styleName="button-container">
              <div styleName="logo">
                <img src={data.logo} alt={`Logo for TCO${eventId}`} />
              </div>
              <strong>{data.location}</strong>
              <p>{data.date}</p>
              <div styleName="button-wrapper"><PrimaryButton styleName="learn-more" to={data.learnMoreURL} openNewTab>Learn More</PrimaryButton></div>
              <div styleName="button-wrapper"><Button styleName="browse-gallery" to={data.browseGalleryURL} openNewTab>Browse Gallery</Button></div>
            </div>

            <div styleName="banner">
              <img src={data.banner} alt={`Banner for TCO${eventId}`} />
            </div>

            <div styleName="event-stats">
              <div styleName="stats-box">
                <img src={prizesIcon} alt="Prizes Icon" />
                <div>
                  <h4>{data.totalPrizes}</h4>
                  <span>Total Prizes</span>
                </div>
              </div>
              <div styleName="stats-box">
                <img src={trophyIcon} alt="Champions Icon" />
                <div>
                  <h4>{getChampionsCount(data)} Champions</h4>
                  <span>Competition Tracks</span>
                </div>
              </div>
              <div styleName="stats-box">
                <img src={finalistsIcon} alt="Finalists Icon" />
                <div>
                  <h4>{getFinalistsCount(data)}</h4>
                  <span>TCO Finalists</span>
                </div>
              </div>
              <div styleName="stats-box">
                <img src={countriesIcon} alt="Countries Icon" />
                <div>
                  <h4>{data.countryCount}</h4>
                  <span>Countries</span>
                </div>
              </div>
            </div>
          </div>

          <div styleName="finalists">
            <h2>TCO{eventId} Finalists</h2>
            <Finalists data={data} />
          </div>
          {
            data.tripWinners && (
              <div styleName="trip-winners">
                <h3>Trip Winners</h3>
                <TripWinners roles={data.tripWinners} />
              </div>
            )
          }
        </div>

        <div styleName="fun-facts">
          Fun Facts Here
        </div>

        <div styleName="champions">
          <h3>TCO All Time Champions</h3>
          <Champions />
          <div styleName="button-wrapper-view-all"><PrimaryButton>View All tracks</PrimaryButton></div>
        </div>

      </div>
    </div>
  );
};

HallOfFamePage.defaultProps = {
  eventId: '17',
};

HallOfFamePage.propTypes = {
  eventId: PT.string,
  onSelectEvent: PT.func.isRequired,
};

export default HallOfFamePage;
