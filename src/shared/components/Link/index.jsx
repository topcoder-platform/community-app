/**
 * Top Banner component of About page IoT community
 */
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import predixPlusTopcoderSrc from 'assets/themes/iot/home/home-hero-title.png';

import './styles.scss';

const Link = ({
  to,
  children
}) => (
  <li styleName="link">
    <a href={to}>{children}</a>
  </li>
);

Link.propTypes = {
  baseUrl: PT.string.isRequired,
};

export default Link;
