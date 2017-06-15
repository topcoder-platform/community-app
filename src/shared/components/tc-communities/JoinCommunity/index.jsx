/**
 * Join Community component. It includes 'Join Community' button, which is
 * automatically hidden, when a user is already member of community. Button
 * text changes to the loading symbol, when the joining is underway. And a
 * modal is shown on success.
 */

/* global window */

import config from 'utils/config';
import LoadingIndicator from 'components/LoadingIndicator';
import Modal from 'components/Modal';
import PT from 'prop-types';
import React from 'react';
import style from './style.scss';

export default function JoinCommunity({
  canJoin,
  communityName,
  groupId,
  hideJoinButton,
  join,
  joined,
  joining,
  token,
  userId,
}) {
  if (!canJoin) return <div styleName="placeholder" />;
  return (
    <div>
      <button
        onClick={() => {
          if (joining || joined) return;
          if (token) join(token, groupId, userId);
          else {
            /* If our visitor is not authenticated, the button redirects to
             * login page, with return URL set back to this page. */
            const url = encodeURIComponent(window.location.href);
            window.location = `${config.URL.AUTH}?retUrl=${url}`;
          }
        }}
        styleName={`link ${joining ? 'joining' : ''}`}
      >
        { joining ? (
          <div>
            <p>Joining...</p>
            <LoadingIndicator theme={{ style: style.loadingIndicator }} />
          </div>
        ) : 'Join Community'}
      </button>
      { joined ? (
        <Modal onCancel={hideJoinButton}>
          <h1 styleName="modalTitle">Congratulations!</h1>
          <p styleName="modalMsg">You have joined {communityName}!</p>
          <button
            onClick={hideJoinButton}
            styleName="done"
          >Return to the Community</button>
        </Modal>
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
  canJoin: PT.bool.isRequired,
  communityName: PT.string.isRequired,
  groupId: PT.string,
  hideJoinButton: PT.func.isRequired,
  join: PT.func.isRequired,
  joined: PT.bool.isRequired,
  joining: PT.bool.isRequired,
  token: PT.string,
  userId: PT.string,
};
