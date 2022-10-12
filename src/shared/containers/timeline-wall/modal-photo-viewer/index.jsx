import React, { useState, useMemo } from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import _ from 'lodash';
import { Modal } from 'topcoder-react-ui-kit';
import IconClose from 'assets/images/timeline-wall/btn-close.svg';
import IconCheveronLeft from 'assets/images/timeline-wall/cheveron-left.svg';
import IconCheveronRight from 'assets/images/timeline-wall/cheveron-right.svg';
import PhotoVideoItem from 'components/GUIKit/PhotoVideoItem';

import style from './styles.scss';

function ModalPhotoViewer({ onClose, selectedPhoto, photos }) {
  const newPhotos = photos.map((photo, index) => ({ ...photo, id: index }));
  const [localSelectedPhoto, setLocalSelectedPhoto] = useState(selectedPhoto);
  const selectedPhotoObject = useMemo(
    () => _.find(newPhotos, { id: localSelectedPhoto }), [localSelectedPhoto],
  );

  return (
    <Modal
      theme={{ container: style.container, overlay: style.overlay }}
      onCancel={onClose}
    >
      <button styleName="btn-close" onClick={onClose} type="button"><IconClose /></button>
      <div styleName="content">
        {selectedPhotoObject && !selectedPhotoObject.videoThumnailUrl ? (<img src={selectedPhotoObject.url} alt="main" />) : null}
        {selectedPhotoObject && !!selectedPhotoObject.videoThumnailUrl ? (
          <video controls>
            <source src={selectedPhotoObject.url} />
            <track kind="captions" />
          </video>
        ) : null}


        <button
          styleName="btn-left"
          onClick={() => {
            let currentIndex = _.findIndex(photos, photo => photo.id === localSelectedPhoto);
            currentIndex -= 1;
            if (currentIndex < 0) {
              currentIndex = photos.length - 1;
            }
            setLocalSelectedPhoto(photos[currentIndex].id);
          }}
          type="button"
        ><IconCheveronLeft />
        </button>
        <button
          styleName="btn-right"
          onClick={() => {
            let currentIndex = _.findIndex(photos, photo => photo.id === localSelectedPhoto);
            currentIndex += 1;
            if (currentIndex >= photos.length) {
              currentIndex = 0;
            }
            setLocalSelectedPhoto(photos[currentIndex].id);
          }}
          type="button"
        ><IconCheveronRight />
        </button>
      </div>

      <div styleName="bottom">
        {photos.map(photo => (
          <PhotoVideoItem
            styleName={cn('photo-item', {
              selected: photo.id === localSelectedPhoto,
            })}
            url={photo.url}
            videoThumnailUrl={photo.videoThumnailUrl}
            isUrlPhoto={!photo.videoThumnailUrl}
            onClick={() => setLocalSelectedPhoto(photo.id)}
            key={photo.id}
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
