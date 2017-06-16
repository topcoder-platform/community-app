/**
 * A single item in the standard Topcoder desktop header submenu.
 */

import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function Item({
  currentSubMenuTitle,
  icon,
  link,
  title,
}) {
  let styleName = 'item';
  if (currentSubMenuTitle === title) styleName += ' current';
  return (
    <li styleName={styleName}>
      <a href={link}>
        {icon}
        {title}
      </a>
    </li>
  );
}

Item.propTypes = {
  currentSubMenuTitle: PT.string.isRequired,
  icon: PT.node.isRequired,
  link: PT.string.isRequired,
  title: PT.string.isRequired,
};
