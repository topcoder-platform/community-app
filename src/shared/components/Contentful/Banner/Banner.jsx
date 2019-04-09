/**
 * The core banner rendering.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import MarkdownRenderer from 'components/MarkdownRenderer';

import { themr } from 'react-css-super-themr';
import { fixStyle } from 'utils/contentful';

import defaultTheme from './themes/default.scss';

function Banner({
  background,
  banner,
  theme,
  spaceName,
  environment,
  preview,
}) {
  const contentfulConfig = {
    spaceName,
    environment,
    preview,
  };
  return (
    <div
      className={theme.container}
      style={_.merge({
        backgroundImage: `url(${background.file.url})`,
      }, fixStyle(banner.containerStyles))}
    >
      <div
        className={theme.contentWrapper}
        style={fixStyle(banner.contentWrapperStyles)}
      >
        <div
          className={theme.content}
          style={fixStyle(banner.contentStyles)}
        >
          <MarkdownRenderer markdown={banner.text} {...contentfulConfig} />
        </div>
      </div>
    </div>
  );
}

Banner.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

Banner.propTypes = {
  background: PT.shape().isRequired,
  banner: PT.shape().isRequired,
  theme: PT.shape({
    container: PT.string.isRequired,
    content: PT.string.isRequired,
    contentWrapper: PT.string.isRequired,
  }).isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};

export default themr('Banner', defaultTheme)(Banner);
