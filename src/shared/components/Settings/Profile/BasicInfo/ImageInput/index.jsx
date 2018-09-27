/**
 * render a user icom input component.
 */
/* global document */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, Button } from 'topcoder-react-ui-kit';
import loadImage from 'blueimp-load-image';


import DefaultPortrait from 'assets/images/ico-user-default.svg';

import Styles from './styles.scss';


export default class ImageInput extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeImage = this.onChangeImage.bind(this);
    this.onUploadPhoto = this.onUploadPhoto.bind(this);

    this.state = {
      newBasicInfo: {},
    };
  }

  componentDidMount() {
    const { userTraits, profile } = this.props;
    this.loadBasicInfoTraits(userTraits, profile);
  }

  componentWillReceiveProps(nextProps) {
    this.loadBasicInfoTraits(nextProps.userTraits, nextProps.profile);
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
      uploadPhotoInit,
    } = this.props;
    if (profileState.uploadingPhoto) {
      return;
    }
    const fileInput = document.querySelector('#change-image-input');
    const file = fileInput.files[0];
    if (file === undefined) {
      return;
    }
    uploadPhotoInit();
    loadImage.parseMetaData(file, (data) => {
      let orientation = 0;
      if (data.exif) {
        orientation = data.exif.get('Orientation');
      }
      loadImage(
        file,
        (img) => {
          img.toBlob(
            (blobResult) => {
              uploadPhoto(handle, tokenV3, blobResult);
            },
            'image/jpeg',
          );
        }, {
          canvas: true,
          orientation,
        },
      );
    });
  }

  /**
   * Get basic info trait
   * @param userTraits the all user traits
   */
  loadBasicInfoTraits = (userTraits, profile) => {
    const trait = userTraits.filter(t => t.traitId === 'basic_info');
    const basicInfoTrait = trait.length === 0 ? {} : trait[0];
    const basicInfo = basicInfoTrait.traits ? basicInfoTrait.traits.data[0] : {};
    this.setState({ newBasicInfo: { ...basicInfo, photoURL: profile.photoURL } });
  }

  render() {
    const {
      handle,
      profileState,
    } = this.props;

    const {
      uploadingPhoto,
      deletingPhoto,
    } = profileState;

    const { newBasicInfo } = this.state;

    return (
      <div styleName="image">
        <div styleName="edit-image">
          {
            newBasicInfo.photoURL
            && <img alt="User" src={newBasicInfo.photoURL} styleName="profile-circle" />
          }
          {
            !newBasicInfo.photoURL
            && <DefaultPortrait styleName="profile-circle" />
          }
          <div styleName="buttons">
            <p styleName="handle">
              {handle}
            </p>
            <PrimaryButton onClick={this.onChangeImage} disabled={uploadingPhoto || deletingPhoto} theme={{ button: Styles['file-upload'] }}>
              {
                uploadingPhoto && <i className="fa fa-spinner fa-spin" styleName="uploading" />
              }
              {
                !uploadingPhoto && newBasicInfo.photoURL && 'Upload a new avatar'
              }
              {
                !uploadingPhoto && !newBasicInfo.photoURL && 'Upload a new avatar'
              }
            </PrimaryButton>
            <input type="file" name="image" accept="image/*" onChange={this.onUploadPhoto} id="change-image-input" className="hidden" />
            {
              newBasicInfo.photoURL
              && (
                <div>
                  <Button
                    onClick={this.onDeletePhoto}
                    disabled={uploadingPhoto || deletingPhoto}
                    theme={{ button: Styles['file-delete'] }}
                  >
                    {
                      deletingPhoto && <i className="fa fa-spinner fa-spin" />
                    }
                    {
                      !deletingPhoto && 'Delete avatar'
                    }
                  </Button>
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
  userTraits: PT.array.isRequired,
  profileState: PT.shape().isRequired,
  uploadPhoto: PT.func.isRequired,
  uploadPhotoInit: PT.func.isRequired,
  profile: PT.shape().isRequired,
};
