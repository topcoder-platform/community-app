import React from 'react'
import PT from 'prop-types'
import './SidebarRow.scss'

const SidebarRow = (props) => (
  <div styleName="sidebar-row">
    {props.children}
  </div>
)

SidebarRow.defaultProps = {
  children: [],
}

SidebarRow.propTypes = {
  children: PT.node,
}

export default SidebarRow
