/**
 * render a user icom input component.
 */
/* global document */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PT from 'prop-types';

import { Button } from 'topcoder-react-ui-kit';
import IconEdit from 'assets/images/icon-edit.svg';
import IconUpload from 'assets/images/icon-upload.svg';
import loadImage from 'blueimp-load-image';

import _ from 'lodash';
import style from './styles.scss';
import PageRow from '../../PageRow';


const ImageInput = ({
  handle, tokenV3,
  uploadPhoto, uploadPhotoInit, profileState, profile,
}) => {
  const { photoURL } = profile;
  const [isImageOversize, setIsImageOversize] = useState(false);
  const [isImageFile, setIsImageFile] = useState(true);

  const onChangeImage = (e) => {
    e.preventDefault();
    if (!_.isEmpty(profileState) && profileState.uploadingPhoto) {
      return;
    }
    const fileInput = document.querySelector('#change-image-input');
    fileInput.click();
  };

  const onUploadPhoto = (e) => {
    e.preventDefault();
    if (profileState.uploadingPhoto) {
      return;
    }
    const fileInput = document.querySelector('#change-image-input');
    const file = fileInput.files[0];
    if (file === undefined) {
      return;
    }
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setIsImageFile(false);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      // If file size is greater than 2 MB, show error message
      setIsImageOversize(true);
      return;
    }
    setIsImageOversize(false);
    setIsImageFile(true);
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
          );
        }, {
          canvas: true,
          orientation,
        },
      );
    });
  };

  const { uploadingPhoto } = profileState;

  return (
    <div styleName="image-input">
      <PageRow>
        <div>
          <h3 styleName="title">ADD YOUR IMAGE</h3>
          <div styleName="sub-title">
            <p>Show the community who you are. Don&apos;t worry, you look great.</p>
            <strong>Requirements:</strong>
            <ul>
              <li>PNG or JPG format.</li>
              <li>Maximum size: 2MB.</li>
            </ul>
          </div>
        </div>
        {!photoURL && (
        <div styleName="upload-profile-photo">
          <div styleName="profile-photo-void" />
          <Button
            onClick={onChangeImage}
            theme={{ button: style.uploadButton }}
          >
            <IconUpload styleName="icon-upload" />
            {
              uploadingPhoto ? <i className="fa fa-spinner fa-spin" styleName="uploading" /> : (
                <span>UPLOAD</span>
              )
            }
          </Button>
        </div>
        )}
        {photoURL && (
        <div styleName="upload-profile-photo">
          <div
            style={{ backgroundImage: `url(${photoURL})` }}
            styleName="profile-photo"
          />
          <Button
            onClick={onChangeImage}
            theme={{ button: style.uploadButton }}
          >
            <IconEdit styleName="icon-edit" />
            {
              uploadingPhoto ? <i className="fa fa-spinner fa-spin" styleName="uploading" />
                : (
                  <span>UPLOAD NEW PHOTO</span>
                )
            }
          </Button>
        </div>
        )}
        <input type="file" name="image" accept="image/*" onChange={onUploadPhoto} id="change-image-input" className="hidden" />
      </PageRow>
      {!isImageFile && <div styleName="error-message">Please select jpg, jpeg or png image files only</div>}
      {isImageFile && isImageOversize && <div styleName="error-message">Please select an image smaller than 2MB</div>}
    </div>
  );
};

ImageInput.defaultProps = {
  profile: {},
  profileState: {},
};

ImageInput.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  profile: PT.shape(),
  profileState: PT.shape(),
  uploadPhoto: PT.func.isRequired,
  uploadPhotoInit: PT.func.isRequired,
};

export default ImageInput;
