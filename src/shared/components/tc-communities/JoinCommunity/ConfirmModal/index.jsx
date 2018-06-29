/**
 * The modal asking visitor to confirm that he wants to join community where
 * JoinCommunity component is rendered. If visitor is authenticated it shows
 * Join / Cancel buttons that do what they are supposed to do; otherwise it
 * shows Register & Join / Log In & Join / Cancel buttons, first of which get
 * visitor to registration / login flows, with return url making the join to
 * happen automatically.
 */

/* global window */

import Modal from 'components/Modal';
import PT from 'prop-types';
import qs from 'qs';
import React from 'react';
import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';

import style from './style.scss';

export default function ConfirmModal({
  communityId,
  communityName,
  customTcAuthModalText,
  groupIds,
  join,
  joinGroupId,
  resetJoinButton,
  skipConfirmJoin,
  token,
  userId,
}) {
  let text;
  if (userId) {
    text = (
      <p>
Do you want to join
        {communityName}
?
      </p>
    );
    if (skipConfirmJoin) {
      setImmediate(() => join(token, joinGroupId || groupIds[0], userId));
    }
  } else {
    text = customTcAuthModalText || (
      <div>
        <p>
You must be a Topcoder member before you can join the
          {communityName}
.
        </p>
        <p>
To join, login if you are already a member. If not, register first.
        </p>
      </div>
    );
  }

  const currentUrl = window.location.href.match(/[^?]*/)[0];
  let q = window.location.search.slice(1);
  q = q ? qs.parse(q) : {};
  q.join = joinGroupId || groupIds[0];
  const autoJoinUrl = `${currentUrl}?${qs.stringify(q)}`;

  return (
    <Modal onCancel={resetJoinButton}>
      <div styleName="style.confirmMsg">
        {text}
      </div>
      { userId ? (
        <div className={style.joinButtons}>
          <PrimaryButton
            onClick={() => join(token, joinGroupId || groupIds[0], userId)}
          >
Join
          </PrimaryButton>
          <SecondaryButton
            onClick={resetJoinButton}
          >
Cancel
          </SecondaryButton>
        </div>
      ) : (
        <div className={style.loginButtons}>
          <PrimaryButton
            onClick={() => {
              const url = encodeURIComponent(autoJoinUrl);
              window.location = `${config.URL.AUTH}/member?retUrl=${url}&utm_source=${communityId}`;
            }}
          >
Login
          </PrimaryButton>
          <PrimaryButton
            onClick={() => {
              let url = encodeURIComponent(autoJoinUrl);
              url = encodeURIComponent(`${config.URL.AUTH}/member?retUrl=${url}&utm_source=${communityId}`);
              url = encodeURIComponent(url);
              window.location = `${config.URL.AUTH}/member/registration?retUrl=${url}&utm_source=${communityId}`;
            }}
          >
Register
          </PrimaryButton>
          <SecondaryButton
            onClick={resetJoinButton}
          >
Cancel
          </SecondaryButton>
        </div>
      )}
    </Modal>
  );
}

ConfirmModal.defaultProps = {
  token: null,
  userId: null,
  // utmCampaign: '',
};

ConfirmModal.propTypes = {
  communityId: PT.string.isRequired,
  communityName: PT.string.isRequired,
  customTcAuthModalText: PT.node.isRequired,
  groupIds: PT.arrayOf(PT.string).isRequired,
  join: PT.func.isRequired,
  joinGroupId: PT.string.isRequired,
  resetJoinButton: PT.func.isRequired,
  skipConfirmJoin: PT.bool.isRequired,
  token: PT.string,
  userId: PT.string,
};
