import React, { useState } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import IconTrash from 'assets/images/profile/ico-trash.svg';
import IconTooltipLeft from 'assets/images/timeline-wall/tooltip-left.svg';

import PhotoVideoItem from 'components/GUIKit/PhotoVideoItem';
import ModalConfirmReject from '../../modal-confirm-reject';
import ModalDeleteConfirmation from '../../modal-delete-confirmation';
import ModalPhotoViewer from '../../modal-photo-viewer';

import './styles.scss';
import { DEFAULT_AVATAR_URL } from '../../../../utils/url';

function ApprovalItem({
  className, event, removeEvent, userAvatars, deleteEvent, onApproveEvent,
}) {
  const [showModalConfirmReject, setShowModalConfirmReject] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalPhoto, setShowModalPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const photoURL = _.get(userAvatars, event.createdBy) || DEFAULT_AVATAR_URL;

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
              <img width="24" height="24" src={photoURL} alt="avatar" />
              <span styleName="text-handle">{event.createdBy}</span>
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

              <button styleName="btn-primary" type="button" onClick={() => onApproveEvent(event.id)}>APPROVE</button>
            </div>
          </div>
        </div>

        <div styleName="photo-container">
          {event.mediaFiles.map(photo => (
            <PhotoVideoItem
              key={photo.id}
              styleName="photo-item"
              url={photo.previewUrl || photo.url}
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
        <ModalConfirmReject
          onClose={() => {
            setShowModalConfirmReject(false);
          }}
          onReject={(body) => {
            removeEvent(event.id, body);
          }}
        />
      ) : null}

      {showModalDelete ? (
        <ModalDeleteConfirmation
          id={event.id}
          eventItem={showModalDelete}
          onClose={() => {
            setShowModalDelete(false);
          }}
          handle={event.createdBy}
          deleteEvent={deleteEvent}
        />
      ) : null}

      {showModalPhoto ? (
        <ModalPhotoViewer
          selectedPhoto={selectedPhoto}
          onClose={() => {
            setShowModalPhoto(false);
          }}
          photos={event.mediaFiles}
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
  userAvatars: {},
};

/**
 * Prop Validation
 */
ApprovalItem.propTypes = {
  className: PT.string.isRequired,
  event: PT.shape(),
  removeEvent: PT.func,
  userAvatars: PT.shape(),
  deleteEvent: PT.func.isRequired,
  onApproveEvent: PT.func.isRequired,
};

export default ApprovalItem;
