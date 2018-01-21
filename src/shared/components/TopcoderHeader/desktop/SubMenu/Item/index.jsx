/**
 * A single item in the standard Topcoder desktop header submenu.
 */

import PT from 'prop-types';
import React from 'react';
import { Link } from 'topcoder-react-utils';
import './style.scss';

export default function Item({
  currentSubMenuTitle,
  enforceA,
  icon,
  link,
  title,
  closeMenu,
}) {
  let styleName = 'item';
  if (currentSubMenuTitle === title) styleName += ' current';
  return (
    /* TODO: Should be done in a clean way, witout disabling eslint rules. */
    /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
    <li styleName={styleName} onClick={closeMenu} role="button" tabIndex={0}>
      <Link enforceA={enforceA} to={link}>
        {icon}
        {title}
      </Link>
    </li>
    /* eslint-enable jsx-a11y/no-noninteractive-element-to-interactive-role */
  );
}

Item.defaultProps = {
  enforceA: false,
};

Item.propTypes = {
  enforceA: PT.bool,
  currentSubMenuTitle: PT.string.isRequired,
  icon: PT.node.isRequired,
  link: PT.string.isRequired,
  title: PT.string.isRequired,
  closeMenu: PT.func.isRequired,
};
