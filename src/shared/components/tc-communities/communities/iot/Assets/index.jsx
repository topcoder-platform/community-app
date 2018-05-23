/**
 * About static page of IoT community
 */
/* eslint-disable max-len */
import React from 'react';
import PT from 'prop-types';

import predixLogoSrc from 'assets/themes/iot/about/predix-logo.png';
import geLogoSrc from 'assets/themes/iot/about/ge-digital-logo.png';
import geniuslinkLogoSrc from 'assets/themes/iot/about/geniuslink-logo.png';

import Section from '../../../Section';
import JoinSection from '../JoinSection';
import TopBanner from './TopBanner';
import AssetsView from './AssetsView';
import styles from './styles.scss';

const clicked = false;


const grid1 = "active"
export default function Assets({
  baseUrl,
}) {
  return (
    <main styleName="main">
      <AssetsView baseUrl={baseUrl}/>
      <JoinSection baseUrl={baseUrl}/>
    </main>
  );
}

Assets.propTypes = {
  baseUrl: PT.string.isRequired,
};
