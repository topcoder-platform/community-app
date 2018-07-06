/**
 * render a side bar tab Item
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

  /*
   * Simple rendering function used to add the props (width & height)
   * only once instead of having to add them on each element
   */
  const renderSvgIcon = (svgIcon) => {
    const componentProps = {
      width: '34px',
      height: '30px',
    };
    return (
      <div styleName="svg-container">
        { React.cloneElement(svgIcon, componentProps) }
      </div>
    );
  };

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
      styleName={`SideItem ${currentTab === name ? 'active-tab' : ''}`}
    >
      {
        // `icon` can either be an img src (a string) or a React element
        // it's a React element when the image is an SVG
        // (see `components/examples/SvgLoading` for an example)
        typeof icon === 'string' ? <img src={icon} alt="tab icon" /> : renderSvgIcon(icon)
      }
      <span styleName="name">
        { name }
      </span>
    </a>
  );
}

SideItem.propTypes = {
  currentTab: PT.string.isRequired,
  name: PT.string.isRequired,
  icon: PT.oneOfType([
    PT.string, // for img icons
    PT.element, // for svg icons
  ]).isRequired,
  toggle: PT.func.isRequired,
};
