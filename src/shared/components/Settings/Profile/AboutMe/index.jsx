/**
 * Child component of Settings/Profile/AboutMe renders "About Me" section of profile setting page.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';

import { getAllCountryObjects, getCountryObjFromAlpha3 } from 'utils/countries';

import Select from 'components/Select';
import DefaultPortrait from 'assets/images/ico-user-default.svg';

import Styles from './styles.scss';

const countries = getAllCountryObjects();

export default class AboutMe extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeImage = this.onChangeImage.bind(this);
    this.onUploadPhoto = this.onUploadPhoto.bind(this);
    this.onDeletePhoto = this.onDeletePhoto.bind(this);

    this.onUpdateBio = this.onUpdateBio.bind(this);
    this.onUpdateCountry = this.onUpdateCountry.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.profileState.deletingPhoto && !nextProps.profileState.deletingPhoto) {
      document.querySelector('#change-image-input').value = null;
    }
  }

  onChangeImage(e) {
    e.preventDefault();
    if (this.props.profileState.uploadingPhoto) {
      return;
    }
    const fileInput = document.querySelector('#change-image-input');
    fileInput.click();
  }

  onUploadPhoto(e) {
    e.preventDefault();
    if (this.props.profileState.uploadingPhoto) {
      return;
    }
    const fileInput = document.querySelector('#change-image-input');
    const file = fileInput.files[0];
    this.props.uploadPhoto(this.props.handle, this.props.tokenV3, file);
  }

  onDeletePhoto(e) {
    e.preventDefault();
    if (this.props.profileState.deletingPhoto) {
      return;
    }
    const newProfile = _.clone(this.props.profile);
    delete newProfile.photoURL;
    delete newProfile.groups;
    newProfile.tracks = newProfile.tracks || [];
    this.props.deletePhoto(newProfile, this.props.tokenV3);
  }

  onUpdateBio(e) {
    e.preventDefault();
    const bio = document.querySelector('#profile-bio').value;
    this.props.onUpdateBio(bio);
  }

  onUpdateCountry(country) {
    if (country && country.alpha3) {
      this.props.onUpdateCountry(country.alpha3);
    }
  }

  render() {
    const {
      profile,
      profileState,
      bio,
      countryCode,
    } = this.props;

    const {
      uploadingPhoto,
      deletingPhoto,
    } = profileState;

    const userCountry = getCountryObjFromAlpha3(countryCode);

    return (
      <div className="settings-section">
        <div className="section-info">
          <h2>About Me</h2>
          <div className="description">The most important information that other community members should know about you.</div>
        </div>
        <div className="section-fields">
          <div styleName="image">
            <div className="form-label">your profile image</div>
            <div styleName="edit-image">
              {
                profile.photoURL &&
                <img alt="User" src={profile.photoURL} styleName="profile-circle" />
              }
              {
                !profile.photoURL &&
                <DefaultPortrait styleName="profile-circle" />
              }
              <div styleName="buttons">
                <PrimaryButton onClick={this.onChangeImage} disabled={uploadingPhoto || deletingPhoto} theme={{ button: Styles['file-upload'] }}>
                  {
                    uploadingPhoto && <i className="fa fa-spinner fa-spin" />
                  }
                  {
                    !uploadingPhoto && profile.photoURL && 'Change Image'
                  }
                  {
                    !uploadingPhoto && !profile.photoURL && 'Add Image'
                  }
                </PrimaryButton>
                <input type="file" name="image" onChange={this.onUploadPhoto} id="change-image-input" className="hidden" />
                {
                  profile.photoURL &&
                  <div>
                    <SecondaryButton
                      onClick={this.onDeletePhoto}
                      disabled={uploadingPhoto || deletingPhoto}
                      theme={{ button: Styles['file-delete'] }}
                    >
                      {
                        deletingPhoto && <i className="fa fa-spinner fa-spin" />
                      }
                      {
                        !deletingPhoto && 'Delete'
                      }
                    </SecondaryButton>
                  </div>
                }
              </div>
            </div>
          </div>
          <div styleName="country">
            <div className="form-label">Country to represent</div>
            <Select
              name="location"
              options={countries}
              value={userCountry}
              onChange={this.onUpdateCountry}
              placeholder="Country"
              matchPos="start"
              matchProp="name"
              labelKey="name"
              valueKey="name"
              clearable={false}
            />
          </div>
          <div styleName="bio">
            <div className="form-label">short bio
              <span className="char-count">{(bio && bio.length) || 0}
                <span className="grey">&nbsp;/ 256</span>
              </span>
            </div>
            <textarea
              name="bio"
              id="profile-bio"
              value={bio}
              onChange={this.onUpdateBio}
              maxLength="256"
              className="topcoder-input"
              placeholder="E.g., I'm a JS architect interested in creating new data interchange formats. I love sci-fi and riding my motorcycle."
            />
          </div>
        </div>
      </div>
    );
  }
}

AboutMe.defaultProps = {
  bio: '',
  countryCode: null,
};

AboutMe.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  profile: PT.shape().isRequired,
  profileState: PT.shape().isRequired,
  bio: PT.string,
  countryCode: PT.string,
  onUpdateCountry: PT.func.isRequired,
  onUpdateBio: PT.func.isRequired,
  uploadPhoto: PT.func.isRequired,
  deletePhoto: PT.func.isRequired,
};

