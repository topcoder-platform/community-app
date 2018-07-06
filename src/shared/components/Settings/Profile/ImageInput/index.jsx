/**
 * render a user icom input component.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';


import DefaultPortrait from 'assets/images/ico-user-default.svg';

import Styles from './styles.scss';


export default class ImageInput extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeImage = this.onChangeImage.bind(this);
    this.onUploadPhoto = this.onUploadPhoto.bind(this);
    this.onDeletePhoto = this.onDeletePhoto.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      profileState,
    } = this.props;
    if (profileState.deletingPhoto && !nextProps.profileState.deletingPhoto) {
      document.querySelector('#change-image-input').value = null;
    }
  }

  onChangeImage(e) {
    e.preventDefault();
    const {
      profileState,
    } = this.props;
    if (profileState.uploadingPhoto) {
      return;
    }
    const fileInput = document.querySelector('#change-image-input');
    fileInput.click();
  }

  onUploadPhoto(e) {
    e.preventDefault();
    const {
      handle,
      profileState,
      tokenV3,
      uploadPhoto,
    } = this.props;
    if (profileState.uploadingPhoto) {
      return;
    }
    const fileInput = document.querySelector('#change-image-input');
    const file = fileInput.files[0];
    uploadPhoto(handle, tokenV3, file);
  }

  onDeletePhoto(e) {
    const {
      deletePhoto,
      profile,
      profileState,
      tokenV3,
    } = this.props;
    e.preventDefault();
    if (profileState.deletingPhoto) {
      return;
    }
    const newProfile = _.clone(profile);
    delete newProfile.photoURL;
    delete newProfile.groups;
    newProfile.tracks = newProfile.tracks || [];
    deletePhoto(newProfile, tokenV3);
  }

  render() {
    const {
      handle,
      profile,
      profileState,
    } = this.props;

    const {
      uploadingPhoto,
      deletingPhoto,
    } = profileState;

    return (
      <div styleName="image">
        <div styleName="edit-image">
          {
                profile.photoURL
                && <img alt="User" src={profile.photoURL} styleName="profile-circle" />
              }
          {
                !profile.photoURL
                && <DefaultPortrait styleName="profile-circle" />
              }
          <div styleName="buttons">
            <p styleName="handle">
              {handle}
            </p>
            <PrimaryButton onClick={this.onChangeImage} disabled={uploadingPhoto || deletingPhoto} theme={{ button: Styles['file-upload'] }}>
              {
                    uploadingPhoto && <i className="fa fa-spinner fa-spin" />
                  }
              {
                    !uploadingPhoto && profile.photoURL && 'Browse...'
                  }
              {
                    !uploadingPhoto && !profile.photoURL && 'Browse...'
                  }
            </PrimaryButton>
            <input type="file" name="image" onChange={this.onUploadPhoto} id="change-image-input" className="hidden" />
            {
                  profile.photoURL
                  && (
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
                  )
                }
          </div>
        </div>
      </div>
    );
  }
}

ImageInput.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  profile: PT.shape().isRequired,
  profileState: PT.shape().isRequired,
  uploadPhoto: PT.func.isRequired,
  deletePhoto: PT.func.isRequired,
};
