/**
 * Track Component.  Renders the track, winner and list of
 * finalists for the given track of an event.
 */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { themr } from 'react-css-super-themr';

import defaultStyles from './styles.scss';

const Track = ({
  data, track, theme,
}) => (data ? (
  <div className={theme.container}>
    <div className={theme.track}>
      {track}
    </div>
    <div className={theme.winner}>
      <img src={data.fields.champion.fields.image.fields.file.url} alt="Winner Portrait" />
      <div>
        <a
          to={`${window.origin}/members/${data.fields.champion.fields.handle}`}
          target={`${_.includes(window.origin, 'www') ? '_self' : '_blank'}`}
        >
          {data.fields.champion.fields.handle}
        </a>
      </div>
      <div className={theme.label}>
        Champion
      </div>
    </div>
    {
      data.fields.members.map(member => (
        <div key={member.fields.handle} className={theme.finalist}>
          <a
            to={`${window.origin}/members/${member.fields.handle}`}
            target={`${_.includes(window.origin, 'www') ? '_self' : '_blank'}`}
          >
            {member.fields.handle}
          </a>
        </div>
      ))
    }
    <div className={theme.filler} />
  </div>
) : false);

Track.defaultProps = {
  track: 'TRACK',
  data: null,
};

Track.propTypes = {
  data: PT.shape(),
  track: PT.string,
  theme: PT.shape().isRequired,
};

export default themr('hall-of-fame/tco-track', defaultStyles)(Track);
