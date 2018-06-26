/**
 * Sidebar item for the preference page sidebar.
 * It opens a new browser tab with the URL passed as prop.
 */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

export default function SideItem(props) {
  const {
    icon,
    name,
    url,
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

  return (
    <a
      styleName="SideItem"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={0}
    >
      {
        // `icon` can either be an img src (a string) or a React element
        // it's a React element when the image is an SVG
        // (see `components/examples/SvgLoading` for an example)
        typeof icon === 'string' ? <img src={icon} alt="tab icon" /> : renderSvgIcon(icon)
      }
      { name }
    </a>
  );
}

SideItem.propTypes = {
  name: PT.string.isRequired,
  icon: PT.oneOfType([
    PT.string, // for img icons
    PT.element, // for svg icons
  ]).isRequired,
  url: PT.string.isRequired,
};
