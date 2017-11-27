/**
 * Demo/test of ScalableRect component.
 */

import React from 'react';
import Rect from 'components/ScalableRect';

import './style.scss';

export default function ScalableRect() {
  return (
    <div styleName="container">
      <h1 styleName="title">
        Demo/test of the <code>ScalableRect</code> component
      </h1>
      <h3>A rect with 16:9 side ratio</h3>
      <Rect ratio="16:9"><div styleName="test-content" /></Rect>
      <h3>A small default (1:1) rect, occupying 20% of the pagewidth</h3>
      <Rect styleName="small"><div styleName="test-content" /></Rect>
      <h3>A small 4:3 rect, occupying 20% of the page width</h3>
      <Rect ratio="4:3" styleName="small">
        <div styleName="test-content" />
      </Rect>
    </div>
  );
}
