/**
 * render a side bar tab item
 */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

export default function SideItem(props) {
  const {
    icon,
    currentTab,
    name,
    toggle,
  } = props;

  const clickTab = (e, tab) => {
    e.preventDefault();
    setImmediate(() => {
      toggle(tab);
    });
  };

  return (
    <a
      role="link"
      tabIndex={0}
      onKeyPress={e => clickTab(e, name)}
      onClick={e => clickTab(e, name)}
      styleName={currentTab === name ? 'active-tab' : ''}
    ><img src={icon} alt="" />{ name }
    </a>
  );
}

SideItem.propTypes = {
  currentTab: PT.string.isRequired,
  name: PT.string.isRequired,
  icon: PT.string.isRequired,
  toggle: PT.func.isRequired,
};
