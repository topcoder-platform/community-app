/**
 * render a side bar tab Item
 */
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';

import './styles.scss';

export default function SideItem(props) {
  const {
    icon,
    currentTab,
    name,
    toggle,
  } = props;

  const fileExtension = icon.substring(icon.length - 3, icon.length);

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
      styleName={currentTab === name ? 'active-tab' : 'tab'}
    >
      { fileExtension === 'svg' ? <div styleName="svg-icon"><ReactSVG path={icon} svgStyle={{ width: 30, height: 30 }} /></div> : <img src={icon} alt="" />}
      <div styleName="menu-item">{ name }</div>
    </a>
  );
}

SideItem.propTypes = {
  currentTab: PT.string.isRequired,
  name: PT.string.isRequired,
  icon: PT.string.isRequired,
  toggle: PT.func.isRequired,
};
