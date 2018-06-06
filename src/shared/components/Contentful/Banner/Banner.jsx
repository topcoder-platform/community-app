/**
 * The core banner rendering.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import MarkdownRenderer from 'components/MarkdownRenderer';

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
          style={banner.contentStyles}
        >
          <MarkdownRenderer markdown={banner.text} />
        </div>
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
