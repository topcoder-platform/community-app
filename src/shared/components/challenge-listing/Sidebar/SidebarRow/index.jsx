import React from 'react';
import PT from 'prop-types';
import './style.scss';

export default function SidebarRow(props) {
  return (
    <div styleName="sidebar-row">
      {props.children}
    </div>
  );
}

SidebarRow.defaultProps = {
  children: [],
};

SidebarRow.propTypes = {
  children: PT.node,
};
