/**
 * SideBar component, render a sidebar
 * can be used by Profile, Tools, Prefercences components
 * */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PT from 'prop-types';

import SideItem from './SideItem';

import './styles.scss';

export default function SideBar(props) {
  const {
    icons,
    names,
    currentTab,
    toggle,
  } = props;

  return (
    <nav styleName="side-tab">
      <ul>
        {
          names.map(name => (
            <li key={name}>
              <SideItem
                icon={icons[name]}
                name={name}
                currentTab={currentTab}
                toggle={toggle}
              />
            </li>
          ))
        }
      </ul>
    </nav>
  );
}

SideBar.propTypes = {
  icons: PT.shape().isRequired,
  names: PT.array.isRequired,
  currentTab: PT.string.isRequired,
  toggle: PT.func.isRequired,
};
