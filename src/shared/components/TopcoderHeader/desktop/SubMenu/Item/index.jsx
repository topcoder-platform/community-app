/**
 * A single item in the standard Topcoder desktop header submenu.
 */

import PT from 'prop-types';
import React from 'react';
import { Link } from 'utils/router';
import './style.scss';

export default function Item({
  currentSubMenuTitle,
  icon,
  link,
  title,
  closeMenu,
}) {
  let styleName = 'item';
  if (currentSubMenuTitle === title) styleName += ' current';
  return (
    <li styleName={styleName} onClick={closeMenu}>
      <Link to={link}>
        {icon}
        {title}
      </Link>
    </li>
  );
}

Item.propTypes = {
  currentSubMenuTitle: PT.string.isRequired,
  icon: PT.node.isRequired,
  link: PT.string.isRequired,
  title: PT.string.isRequired,
  closeMenu: PT.func.isRequired,
};
