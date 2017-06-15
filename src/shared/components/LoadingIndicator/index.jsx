import PT from 'prop-types';
import Source from 'assets/images/ripple.gif';
import React from 'react';
import { themr } from 'react-css-themr';
import style from './styles.scss';

function LoadingIndicator({ theme }) {
  return (
    <img
      alt="Loading..."
      className={theme.style}
      src={Source}
    />
  );
}

LoadingIndicator.propTypes = {
  theme: PT.shape().isRequired,
};

export default themr('LoadingIndicator', style)(LoadingIndicator);
