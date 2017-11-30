/**
 * A groupping box with title to be used around example pages.
 */

import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function SamplesGroup({ children, title }) {
  return (
    <div styleName="container">
      <h3 styleName="title">{title}</h3>
      {children}
    </div>
  );
}

SamplesGroup.defaultProps = {
  children: null,
  title: null,
};

SamplesGroup.propTypes = {
  children: PT.node,
  title: PT.node,
};
