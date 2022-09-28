import React, { useState, useMemo, useEffect } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import IconCheveronLeft from 'assets/images/timeline-wall/cheveron-left.svg';
import IconCheveronRight from 'assets/images/timeline-wall/cheveron-right.svg';
import BtnPlay from 'assets/images/button_play_video.svg';
import ModalPhotoViewer from '../modal-photo-viewer';

import './styles.scss';

function PhotoItemsMobile({ photos, className }) {
  const [localSelectedPhoto, setLocalSelectedPhoto] = useState(0);
  const [showModalPhoto, setShowModalPhoto] = useState(false);
  const selectedPhotoObject = useMemo(
    () => _.find(photos, { id: localSelectedPhoto }), [localSelectedPhoto],
  );

  useEffect(() => {
    if (photos.length > 0) {
      setLocalSelectedPhoto(photos[0].id);
    }
  }, [photos]);

  return (
    <React.Fragment>
      <div
        onClick={() => {
          setShowModalPhoto(true);
        }}
        className={className}
        styleName="content"
        onKeyDown={() => { }}
        role="button"
        tabIndex={0}
      >
        {selectedPhotoObject && !selectedPhotoObject.videoThumnailUrl ? (<img src={selectedPhotoObject.url} alt="main" />) : null}
        {selectedPhotoObject && !!selectedPhotoObject.videoThumnailUrl ? (
          <React.Fragment>
            <img src={selectedPhotoObject.videoThumnailUrl} alt="main" />
            <BtnPlay styleName="img-play" />
          </React.Fragment>
        ) : null}

        <button
          styleName="btn-left"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

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

      {showModalPhoto ? (
        <ModalPhotoViewer
          selectedPhoto={localSelectedPhoto}
          onClose={() => {
            setShowModalPhoto(false);
          }}
          photos={photos}
        />
      ) : null}
    </React.Fragment>
  );
}

/**
 * Default values for Props
 */
PhotoItemsMobile.defaultProps = {
  photos: [],
  className: '',
};

/**
 * Prop Validation
 */
PhotoItemsMobile.propTypes = {
  photos: PT.arrayOf(PT.shape()),
  className: PT.string,
};

export default PhotoItemsMobile;
