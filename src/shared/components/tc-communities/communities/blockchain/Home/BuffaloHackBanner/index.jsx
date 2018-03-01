import _ from 'lodash';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import PT from 'prop-types';
import React from 'react';

import joinButtonStyle from '../../themes/join-button.scss';
import style from './style.scss';

_.noop(style);

const HACKATHON_REG_GROUP_ID = '20000043';

export default function BuffaloHackBanner({
  userGroups,
}) {
  const registered = userGroups
  && userGroups.find(x => x.id === HACKATHON_REG_GROUP_ID);

  return (
    <div styleName="style.container">
      <div styleName="style.content">
        <div styleName="style.contentBackground" />
        <div styleName="style.information">
          <h1 styleName="style.title">
            EthBuf Blockchain Hackathon at the University of Buffalo
          </h1>
          <p styleName="style.text">
            Join us for an amazing weekend of hacking and problem solving
            focused on Blockchain solutions! Over 200 participants and
            Blockchain industry experts will be on-site!
          </p>
          <p styleName="style.date">April 14-15, 2018</p>
          {
            registered ? (
              <p styleName="style.date">
                You have been registered, wait for news in your email box.
              </p>
            ) : (
              <JoinCommunity
                customJoinConfirmationText="You have been registered for the Hackathon!"
                customTcAuthModalText="You must be a Topcoder member before you can register for the Hackathon. Please, login if you are already a member, register a new member account otherwise."
                hiddenButtonText={
                  <p styleName="style.date">
                    You have been registered, wait for news in your email box.
                  </p>
                }
                joinGroupId={HACKATHON_REG_GROUP_ID}
                label="Register Now"
                skipConfirmJoin
                theme={{ link: joinButtonStyle }}
              />
            )
          }
        </div>
      </div>
    </div>
  );
}

BuffaloHackBanner.defaultProps = {
  userGroups: null,
};

BuffaloHackBanner.propTypes = {
  userGroups: PT.arrayOf(PT.shape({
    id: PT.string.isRequired,
  })),
};
