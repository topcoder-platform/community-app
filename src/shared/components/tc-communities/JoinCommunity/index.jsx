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
  label,
  resetJoinButton,
  showJoinConfirmModal,
  state,
  theme,
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
        className={`${theme.link} ${state === STATE.JOINING ? style.joining : ''}`}
      >
        { state === STATE.JOINING ? (
          <div>
            <p>Joining...</p>
            <LoadingIndicator theme={{ container: style.loadingIndicator }} />
          </div>
        ) : label}
      </button>
      { state === STATE.JOINED ? (
        <Modal onCancel={hideJoinButton}>
          <h1 styleName="modalTitle">Congratulations!</h1>
          <p styleName="modalMsg">You have joined the {communityName}!</p>
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
  label: 'Join Community',
  theme: {
    link: style.link,
  },
  token: null,
  userId: null,
};

JoinCommunity.propTypes = {
  communityName: PT.string.isRequired,
  groupId: PT.string,
  hideJoinButton: PT.func.isRequired,
  join: PT.func.isRequired,
  label: PT.string,
  resetJoinButton: PT.func.isRequired,
  showJoinConfirmModal: PT.func.isRequired,
  state: PT.oneOf(_.values(STATE)).isRequired,
  theme: PT.shape(),
  token: PT.string,
  userId: PT.string,
};
