import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import style from './style.scss';

export default function JoinBlock() {
  return (
    <div styleName="container">
      <h1 styleName="title">Bluemix is Now IBM Cloud</h1>
      <p styleName="text">
        While everything you loved about Bluemix is the same under IBM Cloud,
        the difference is that IBM now provides one easy-to-use cloud across
        multiple deployments. And in order to compete in Topcoder challenges,
        you need to have an IBM Cloud account.
      </p>
      <PrimaryButton
        openNewTab
        theme={{ button: style.button }}
        to="https://console.bluemix.net/registration/?cm_sp=dw-cognitive-_-TPC2017-_-community"
      >Sign up for IBM Cloud Lite</PrimaryButton>
    </div>
  );
}
