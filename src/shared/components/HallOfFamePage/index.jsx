/**
 * TCO Hall of Fame Page.  Allow user to select a TCO event and view the winners, contestants
 * and other information about the event.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton, Button } from 'topcoder-react-ui-kit';

import { getEvents, processLinkData } from 'utils/hall-of-fame';
import Error404 from 'components/Error404';

import Champions from './Champions';
import EventCarousel from './EventCarousel';
import Finalists from './Finalists';
import FunFacts from './FunFacts';
import TripWinners from './TripWinners';

import './styles.scss';

const HallOfFamePage = ({ eventId, onSelectEvent, hallOfFame }) => {
  const events = getEvents(hallOfFame);
  let data = null;
  let finalists = null;
  let tripWinners = null;
  let champions = {};

  // Process Current Event
  let result = _.filter(events, e => e.versionId === eventId);
  if (result && result.length > 0) {
    data = _.assign({}, result[0]);
  }

  if (data) { // Get Event
    // Process Finalists
    result = _.filter(data.leaderboards, d => d.title === `TCO${eventId} Finalists`);
    if (result && result.length > 0) {
      finalists = _.assign({}, result[0]);
    }
    // Process Trip Winners
    result = _.filter(data.leaderboards, d => d.title === 'Trip Winners');
    if (result && result.length > 0) {
      tripWinners = _.assign({}, result[0]);
    }
    // Process All Time Champions
    _.set(champions, 'allTimeChampions', hallOfFame.allTimeChampions);
    result = processLinkData(champions, hallOfFame.includes);
    if (result) {
      champions = _.assign({}, result.allTimeChampions);
    }
  }


  return (
    <div styleName="outer-container">
      <div styleName="page">
        {
          !data ? <Error404 /> : undefined
        }
        {
          data ? (
            <div styleName="header">
              <h1>{hallOfFame.title.toUpperCase()} Hall of Fame</h1>
              <EventCarousel
                eventId={eventId}
                onSelectEvent={onSelectEvent}
                events={_.set({}, 'list', events)}
                eventType={hallOfFame.title}
              />
            </div>
          ) : undefined
        }

        {
          data ? (
            <div styleName="body">
              <div styleName="event">

                <div styleName="button-container">
                  <div styleName="logo">
                    <img src={data.promo.logo.file.url} alt={`Logo for ${hallOfFame.title.toUpperCase()}${eventId}`} />
                  </div>
                  <div styleName="location">
                    <strong>{data.promo.attributes[0].value}</strong>
                    <p>{data.promo.attributes[1].value}</p>
                  </div>
                  <div styleName="button-wrapper"><PrimaryButton styleName="learn-more" to={data.promo.links[0].url} openNewTab>{data.promo.links[0].title}</PrimaryButton></div>
                  <div styleName="button-wrapper"><Button styleName="browse-gallery" to={data.promo.links[1].url} openNewTab>{data.promo.links[1].title}</Button></div>
                </div>

                <div styleName="banner">
                  <img src={data.promo.bannerImage.file.url} alt={`Banner for ${hallOfFame.title.toUpperCase()}${eventId}`} />
                </div>

                <div styleName="event-stats">
                  <div styleName="stats-box">
                    <img src={data.promo.statistics[0].icon.file.url} alt="Prizes Icon" />
                    <div>
                      <h4>{data.promo.statistics[0].value}</h4>
                      <span>{data.promo.statistics[0].description}</span>
                    </div>
                  </div>
                  <div styleName="stats-box">
                    <img src={data.promo.statistics[1].icon.file.url} alt="Champions Icon" />
                    <div>
                      <h4>{data.promo.statistics[1].value}</h4>
                      <span>{data.promo.statistics[1].description}</span>
                    </div>
                  </div>
                  <div styleName="stats-box">
                    <img src={data.promo.statistics[2].icon.file.url} alt="Finalists Icon" />
                    <div>
                      <h4>{data.promo.statistics[2].value}</h4>
                      <span>{data.promo.statistics[2].description}</span>
                    </div>
                  </div>
                  <div styleName="stats-box">
                    <img src={data.promo.statistics[3].icon.file.url} alt="Countries Icon" />
                    <div>
                      <h4>{data.promo.statistics[3].value}</h4>
                      <span>{data.promo.statistics[3].description}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div styleName="finalists">
                <h2>{finalists.title}</h2>
                <Finalists data={finalists} />
              </div>
              {
                tripWinners && (
                  <div styleName="trip-winners">
                    <h3>{tripWinners.title}</h3>
                    <TripWinners roles={tripWinners} />
                  </div>
                )
              }
            </div>
          ) : undefined
        }

        {
          data ? (
            <div styleName="fun-facts">
              <h3>{data.quickStories.title}</h3>
              <FunFacts data={data.quickStories} />
            </div>
          ) : undefined
        }

        {
          data ? (
            <div styleName="champions">
              <h3>{champions.title}</h3>
              <Champions data={champions} />
              <div styleName="button-wrapper-view-all"><PrimaryButton>View All tracks</PrimaryButton></div>
            </div>
          ) : undefined
        }
      </div>
    </div>
  );
};

HallOfFamePage.propTypes = {
  eventId: PT.string.isRequired,
  onSelectEvent: PT.func.isRequired,
  hallOfFame: PT.shape().isRequired,
};

export default HallOfFamePage;
