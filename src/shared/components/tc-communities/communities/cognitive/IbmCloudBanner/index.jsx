/**
 * IBM Cloud Banner.
 */

import PT from 'prop-types';
import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import ibmCloudLogoUrl from
  'assets/images/communities/cognitive/ibm-cloud-logo.png';

import style from './style.scss';

export default function IbmCloudBanner({
  onClick,
  to,
}) {
  return (
    <div styleName="container">
      <div styleName="leftBlock">
        <img
          alt="IBM Cloud Logo"
          src={ibmCloudLogoUrl}
          styleName="logo"
        />
        <h1
          styleName="text"
        >IBM Bluemix is Now IBM Cloud!</h1>
      </div>
      <PrimaryButton
        onClick={onClick}
        theme={{
          button: style.button,
        }}
        to={to}
      >Learn More</PrimaryButton>
    </div>
  );
}

IbmCloudBanner.defaultProps = {
  onClick: null,
};

IbmCloudBanner.propTypes = {
  onClick: PT.func,
  to: PT.string.isRequired,
};
