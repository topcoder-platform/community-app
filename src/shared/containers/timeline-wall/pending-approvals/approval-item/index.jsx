import React, { useState } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import IconTrash from 'assets/images/profile/ico-trash.svg';
import IconTooltipLeft from 'assets/images/timeline-wall/tooltip-left.svg';

import PhotoVideoItem from 'components/GUIKit/PhotoVideoItem';
import ModalConfirmReject from '../../modal-confirm-reject';
import ModalDeleteConfirmation from '../../modal-delete-confirmation';
import ModalPhotoViewer from '../../modal-photo-viewer';

import './styles.scss';

function ApprovalItem({ className, event, removeEvent }) {
  const [showModalConfirmReject, setShowModalConfirmReject] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalPhoto, setShowModalPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  return (
    <div className={className} styleName="container">
      <div styleName="dot-left" />
      <IconTooltipLeft styleName="tooltip-indicator" />

      <div styleName="content">
        <div styleName="block-left">
          <div styleName="block-left-top">
            <div styleName="block-left-top-left">
              <span styleName="text-date">{moment(event.eventDate).format('MMM DD, YYYY')}</span>
              <div styleName="separator" />
              <img width="24" height="24" src={event.creator.avatar} alt="avatar" />
              <span styleName="text-handle">{event.creator.handle}</span>
            </div>
            <span styleName="text-date">Submitted date: {moment(event.submitedDate).format('MMM DD, YYYY')}</span>
          </div>
          <span styleName="text-title">{event.title}</span>
          <span styleName="text-description">{event.description}</span>

          <div styleName="block-left-bottom">
            <button
              styleName="btn-trash"
              onClick={() => setShowModalDelete(event)}
              type="button"
            ><IconTrash />
            </button>
            <div>
              <button
                onClick={() => setShowModalConfirmReject(event)}
                styleName="btn-outline btn-reject"
                type="button"
              >REJECT
              </button>

              <button styleName="btn-primary" type="button">APPROVE</button>
            </div>
          </div>
        </div>

        <div styleName="photo-container">
          {event.media.map(photo => (
            <PhotoVideoItem
              key={photo.id}
              styleName="photo-item"
              url={photo.url}
              videoThumnailUrl={photo.videoThumnailUrl}
              isUrlPhoto={!photo.videoThumnailUrl}
              onClick={() => {
                setShowModalPhoto(true);
                setSelectedPhoto(photo.id);
              }}
            />
          ))}
        </div>
      </div>

      {showModalConfirmReject ? (
        <ModalConfirmReject onClose={(result) => {
          if (result === true) {
            removeEvent(showModalDelete);
          }
          setShowModalConfirmReject(false);
        }}
        />
      ) : null}

      {showModalDelete ? (
        <ModalDeleteConfirmation
          eventItem={showModalDelete}
          onClose={(result) => {
            if (result === true) {
              removeEvent(showModalDelete);
            }
            setShowModalDelete(false);
          }}
        />
      ) : null}

      {showModalPhoto ? (
        <ModalPhotoViewer
          selectedPhoto={selectedPhoto}
          onClose={() => {
            setShowModalPhoto(false);
          }}
          photos={event.media}
        />
      ) : null}
    </div>
  );
}

/**
 * Default values for Props
 */
ApprovalItem.defaultProps = {
  event: {
    creator: {},
    media: [],
  },
  removeEvent: () => { },
};

/**
 * Prop Validation
 */
ApprovalItem.propTypes = {
  className: PT.string.isRequired,
  event: PT.shape(),
  removeEvent: PT.func,
};

export default ApprovalItem;
