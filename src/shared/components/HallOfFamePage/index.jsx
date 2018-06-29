/**
 * TCO Hall of Fame Page.  Allow user to select a TCO event and view the winners, contestants
 * and other information about the event.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ContentfulLoader from 'containers/ContentfulLoader';
import { PrimaryButton, Button } from 'topcoder-react-ui-kit';

import Error404 from 'components/Error404';

import Champions from './Champions';
import EventCarousel from './EventCarousel';
import Finalists from './Finalists';
import FunFacts from './FunFacts';
import TripWinners from './TripWinners';

import './styles.scss';

const HallOfFamePage = ({ eventId, onSelectEvent, hallOfFame }) => {
  const hof = hallOfFame;
  let data = null;
  const assetIds = [];
  let entryIds = [];
  let promoIds = [];
  let leaderboardsIds = [];
  let quickStoriesIds = [];
  let allTimeChampionId;
  // Get current event
  const result = _.filter(hof.versions, item => (item.fields.versionId === eventId));
  if (result && result.length > 0) {
    data = _.assign({}, result[0]);
  }

  if (data) {
    allTimeChampionId = hof.allTimeChampions.sys.id;
    promoIds = hof.versions.length > 1 ?
      _.map(hof.versions, item => (item.fields.promo.sys.id)) : hof.versions.sys.id;
    leaderboardsIds = _.map(data.fields.leaderboards, item => (item.sys.id));
    quickStoriesIds = data.fields.quickStories.length > 1 ?
      _.map(data.fields.quickStories, item => (item.sys.id)) : data.fields.quickStories.sys.id;
    entryIds = promoIds.concat(leaderboardsIds, quickStoriesIds, allTimeChampionId);
  }

  return (
    <ContentfulLoader
      entryIds={entryIds}
      render={(eventResult) => {
        // process leaderboard entries
        if (Array.isArray(leaderboardsIds)) {
          for (let i = 0; i !== leaderboardsIds.length; i += 1) {
            data.fields.leaderboards[i].fields =
              eventResult.entries.items[leaderboardsIds[i]].fields;
          }
        } else {
          data.fields.leaderboards.fields = eventResult.entries.items[leaderboardsIds].fields;
        }

        // process quick stories entries
        if (Array.isArray(quickStoriesIds)) {
          for (let i = 0; i !== quickStoriesIds.length; i += 1) {
            data.fields.quickStories[i].fields =
              eventResult.entries.items[quickStoriesIds[i]].fields;
          }
        } else {
          data.fields.quickStories.fields = eventResult.entries.items[quickStoriesIds].fields;
        }

        // process promo entries
        if (Array.isArray(promoIds)) {
          for (let i = 0; i !== promoIds.length; i += 1) {
            hof.versions[i].fields.promo.fields = eventResult.entries.items[promoIds[i]].fields;
          }
        } else {
          hof.verions.fields.promo.fields = eventResult.entries.items[promoIds].fields;
        }

        // process all time champions
        hof.allTimeChampions.fields = eventResult.entries.items[allTimeChampionId].fields;

        // process current event
        const attributesIds = _.map(data.fields.promo.fields.attributes, item => (item.sys.id));
        const bannerId = data.fields.promo.fields.bannerImage.sys.id;
        const linkIds = _.map(data.fields.promo.fields.links, item => (item.sys.id));
        const logoId = data.fields.promo.fields.logo.sys.id;
        const statisticsIds = _.map(data.fields.promo.fields.statistics, item => (item.sys.id));
        const finalistIds = _.map(data.fields.leaderboards[0].fields.data, item => (item.sys.id));
        const tripWinnerIds = _.map(data.fields.leaderboards[1].fields.data, item => (item.sys.id));
        entryIds = attributesIds.concat(linkIds, statisticsIds, finalistIds, tripWinnerIds);
        assetIds.push(bannerId);
        assetIds.push(logoId);
        return (
          <ContentfulLoader
            assetIds={assetIds}
            entryIds={entryIds}
            render={(currentEventResult) => {
              // atrributes
              for (let i = 0; i !== attributesIds.length; i += 1) {
                data.fields.promo.fields.attributes[i].fields =
                  currentEventResult.entries.items[attributesIds[i]].fields;
              }
              // links
              for (let i = 0; i !== linkIds.length; i += 1) {
                data.fields.promo.fields.links[i].fields =
                  currentEventResult.entries.items[linkIds[i]].fields;
              }
              // stats
              for (let i = 0; i !== statisticsIds.length; i += 1) {
                data.fields.promo.fields.statistics[i].fields =
                  currentEventResult.entries.items[statisticsIds[i]].fields;
              }
              // final list
              for (let i = 0; i !== finalistIds.length; i += 1) {
                data.fields.leaderboards[0].fields.data[i].fields =
                  currentEventResult.entries.items[finalistIds[i]].fields;
              }
              // trip winners
              for (let i = 0; i !== tripWinnerIds.length; i += 1) {
                data.fields.leaderboards[1].fields.data[i].fields =
                  currentEventResult.entries.items[tripWinnerIds[i]].fields;
              }
              data.fields.promo.fields.bannerImage.fields =
                currentEventResult.assets.items[bannerId].fields;
              data.fields.promo.fields.logo.fields =
                currentEventResult.assets.items[logoId].fields;

              // process stats icon
              const iconIds = _.map(
                data.fields.promo.fields.statistics,
                item => item.fields.icon.sys.id,
              );
              return (
                <ContentfulLoader
                  assetIds={iconIds}
                  render={(iconResult) => {
                    for (let i = 0; i !== iconIds.length; i += 1) {
                      data.fields.promo.fields.statistics[i].fields.icon.fields =
                        iconResult.assets.items[iconIds[i]].fields;
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
                                <h1>{hof.title.toUpperCase()} Hall of Fame</h1>
                                <EventCarousel
                                  eventId={eventId}
                                  onSelectEvent={onSelectEvent}
                                  events={_.set({}, 'list', hof.versions)}
                                  eventType={hof.title}
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
                                      <img src={data.fields.promo.fields.logo.fields.file.url} alt={`Logo for ${hallOfFame.title.toUpperCase()}${eventId}`} />
                                    </div>
                                    <div styleName="location">
                                      <strong>
                                        {data.fields.promo.fields.attributes[0].fields.value}
                                      </strong>
                                      <p>{data.fields.promo.fields.attributes[1].fields.value}</p>
                                    </div>
                                    <div styleName="button-wrapper"><PrimaryButton styleName="learn-more" to={data.fields.promo.fields.links[0].fields.url} openNewTab>{data.fields.promo.fields.links[0].fields.title}</PrimaryButton></div>
                                    <div styleName="button-wrapper"><Button styleName="browse-gallery" to={data.fields.promo.fields.links[1].fields.url} openNewTab>{data.fields.promo.fields.links[1].fields.title}</Button></div>
                                  </div>

                                  <div styleName="banner">
                                    <img src={data.fields.promo.fields.bannerImage.fields.file.url} alt={`Banner for ${hallOfFame.title.toUpperCase()}${eventId}`} />
                                  </div>

                                  <div styleName="event-stats">
                                    {
                                      _.map(data.fields.promo.fields.statistics, stat => (
                                        <div styleName="stats-box" key={stat.fields.description}>
                                          <img
                                            src={stat.fields.icon.fields.file.url}
                                            alt={stat.fields.description}
                                          />
                                          <div>
                                            <h4>{stat.fields.value}</h4>
                                            <span>{stat.fields.description}</span>
                                          </div>
                                        </div>
                                      ))
                                    }
                                  </div>
                                </div>
                                {
                                  data.fields.leaderboards[0].fields.data.length > 0 &&
                                  <div styleName="finalists">
                                    <h2>{data.fields.leaderboards[0].fields.title}</h2>
                                    <Finalists data={data.fields.leaderboards[0].fields} />
                                  </div>
                                }
                                {
                                  data.fields.leaderboards[1].fields.data.length > 0 && (
                                    <div styleName="trip-winners">
                                      <h3>{data.fields.leaderboards[1].fields.title}</h3>
                                      <TripWinners roles={data.fields.leaderboards[1].fields} />
                                    </div>
                                  )
                                }
                              </div>
                            ) : undefined
                          }
                          {
                            data && data.fields.quickStories.fields.list.length > 0 ? (
                              <div styleName="fun-facts">
                                <h3>{data.fields.quickStories.fields.title}</h3>
                                <FunFacts data={data.fields.quickStories.fields} />
                              </div>
                            ) : undefined
                          }
                          {
                            hof.allTimeChampions.fields ? (
                              <div styleName="champions">
                                <h3>{hof.allTimeChampions.fields.title}</h3>
                                <Champions data={hof.allTimeChampions.fields} />
                              </div>
                            ) : undefined
                          }
                        </div>
                      </div>
                    );
                  }}
                />
              );
            }}
          />
        );
      }}
    />
  );
};

HallOfFamePage.propTypes = {
  eventId: PT.string.isRequired,
  onSelectEvent: PT.func.isRequired,
  hallOfFame: PT.shape().isRequired,
};

export default HallOfFamePage;
