/**
 * Button-like link component. Most probably, it can be generalized and reused
 * in different components, not only inside the Banner. However, as it is first
 * created to split some code just included originally into the Banner, let's
 * start simple.
 */

import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-themr';
import { Link as RouterLink } from 'utils/router';
import defaultStyle from './style.scss';

function Link({ theme, title, url }) {
  return (
    <div className={theme.linkWrap} >
      <RouterLink className={theme.link} to={url}>{title}</RouterLink>
    </div>
  );
}

Link.propTypes = {
  theme: PT.shape().isRequired,
  title: PT.string.isRequired,
  url: PT.string.isRequired,
};

export default themr('ButtonLikeLink', defaultStyle)(Link);
