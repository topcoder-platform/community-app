/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PT from 'prop-types';
import TrashIcon from 'assets/images/timeline/trash.svg';
import { Button, PrimaryButton, Modal } from 'topcoder-react-ui-kit';
import CloseIcon from 'assets/images/icon-close-green.svg';

import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import FormField from 'components/Settings/FormField';
import FormInputSelect from 'components/Settings/FormInputSelect';
import FormInputTextArea from 'components/Settings/FormInputTextArea';

import style from './styles.scss';
import { getRejectioneReasons } from '../../../utils/timeline';

const AdminCard = ({ pendingApproval, onSelectAsset }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const {
    eventName, submitDate, description, createdBy, eventDate, assets = [], avatarUrl,
  } = pendingApproval;

  return (
    <React.Fragment>
      <div styleName="admin-card">
        <div styleName="left-content">
          <div styleName="header">
            <div>
              <span styleName="date date-first">{moment(submitDate).format('MMM DD, YYYY')}</span>
              <img alt="user-avatar" src={avatarUrl} styleName="avatar" />
              <Link styleName="handle" to={`/members/${createdBy}`}>{ createdBy }</Link>
            </div>
            <div>
              <span styleName="date">Submitted Date: {moment(eventDate).format('MMM DD, YYYY')}</span>
            </div>
          </div>
          <div styleName="content">
            <h3 styleName="title">{eventName}</h3>
            <p styleName="description">{description}</p>
          </div>

          <div styleName="footer">
            <div
              role="presentation"
              styleName="trash-icon"
              onClick={() => setDeleteModal(true)}
            >
              <TrashIcon />
            </div>
            <div styleName="buttons">
              <Button
                theme={{ button: style.buttonOutlined }}
                onClick={() => setShowModal(true)}
              >
                REJECT
              </Button>
              <PrimaryButton theme={{ button: style.button }}>APPROVE</PrimaryButton>
            </div>
          </div>
        </div>
        <div styleName="right-content">
          {
          assets.map((asset, index) => {
            const { url, videoPreview } = asset;
            const isVideo = !_.isEmpty(videoPreview);
            return (
              <div
                role="presentation"
                key={uuidv4()}
                styleName={classNames('timeline-asset', {
                  video: isVideo,
                })}
                onClick={() => {
                  onSelectAsset(assets, index);
                }}
              >
                <img src={isVideo ? videoPreview : url} alt="timeline portrait" />
              </div>
            );
          })
              }
        </div>

      </div>
      {
        showModal ? (
          <Modal theme={{
            container: style.modalContainer,
            overlay: style.modalOverlay,
          }}
          >
            <div>
              <div styleName="modal-title">
                <h3>CONFIRM REJECT EVENT</h3>
                <div role="button" onClick={() => setShowModal(false)} tabIndex={0}>
                  <CloseIcon />
                </div>
              </div>

              <div>
                <h4 styleName="modal-description">
                  Please provide a reason for rejecting this event.
                  Note that this action cannot be undone.
                </h4>

                <FormField label="Rejection Reason" style={{ flex: '0 0 100%', marginTop: '16px' }}>
                  <FormInputSelect
                    name="reasons"
                    options={getRejectioneReasons()}
                    placeholder="Select duplicate reason"
                    onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                  />
                </FormField>

                <FormField label="Note" style={{ flex: '0 0 100%', marginTop: '16px' }}>
                  <FormInputTextArea
                    name="note"
                    placeholder="Select note"
                    onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                    maxLength={256}
                  />
                </FormField>

                <div styleName="modal-footer">
                  <Button
                    theme={{ button: style.modalButtonOutlined }}
                    onClick={() => setShowModal(false)}
                  >
                    CANCEL
                  </Button>
                  <Button
                    theme={{ button: style.modalButton }}
                    onClick={() => setShowModal(false)}
                  >
                    REJECT
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        ) : null
      }
      {
        deleteModal ? (
          <Modal theme={{
            container: style.modalContainer,
            overlay: style.modalOverlay,
          }}
          >
            <div>
              <div styleName="modal-title">
                <h3>DELETE CONFIRMATION</h3>
                <div role="button" onClick={() => setDeleteModal(false)} tabIndex={0}>
                  <CloseIcon />
                </div>
              </div>

              <div>
                <h4 styleName="modal-description">
                  Are you sure you want to delete the event “{eventName}” from {createdBy}?
                </h4>

                <div styleName="modal-footer">
                  <Button
                    theme={{ button: style.modalButtonOutlined }}
                    onClick={() => setDeleteModal(false)}
                  >
                    NO, CANCEL
                  </Button>
                  <Button
                    theme={{ button: style.modalButton }}
                    onClick={() => setDeleteModal(false)}
                  >
                    YES, DELETE
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        ) : null
      }
    </React.Fragment>
  );
};

AdminCard.defaultProps = {
  pendingApproval: {},
};

AdminCard.propTypes = {
  pendingApproval: PT.shape(),
  onSelectAsset: PT.func.isRequired,
};

export default AdminCard;
