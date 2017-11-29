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
import { GenericButton } from 'components/buttons';
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
  groupIds,
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
    <div
      className={theme.container}
    >
      <GenericButton
        onClick={() => {
          switch (state) {
            case STATE.JOINED:
            case STATE.JOINING:
              return;
            default:
          }
          showJoinConfirmModal();
        }}
        className={state === STATE.JOINING ? style.joining : ''}
        theme={{ button: theme.link, disabled: style.disabled }}
      >
        { state === STATE.JOINING ? (
          <div>
            <p>Joining...</p>
            <LoadingIndicator theme={{ container: style.loadingIndicator }} />
          </div>
        ) : label}
      </GenericButton>
      { state === STATE.JOINED ? (
        <Modal onCancel={hideJoinButton}>
          <h1 styleName="modalTitle">Congratulations!</h1>
          <p styleName="modalMsg">You have joined the {communityName}!</p>
          <GenericButton
            onClick={hideJoinButton}
            theme={{ button: style.done, disabled: style.disabled }}
          >Return to the Community</GenericButton>
        </Modal>
      ) : null}
      { state === STATE.CONFIRM_JOIN ? (
        <ConfirmModal
          communityName={communityName}
          groupIds={groupIds}
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
  groupIds: [''],
  label: 'Join Community',
  theme: {
    link: style.link,
  },
  token: null,
  userId: null,
};

JoinCommunity.propTypes = {
  communityName: PT.string.isRequired,
  groupIds: PT.arrayOf(PT.string),
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
