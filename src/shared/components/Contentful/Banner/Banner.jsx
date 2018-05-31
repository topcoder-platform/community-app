/**
 * The core banner rendering.
 */

import _ from 'lodash';
import md from 'utils/markdown';
import PT from 'prop-types';
import React from 'react';

import { themr } from 'react-css-super-themr';

import defaultTheme from './themes/default.scss';

function Banner({
  background,
  banner,
  theme,
}) {
  return (
    <div
      className={theme.container}
      style={_.merge({
        backgroundImage: `url(${background.file.url})`,
      }, banner.containerStyles)}
    >
      <div className={theme.contentWrapper} style={banner.contentWrapperStyles}>
        <div
          className={theme.content}
          /* eslint-disable react/no-danger */
          dangerouslySetInnerHTML={{ __html: md(banner.text) }}
          /* eslint-enable react/no-danger */
          style={banner.contentStyles}
        />
      </div>
    </div>
  );
}

Banner.propTypes = {
  background: PT.shape().isRequired,
  banner: PT.shape().isRequired,
  theme: PT.shape({
    container: PT.string.isRequired,
    content: PT.string.isRequired,
    contentWrapper: PT.string.isRequired,
  }).isRequired,
};

export default themr('Banner', defaultTheme)(Banner);
