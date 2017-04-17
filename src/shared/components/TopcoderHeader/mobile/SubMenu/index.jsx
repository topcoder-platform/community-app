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
  const title = hideTitle ? '' : <li styleName="title">{subMenu.title}</li>;
  return (
    <ul styleName="sub-menu">
      {title}
      {items}
    </ul>
  );
}

SubMenu.defaultProps = {
  hideTitle: false,
};

SubMenu.propTypes = {
  hideTitle: PT.bool,
  subMenu: PT.shape({

  }).isRequired,
};
