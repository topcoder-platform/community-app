/**
 * The standard Topcoder desktop header's submenu.
 */

import PT from 'prop-types';
import React from 'react';
import Item from './Item';
import './style.scss';

export default function SubMenu({
  closeMenu,
  currentSubMenuTitle,
  menu,
  trigger,
}) {
  let items;
  if (menu) {
    items = menu.items.map(item => (
      <Item
        currentSubMenuTitle={currentSubMenuTitle}
        key={item.title}
        {...item}
      />
    ));
  }
  return (
    <ul
      onMouseLeave={(event) => {
        /* False when cursor leaves from the sub-menu to the element that has
         * opened it. In that case we want to keep the menu opened, and the
         * element under the mouse will control the menu state further. */
        if ((event.pageX < trigger.left)
          || (event.pageX > trigger.right)
          || (event.pageY > trigger.bottom)
          || (event.pageY < trigger.top)) {
          closeMenu();
        }
      }}
      styleName={menu ? 'opened-menu' : 'closed-menu'}
    >{items}</ul>
  );
}

SubMenu.defaultProps = {
  currentSubMenuTitle: '',
  menu: null,
  trigger: null,
};

SubMenu.propTypes = {
  closeMenu: PT.func.isRequired,
  currentSubMenuTitle: PT.string,
  menu: PT.shape({
    items: PT.arrayOf(PT.shape({
      title: PT.string.isRequired,
    })).isRequired,
  }),
  trigger: PT.shape({
    bottom: PT.number.isRequired,
    left: PT.number.isRequired,
    right: PT.number.isRequired,
    top: PT.number.isRequired,
  }),
};
