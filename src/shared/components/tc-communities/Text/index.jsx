/**
 * Text component
 *
 * This component outputs formated text.
 */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import defaultStyle from './style.scss';

function Text(props) {
  const { children, theme } = props;

  return (
    <div className={theme.container}>
      {children}
    </div>
  );
}

Text.defaultProps = {
  theme: {},
};

Text.propTypes = {
  children: PT.node.isRequired,
  theme: PT.shape({
    container: PT.string,
  }),
};

export default themr('tcCommunities-Text', defaultStyle)(Text);
