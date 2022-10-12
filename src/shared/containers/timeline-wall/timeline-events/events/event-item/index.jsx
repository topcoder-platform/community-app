import React, { useState } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import IconCheveronDown from 'assets/images/timeline-wall/cheveron-down.svg';
import IconTooltipLeft from 'assets/images/timeline-wall/tooltip-left.svg';
import IconTooltipRight from 'assets/images/timeline-wall/tooltip-right.svg';
import PhotoVideoItem from 'components/GUIKit/PhotoVideoItem';
import IconTrash from 'assets/images/profile/ico-trash.svg';
import cn from 'classnames';

import ModalPhotoViewer from '../../../modal-photo-viewer';
import PhotoItemsMobile from '../../../photo-items-mobile';
import ModalDeleteConfirmation from '../../../modal-delete-confirmation';
import './styles.scss';
import { DEFAULT_AVATAR_URL } from '../../../../../utils/url';

function EventItem({
  className, isLeft, eventItem, removeEvent, isAdmin, userAvatars,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModalPhoto, setShowModalPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const photoURL = _.get(userAvatars, eventItem.createdBy) || DEFAULT_AVATAR_URL;

  return (
    <div
      className={className}
      styleName={cn('container', {
        'color-green': eventItem.color === 'green',
        'color-red': eventItem.color === 'red',
        'color-purple': eventItem.color === 'purple',
      })}
      id={moment(eventItem.eventDate).format('YYYY-MM')}
    >
      {isLeft ? null : (<div styleName="dot dot-left" />)}
      {isLeft ? null : (<IconTooltipLeft styleName="tooltip-indicator" />)}
      <div styleName="content">
        <button type="button" onClick={() => setIsExpanded(!isExpanded)} styleName="header">
          <span>{eventItem.title}</span>
          <IconCheveronDown styleName={cn({
            'flip-vertical': isExpanded,
          })}
          />
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          styleName={cn('content-text', {
            'is-expanded': isExpanded,
          })}
        >{eventItem.description}
        </button>

        {eventItem.mediaFiles.length ? (
          <div styleName={cn('photo-container', {
            'one-photo': eventItem.mediaFiles.length === 1,
            'two-photo': eventItem.mediaFiles.length === 2,
          })}
          >
            <PhotoItemsMobile
              styleName="hide-desktop show-mobile photo-item"
              photos={eventItem.mediaFiles}
            />
            {eventItem.mediaFiles.map(photo => (
              <PhotoVideoItem
                styleName="photo-item hide-mobile"
                url={photo.url}
                videoThumnailUrl={photo.videoThumnailUrl}
                isUrlPhoto={!photo.videoThumnailUrl}
                key={photo.id}
                onClick={() => {
                  setShowModalPhoto(true);
                  setSelectedPhoto(photo.id);
                }}
              />
            ))}
          </div>
        ) : null}

        <div styleName="bottom">
          <div styleName="bottom-left">
            <img width="23" height="23" src={photoURL} alt="avatar" />
            <span styleName="text-handle">{eventItem.createdBy}</span>
            <span styleName="text-date">&nbsp;&nbsp;•&nbsp;&nbsp;{moment(eventItem.eventDate).format('MMM DD, YYYY')}</span>
          </div>
          {isAdmin ? (
            <button
              styleName="btn-delete"
              type="button"
              onClick={() => setShowModalDelete(eventItem)}
            ><IconTrash />
            </button>
          ) : null}
        </div>
      </div>
      {isLeft ? (<IconTooltipRight styleName="tooltip-indicator" />) : null}
      {isLeft ? (<div styleName="dot dot-right" />) : null}

      {showModalPhoto ? (
        <ModalPhotoViewer
          selectedPhoto={selectedPhoto}
          onClose={() => {
            setShowModalPhoto(false);
          }}
          photos={eventItem.mediaFiles}
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
    </div>
  );
}

/**
 * Default values for Props
 */
EventItem.defaultProps = {
  className: '',
  isLeft: false,
  eventItem: {
    creator: {},
    media: [],
  },
  removeEvent: () => {},
  isAdmin: false,
  userAvatars: {},
};

/**
 * Prop Validation
 */
EventItem.propTypes = {
  className: PT.string,
  isLeft: PT.bool,
  eventItem: PT.any,
  removeEvent: PT.func,
  isAdmin: PT.bool,
  userAvatars: PT.shape(),
};

export default EventItem;
