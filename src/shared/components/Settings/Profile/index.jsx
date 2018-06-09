/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import { looseEqual } from 'utils/tc';

import AboutMe from './AboutMe';
import Tracks from './Tracks';
import Skills from './Skills';
import ExternalLinks from './ExternalLinks';

import Styles from './styles.scss';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bio: props.profile.description || '',
      countryCode: props.profile.competitionCountryCode,
      tracks: props.profile.tracks,
    };

    this.onUpdateBio = this.onUpdateBio.bind(this);
    this.onUpdateCountry = this.onUpdateCountry.bind(this);
    this.onUpdateTracks = this.onUpdateTracks.bind(this);
    this.onSaveProfile = this.onSaveProfile.bind(this);
  }

  onUpdateCountry(countryCode) {
    this.setState({ countryCode });
  }

  onUpdateBio(bio) {
    this.setState({ bio });
  }

  onUpdateTracks(tracks) {
    this.setState({ tracks });
  }

  onSaveProfile(e) {
    e.preventDefault();
    if (this.props.profileState.updatingProfile) {
      return;
    }

    const newProfile = _.clone(this.props.profile);

    newProfile.description = this.state.bio;
    newProfile.competitionCountryCode = this.state.countryCode;
    newProfile.tracks = this.state.tracks;

    delete newProfile.groups;
    this.props.updateProfile(newProfile, this.props.tokenV3);
  }

  render() {
    const {
      profileState,
    } = this.props;

    const { updatingProfile } = profileState;

    const needSaveAboutMe = this.state.countryCode && (
      !looseEqual(this.state.bio, this.props.profile.description)
      || !looseEqual(this.state.countryCode, this.props.profile.competitionCountryCode));

    const needSaveTracks = this.state.tracks && this.state.tracks.length &&
      (!this.props.profile.tracks
        || !_.isEqual(this.state.tracks.sort(), this.props.profile.tracks.sort()));

    const needSave = needSaveAboutMe || needSaveTracks;

    return (
      <div styleName="edit-profile-container">
        <form autoComplete="off">
          <input autoComplete="false" name="hidden" type="text" className="hidden" />
          <AboutMe
            bio={this.state.bio}
            countryCode={this.state.countryCode}
            onUpdateCountry={this.onUpdateCountry}
            onUpdateBio={this.onUpdateBio}
            {...this.props}
          />
          <Tracks
            tracks={this.state.tracks}
            onUpdateTracks={this.onUpdateTracks}
            {...this.props}
          />
          <div className="save-section">
            <PrimaryButton
              disabled={!needSave || updatingProfile}
              onClick={this.onSaveProfile}
              theme={{ button: Styles['save-button'] }}
            >
              {
                !updatingProfile && 'Save'
              }
              {
                updatingProfile && <i className="fa fa-spinner fa-spin" />
              }
            </PrimaryButton>
          </div>
        </form>
        <Skills
          {...this.props}
        />
        <ExternalLinks
          {...this.props}
        />
      </div>
    );
  }
}

Profile.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  profile: PT.shape().isRequired,
  profileState: PT.shape().isRequired,
  updateProfile: PT.func.isRequired,
};

