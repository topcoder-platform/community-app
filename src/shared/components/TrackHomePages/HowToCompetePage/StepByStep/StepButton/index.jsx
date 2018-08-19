/*
 Step Button Component
 */

import React from 'react';
import PT from 'prop-types';

import './styles.scss';

const StepButton = ({ menu, active, onClick }) => (
  <a
    styleName={active ? 'menu-item active' : 'menu-item'}
    key={menu.title}
    href={`#${menu.title}`}
    onClick={onClick}
  >
    <div styleName="icon-wrapper">
      <img src={menu.icon.fields.file.url} styleName="icon" alt={menu.title} />
    </div>
    <div styleName="menu-title">
      { menu.title}
    </div>
  </a>
);


StepButton.propTypes = {
  menu: PT.shape().isRequired,
  active: PT.bool.isRequired,
  onClick: PT.func.isRequired,
};

export default StepButton;
