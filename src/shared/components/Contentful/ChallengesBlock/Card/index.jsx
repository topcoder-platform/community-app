import _ from 'lodash';
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';

import {
  DataScienceTrackTag,
  DesignTrackTag,
  DevelopmentTrackTag,
} from 'topcoder-react-ui-kit';

import { Link } from 'topcoder-react-utils';

import { COMPETITION_TRACKS } from 'utils/tc';

import './style.scss';

const FORMAT = 'MMM D, HH:mm';

export default function Card({
  baseUrl,
  challenge,
}) {
  const {
    subTrack,
  } = challenge;

  let TrackTag;
  switch (challenge.track.toLowerCase()) {
    case 'datasci':
    case COMPETITION_TRACKS.DATA_SCIENCE:
      TrackTag = DataScienceTrackTag;
      break;
    case COMPETITION_TRACKS.DESIGN:
      TrackTag = DesignTrackTag;
      break;
    case COMPETITION_TRACKS.DEVELOP:
      TrackTag = DevelopmentTrackTag;
      break;
    default:
      throw new Error('Wrong competition track value');
  }

  const now = moment();
  let timeMsg;
  if (now.isBefore(challenge.registrationStartDate)) {
    timeMsg = `Starts on ${
      moment(challenge.registrationStartDate).format(FORMAT)}`;
  } else {
    timeMsg = `Ends on ${
      moment(challenge.submissionEndDate).format(FORMAT)}`;
  }

  return (
    <div styleName="container">
      <TrackTag
        to={`${baseUrl}/challenges?filter[subtracks][0]=${
          encodeURIComponent(subTrack)}`}
      >
        {_.capitalize(subTrack).replace(/_/g, ' ')}
      </TrackTag>
      <h1 styleName="title">
        <Link
          to={`${baseUrl}/challenges/${challenge.id}`}
        >
          {challenge.name}
        </Link>
      </h1>
      <div>
        {/*
        <div styleName="text">Platforms: {challenge.platforms}</div>
        <div styleName="text">Technologies: {challenge.technologies}</div>
        */}
        <div styleName="text">
          {timeMsg}
        </div>
        <div
          styleName="prizes"
        >
          Prizes:
          {' '}
          {(challenge.prizes || []).map(x => `$${x}`).join('\u00a0/ ')}
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  baseUrl: PT.string.isRequired,
  challenge: PT.shape({
    id: PT.number.isRequired,
    name: PT.string.isRequired,
    platforms: PT.string.isRequired,
    prizes: PT.arrayOf(PT.number).isRequired,
    technologies: PT.string.isRequired,
    registrationStartDate: PT.string.isRequired,
    submissionEndDate: PT.string.isRequired,
    track: PT.string.isRequired,
  }).isRequired,
};
