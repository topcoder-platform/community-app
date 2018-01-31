import React from 'react';

import ibmCloudLogoUrl from 'assets/images/communities/cognitive/ibm-cloud-logo.png';

import './style.scss';

export default function HeadBanner() {
  return (
    <div styleName="container">
      <img
        alt="IBM Cloud Logo"
        src={ibmCloudLogoUrl}
        styleName="logo"
      />
      <h1 styleName="text">Goodbye IBM Bluemix,<br />Hello IBM Cloud!</h1>
    </div>
  );
}
