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
import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';
import style from './style.scss';

export default function ConfirmModal({
  communityId,
  communityName,
  groupIds,
  join,
  resetJoinButton,
  token,
  userId,
}) {
  return (
    <Modal onCancel={resetJoinButton}>
      <div styleName="style.confirmMsg">
        { userId ? (
          <p>Do you want to join {communityName}?</p>
        ) : (
          <div>
            <p>You must be a Topcoder member before you can join the {communityName}.</p>
            <p>To join, login if you are already a member. If not, register first.</p>
          </div>
        )}
      </div>
      { userId ? (
        <div className={style.joinButtons}>
          <PrimaryButton
            onClick={() => join(token, groupIds[0], userId)}
          >Join</PrimaryButton>
          <SecondaryButton
            onClick={resetJoinButton}
          >Cancel</SecondaryButton>
        </div>
      ) : (
        <div className={style.loginButtons}>
          <PrimaryButton
            onClick={() => {
              const url = encodeURIComponent(
                `${window.location.href}?join=${groupIds[0]}`,
              );
              window.location = `${config.URL.AUTH}/member?retUrl=${url}&utm_source=${communityId}`;
            }}
          >Login</PrimaryButton>
          <PrimaryButton
            onClick={() => {
              let url = encodeURIComponent(
                `${window.location.href}?join=${groupIds[0]}`,
              );
              url = encodeURIComponent(
                `${config.URL.AUTH}/member?retUrl=${url}&utm_source=${communityId}`,
              );
              url = encodeURIComponent(url);
              window.location = `${config.URL.AUTH}/member/registration?retUrl=${url}&utm_source=${communityId}`;
            }}
          >Register</PrimaryButton>
          <SecondaryButton
            onClick={resetJoinButton}
          >Cancel</SecondaryButton>
        </div>
      )}
    </Modal>
  );
}

ConfirmModal.defaultProps = {
  token: null,
  userId: null,
};

ConfirmModal.propTypes = {
  communityId: PT.string.isRequired,
  communityName: PT.string.isRequired,
  groupIds: PT.arrayOf(PT.string).isRequired,
  join: PT.func.isRequired,
  resetJoinButton: PT.func.isRequired,
  token: PT.string,
  userId: PT.string,
};
