import React from 'react';
import './style-a.scss';

export default function ComponentA() {
  return (
    <div styleName="Style">
      If CSS modules work fine this text should be red, otherwise - green.
    </div>
  );
}
