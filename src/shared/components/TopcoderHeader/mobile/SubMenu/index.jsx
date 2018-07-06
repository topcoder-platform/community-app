import PT from 'prop-types';
import React from 'react';
import './style.scss';

export default function SubMenu({
  hideTitle,
  subMenu,
}) {
  const items = subMenu.items.map(item => (
    <li key={item.title} styleName="item">
      <a href={item.link}>
        {item.title}
      </a>
    </li>
  ));
  const title = hideTitle ? '' : (
    <li styleName="title">
      {subMenu.title}
    </li>
  );
  return (
    <ul styleName="sub-menu">
      {title}
      {items}
    </ul>
  );
}

export const SUB_MENU_SHAPE = PT.shape({
  title: PT.string.isRequired,
  items: PT.arrayOf(PT.shape({
    icon: PT.node.isRequired,
    link: PT.string.isRequired,
    title: PT.string.isRequired,
  })).isRequired,
});

SubMenu.defaultProps = {
  hideTitle: false,
};

SubMenu.propTypes = {
  hideTitle: PT.bool,
  subMenu: SUB_MENU_SHAPE.isRequired,
};
