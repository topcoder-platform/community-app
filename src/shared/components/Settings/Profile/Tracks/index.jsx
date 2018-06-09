/**
 * Child component of Settings/Profile/Tracks renders "Tracks" section of profile setting page.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import DesignIcon from 'assets/images/profile/ico-track-design.svg';
import DevelopIcon from 'assets/images/profile/ico-track-develop.svg';
import DataScienceIcon from 'assets/images/profile/ico-track-data.svg';

import DesignGreyIcon from 'assets/images/profile/ico-track-design-grey.svg';
import DevelopGreyIcon from 'assets/images/profile/ico-track-develop-grey.svg';
import DataScienceGreyIcon from 'assets/images/profile/ico-track-data-grey.svg';

import './styles.scss';

const tracks = {
  DESIGN: {
    label: 'Design',
    enabledIcon: DesignIcon,
    disabledIcon: DesignGreyIcon,
    description: 'Website, mobile, and product design; UI and UX',
  },
  DEVELOP: {
    label: 'Development',
    enabledIcon: DevelopIcon,
    disabledIcon: DevelopGreyIcon,
    description: 'Software architecture, component assembly, application development, and bug hunting',
  },
  DATA_SCIENCE: {
    label: 'Data Science',
    enabledIcon: DataScienceIcon,
    disabledIcon: DataScienceGreyIcon,
    description: 'Algorithms and data structures, statistical analysis',
  },
};

export default class Tracks extends React.Component {
  constructor(props) {
    super(props);
    this.onUpdateTracks = this.onUpdateTracks.bind(this);
  }

  onUpdateTracks() {
    const switches = document.querySelectorAll('input[name="onoffswitch"]');
    const newTracks = [];
    _.forEach(switches, (sw) => {
      if (sw.checked) {
        newTracks.push(sw.value);
      }
    });

    this.props.onUpdateTracks(newTracks);
  }

  render() {
    const userTracks = this.props.tracks;

    return (
      <div className="settings-section">
        <div className="section-info">
          <h2>Tracks</h2>
          <div className="description">Topcoder&apos;s three categories of challenges... please pick at least one based on your skills and interests.</div>
        </div>
        <div className="section-fields">
          <div styleName="track-toggle">
            {
              _.map(tracks, (track, trackName) => {
                const enabled = _.includes(userTracks, trackName);
                return (
                  <div styleName="track" key={trackName}>
                    <div styleName={enabled ? 'content' : 'content disabled'}>
                      <div styleName="track-details">
                        <div styleName={enabled ? 'icon' : 'icon disabled'}>
                          {
                            enabled &&
                            track.enabledIcon()
                          }
                          {
                            !enabled &&
                            track.disabledIcon()
                          }
                        </div>
                        <div styleName="text">
                          <span styleName={enabled ? 'title' : 'title disabled'}>{track.label}</span>
                          <div styleName="description">
                            <span>{track.description}</span>
                          </div>
                        </div>
                      </div>
                      <div className="onoffswitch">
                        <input
                          type="checkbox"
                          name="onoffswitch"
                          id={`DESIGN-onoffswitch-${trackName}`}
                          value={trackName}
                          defaultChecked={enabled}
                          onChange={this.onUpdateTracks}
                          className="onoffswitch-checkbox"
                        />
                        <label htmlFor={`DESIGN-onoffswitch-${trackName}`} className="onoffswitch-label">
                          <span className="onoffswitch-inner" />
                          <span className="onoffswitch-switch" />
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

Tracks.defaultProps = {
  tracks: [],
};

Tracks.propTypes = {
  tracks: PT.arrayOf(PT.string),
  onUpdateTracks: PT.func.isRequired,
};

