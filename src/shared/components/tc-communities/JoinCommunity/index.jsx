/**
 * Join Community component. It includes 'Join Community' button, which is
 * automatically hidden, when a user is already member of community. Button
 * text changes to the loading symbol, when the joining is underway. And a
 * modal is shown on success.
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import Modal from 'components/Modal';
import PT from 'prop-types';
import React from 'react';
import style from './style.scss';

import ConfirmModal from './ConfirmModal';

export const STATE = {
  CONFIRM_JOIN: 'confirm-join',
  DEFAULT: 'default',
  HIDDEN: 'hidden',
  JOINED: 'joined',
  JOINING: 'joining',
};

export default function JoinCommunity({
  communityName,
  groupId,
  hideJoinButton,
  join,
  resetJoinButton,
  showJoinConfirmModal,
  state,
  token,
  userId,
}) {
  if (state === STATE.HIDDEN) return <div styleName="placeholder" />;
  return (
    <div>
      <button
        onClick={() => {
          switch (state) {
            case STATE.JOINED:
            case STATE.JOINING:
              return;
            default:
          }
          showJoinConfirmModal();
        }}
        styleName={`link ${state === STATE.JOINING ? 'joining' : ''}`}
      >
        { state === STATE.JOINING ? (
          <div>
            <p>Joining...</p>
            <LoadingIndicator theme={{ style: style.loadingIndicator }} />
          </div>
        ) : 'Join Community'}
      </button>
      { state === STATE.JOINED ? (
        <Modal onCancel={hideJoinButton}>
          <h1 styleName="modalTitle">Congratulations!</h1>
          <p styleName="modalMsg">You have joined {communityName}!</p>
          <button
            onClick={hideJoinButton}
            styleName="done"
          >Return to the Community</button>
        </Modal>
      ) : null}
      { state === STATE.CONFIRM_JOIN ? (
        <ConfirmModal
          communityName={communityName}
          groupId={groupId}
          join={join}
          resetJoinButton={resetJoinButton}
          token={token}
          userId={userId}
        />
      ) : null}
    </div>
  );
}

JoinCommunity.defaultProps = {
  groupId: null,
  token: null,
  userId: null,
};

JoinCommunity.propTypes = {
  communityName: PT.string.isRequired,
  groupId: PT.string,
  hideJoinButton: PT.func.isRequired,
  join: PT.func.isRequired,
  resetJoinButton: PT.func.isRequired,
  showJoinConfirmModal: PT.func.isRequired,
  state: PT.oneOf(_.values(STATE)).isRequired,
  token: PT.string,
  userId: PT.string,
};
