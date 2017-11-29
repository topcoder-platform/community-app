/**
 * The modal asking visitor to confirm that he wants to join community where
 * JoinCommunity component is rendered. If visitor is authenticated it shows
 * Join / Cancel buttons that do what they are supposed to do; otherwise it
 * shows Register & Join / Log In & Join / Cancel buttons, first of which get
 * visitor to registration / login flows, with return url making the join to
 * happen automatically.
 */

/* global window */

import config from 'utils/config';
import Modal from 'components/Modal';
import PT from 'prop-types';
import React from 'react';
import { PrimaryButton, SecondaryButton } from 'components/buttons';
import { COMPOSE, themr } from 'react-css-super-themr';
import style from './style.scss';
import primaryBtn from '../../../buttons/outline/round/community/primary.scss';
import secondaryBtn from '../../../buttons/outline/round/community/secondary.scss';

function ConfirmModal({
  communityName,
  groupIds,
  join,
  resetJoinButton,
  token,
  userId,
  theme,
}) {
  return (
    <Modal onCancel={resetJoinButton}>
      <div className={style.confirmMsg}>
        { userId ? (
          <p>Do you want to join {communityName}?</p>
        ) : (
          <div>
            <p>You must be a Topcoder member before you can join the {communityName}.</p>
            <p>To join, login if you are already a member. If not, register first.</p>
          </div>
        )}
      </div>
      <div className={style.buttons}>
        { userId ? (
          <div>
            <PrimaryButton
              onClick={() => join(token, groupIds[0], userId)}
              size="sm"
              theme={theme.primaryBtn}
              composeContextTheme={COMPOSE.SWAP}
            >Join</PrimaryButton>
            <SecondaryButton
              onClick={resetJoinButton}
              size="sm"
              theme={theme.secondaryBtn}
              composeContextTheme={COMPOSE.SWAP}
            >Cancel</SecondaryButton>
          </div>
        ) : (
          <span>
            <PrimaryButton
              onClick={() => {
                const url = encodeURIComponent(
                  `${window.location.href}?join=${groupIds[0]}`,
                );
                window.location = `${config.URL.AUTH}/member?retUrl=${url}`;
              }}
              size="lg"
              theme={theme.primaryBtn}
              composeContextTheme={COMPOSE.SWAP}
            >Login</PrimaryButton>
            <PrimaryButton
              onClick={() => {
                let url = encodeURIComponent(
                  `${window.location.href}?join=${groupIds[0]}`,
                );
                url = encodeURIComponent(
                  `${config.URL.AUTH}/member?retUrl=${url}`,
                );
                url = encodeURIComponent(url);
                window.location = `${config.URL.AUTH}/member/registration?retUrl=${url}`;
              }}
              size="lg"
              theme={theme.primaryBtn}
              composeContextTheme={COMPOSE.SWAP}
            >Register</PrimaryButton>
            <SecondaryButton
              onClick={resetJoinButton}
              size="lg"
              theme={theme.secondaryBtn}
              composeContextTheme={COMPOSE.SWAP}
            >Cancel</SecondaryButton>
          </span>
        )}
      </div>
    </Modal>
  );
}

ConfirmModal.defaultProps = {
  token: null,
  userId: null,
};

ConfirmModal.propTypes = {
  communityName: PT.string.isRequired,
  groupIds: PT.arrayOf(PT.string).isRequired,
  join: PT.func.isRequired,
  resetJoinButton: PT.func.isRequired,
  token: PT.string,
  userId: PT.string,
  theme: PT.shape({
    primaryBtn: PT.shape().isRequired,
    secondaryBtn: PT.shape().isRequired,
  }).isRequired,
};

export default themr('ConfirmModal', { primaryBtn, secondaryBtn })(ConfirmModal);