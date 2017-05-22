/**
 * A single item in the standard Topcoder desktop header submenu.
 */

import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function Item({ icon, link, title }) {
  return (
    <li styleName="item">
      <a href={link}>
        {icon}
        {title}
      </a>
    </li>
  );
}

Item.propTypes = {
  icon: PT.node.isRequired,
  link: PT.string.isRequired,
  title: PT.string.isRequired,
};
