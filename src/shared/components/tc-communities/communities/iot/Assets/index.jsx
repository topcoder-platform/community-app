/**
 * Assets page of IoT community
 */
/* eslint-disable max-len */
import React from 'react';
import PT from 'prop-types';


import JoinSection from '../JoinSection';
import TopBanner from './TopBanner';
import AssetList from './AssetList';

import './styles.scss';

export default function Assets({
  baseUrl,
  display,
  toggleGrid,
  toggleList,
}) {
  return (
    <main styleName="main">
      <TopBanner
        display={display}
        toggleGrid={toggleGrid}
        toggleList={toggleList}
      />
      <AssetList
        baseUrl={baseUrl}
        display={display}
      />
      <JoinSection
        baseUrl={baseUrl}
      />
    </main>
  );
}

Assets.propTypes = {
  baseUrl: PT.string.isRequired,
  display: PT.string.isRequired,
  toggleGrid: PT.func.isRequired,
  toggleList: PT.func.isRequired,
};
