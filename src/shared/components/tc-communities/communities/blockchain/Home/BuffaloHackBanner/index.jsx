import _ from 'lodash';
import config from 'utils/config';
import React from 'react';
import { Button } from 'topcoder-react-ui-kit';

import joinButtonStyle from '../../themes/join-button.scss';
import style from './style.scss';

/* global window */

_.noop(style);

export default function BuffaloHackBanner() {
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
          <Button
            onClick={() => {
              let url = encodeURIComponent(
                `${window.location.href}?join=20000010`,
              );
              url = encodeURIComponent(
                `${config.URL.AUTH}/member?retUrl=${url}&utm_source=blockchain&utm_campaign=buffalohack`,
              );
              url = encodeURIComponent(url);
              window.location = `${config.URL.AUTH}/member/registration?retUrl=${url}&utm_source=blockchain&utm_campaign=buffalohack`;
            }}
            theme={joinButtonStyle}
          >Register Now</Button>
        </div>
      </div>
    </div>
  );
}
