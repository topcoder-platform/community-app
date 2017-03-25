/**
 * The SvgLoading component shows the correct way of loading .svg assets with
 * help of `babel-plugin-inline-react-svg`.
 */

import React from 'react';
import SampleAsset from './sample-asset.svg';

export default function SvgLoading() {
  return (
    <div>
      <h1>SVG Loading</h1>
      <p>This component show how to load <code>.svg</code> assets with use of
      <code> babel-plugin-inline-react-svg</code>.</p>
      <SampleAsset
        width="640px"
        height="200px"
      />
    </div>
  );
}
