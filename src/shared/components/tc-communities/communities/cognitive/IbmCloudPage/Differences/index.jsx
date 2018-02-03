import React from 'react';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import { Link } from 'topcoder-react-utils';

import style from './style.scss';

export default function Differences() {
  return (
    <div styleName="container">
      <div styleName="content">
        <div styleName="left">
          <h1 styleName="title">
            Differences Between an IBM Cloud Trial and IBM Cloud Lite Account
          </h1>
          <p styleName="text">
            Unless you already have an IBM Cloud Trial account, you’ll
            want to
            &zwnj;<Link
              openNewTab
              to="https://console.bluemix.net/registration/?cm_sp=dw-cognitive-_-TPC2017-_-community"
            >sign up for an IBM Cloud Lite account</Link>. Here’s a
            breakdown of the major differences between an IBM Cloud
            Trial account and an IBM Cloud Lite account.
          </p>

          {/* Hidden for now by request from Trevor. */}
          {/*
            <p styleName="text">
              Rest assured — if you already have an IBM Cloud Trial
              account, you can convert to an IBM Lite account.
            </p>
          */}

          <PrimaryButton
            openNewTab
            theme={{ button: style.button }}
            to="https://www.ibm.com/cloud/lite-account"
          >Learn More About IBM Cloud Lite</PrimaryButton>
        </div>
        <div styleName="right">
          <div styleName="trial">
            <h1 styleName="subTitle">IBM Cloud Trial</h1>
            <ul>
              <li>Expires after 30 days</li>
              <li>Free — no credit card required</li>
              <li>Maximum 2GB memory</li>
              <li>10 services</li>
              <li>1 SSL certificate</li>
            </ul>
          </div>
          <div styleName="light">
            <h1 styleName="subTitle">IBM Cloud Lite</h1>
            <ul>
              <li>Never expires</li>
              <li>Free — no credit card required</li>
              <li>256 MB of memory</li>
              <li>1 instance per Lite plan</li>
              <li>App auto-sleep</li>
              <li>Service garbage collection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

