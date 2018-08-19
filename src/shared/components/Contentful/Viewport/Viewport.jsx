/**
 * Themed Viewport Component
 */
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';

/* Loads viewport content assets. */
const Viewport = ({ children, extraStylesForContainer, theme }) => (
  <div className={theme.container} style={extraStylesForContainer}>
    {children}
  </div>
);

Viewport.defaultProps = {
  extraStylesForContainer: {},
};

Viewport.propTypes = {
  children: PT.node.isRequired,
  extraStylesForContainer: PT.shape(),
  theme: PT.shape({
    container: PT.string.isRequired,
  }).isRequired,
};

export default themr('Viewport')(Viewport);
