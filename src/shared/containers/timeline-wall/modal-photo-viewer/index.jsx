import React, { useState, useMemo } from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import _ from 'lodash';
import { Modal } from 'topcoder-react-ui-kit';
import IconClose from 'assets/images/timeline-wall/btn-close.svg';
import IconCheveronLeft from 'assets/images/timeline-wall/cheveron-left.svg';
import IconCheveronRight from 'assets/images/timeline-wall/cheveron-right.svg';
import PhotoVideoItem from 'components/GUIKit/PhotoVideoItem';
import { v4 as uuidv4 } from 'uuid';

import style from './styles.scss';
import { isImage } from '../../../utils/url';

function ModalPhotoViewer({ onClose, selectedPhoto, photos }) {
  const newPhotos = photos.map((photo, index) => ({ ...photo, id: index }));
  const [localSelectedPhoto, setLocalSelectedPhoto] = useState(selectedPhoto);
  const selectedPhotoObject = useMemo(
    () => _.find(newPhotos, { id: localSelectedPhoto }), [localSelectedPhoto],
  );

  const photosMapped = photos.map((item, index) => ({ ...item, id: index }));

  return (
    <Modal
      theme={{ container: style.container, overlay: style.overlay }}
      onCancel={onClose}
    >
      <button styleName="btn-close" onClick={onClose} type="button"><IconClose /></button>
      <div styleName="content">
        {selectedPhotoObject && isImage(selectedPhotoObject.url) ? (<img src={selectedPhotoObject.url} alt="main" />) : null}
        {selectedPhotoObject && !isImage(selectedPhotoObject.url) ? (
          <video controls>
            <source src={selectedPhotoObject.url} />
            <track kind="captions" />
          </video>
        ) : null}


        <button
          styleName="btn-left"
          onClick={() => {
            let currentIndex = _.findIndex(photosMapped, photo => photo.id === localSelectedPhoto);
            currentIndex -= 1;
            if (currentIndex < 0) {
              currentIndex = photosMapped.length - 1;
            }
            setLocalSelectedPhoto(photosMapped[currentIndex].id);
          }}
          type="button"
        ><IconCheveronLeft />
        </button>
        <button
          styleName="btn-right"
          onClick={() => {
            let currentIndex = _.findIndex(photosMapped, photo => photo.id === localSelectedPhoto);
            currentIndex += 1;
            if (currentIndex >= photosMapped.length) {
              currentIndex = 0;
            }
            setLocalSelectedPhoto(photosMapped[currentIndex].id);
          }}
          type="button"
        ><IconCheveronRight />
        </button>
      </div>

      <div styleName="bottom">
        {photosMapped.map(photo => (
          <PhotoVideoItem
            styleName={cn('photo-item', {
              selected: photo.id === localSelectedPhoto,
            })}
            url={photo.previewUrl || photo.url}
            videoThumnailUrl={photo.videoThumnailUrl}
            isUrlPhoto={!photo.videoThumnailUrl}
            onClick={() => setLocalSelectedPhoto(photo.id)}
            key={uuidv4()}
          />
        ))}
      </div>
    </Modal>
  );
}

/**
 * Default values for Props
 */
ModalPhotoViewer.defaultProps = {
  onClose: () => { },
  selectedPhoto: 0,
  photos: [],
};

/**
 * Prop Validation
 */
ModalPhotoViewer.propTypes = {
  onClose: PT.func,
  selectedPhoto: PT.number,
  photos: PT.arrayOf(PT.shape()),
};

export default ModalPhotoViewer;
