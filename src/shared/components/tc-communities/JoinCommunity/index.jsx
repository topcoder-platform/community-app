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
import { Button, PrimaryButton } from 'topcoder-react-ui-kit';
import { COMPOSE } from 'react-css-super-themr';
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
  communityId,
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
  if (state === STATE.HIDDEN) return <div styleName="style.placeholder" />;
  return (
    <div
      className={theme.container}
    >
      <Button
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
        {...(theme.link ? { theme: theme.link, composeContextTheme: COMPOSE.SWAP } : {})}
      >
        { state === STATE.JOINING ? (
          <div className={style.joiningContainer}>
            <span>Joining...</span>
            <LoadingIndicator theme={{ container: style.loadingIndicator }} />
          </div>
        ) : label}
      </Button>
      { state === STATE.JOINED ? (
        <Modal onCancel={hideJoinButton}>
          <h1 styleName="style.modalTitle">Congratulations!</h1>
          <p styleName="style.modalMsg">You have joined the {communityName}!</p>
          <PrimaryButton
            onClick={hideJoinButton}
            theme={{
              button: style.returnToCommunityButton,
            }}
          >Return to the Community</PrimaryButton>
        </Modal>
      ) : null}
      { state === STATE.CONFIRM_JOIN ? (
        <ConfirmModal
          communityId={communityId}
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
  theme: {},
  token: null,
  userId: null,
};

JoinCommunity.propTypes = {
  communityId: PT.string.isRequired,
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
