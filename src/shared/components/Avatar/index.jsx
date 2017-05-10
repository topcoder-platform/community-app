/**
 * Avatar
 *
 * Description:
 *   Reusable user avatar. Depending on wether or not an image URL is
 *   provided, it will display the user's profile picture, or a default
 *   user avatar.
 *
 * Styling:
 *   Styling is applied by default (see defaultStyles object).
 *   However, the Avatar can be styled in any possible way by providing
 *   a custom style object via props.
 *   Styling implemented with react-with-styles
 *   (https://github.com/airbnb/react-with-styles)
 *
 * Usage:
 *   <Avatar url={imgUrl} customStyles="{customStylesObj}" />
 *
 * Props:
 *    - url: String, optional. Image URL.
 *    - customStyles: Object or Array of Objects, optional
 *      See https://github.com/airbnb/react-with-styles for details.
 */

import PT from 'prop-types';
import React from 'react';
import { css, withStyles } from 'utils/withStyles';
import DefaultAvatar from '../../../assets/images/ico-user-default.svg';

function Avatar(props) {
  const {
    customStyles,
    url,
  } = props;

  const defaultStyles = {
    height: '32px',
    width: '32px',
    borderRadius: '16px',
  };

  const setStyles = (styles) => {
    if (styles) {
      return styles;
    }

    return defaultStyles;
  };

  return url
    ? <img alt="Avatar" src={url} {...css(setStyles(customStyles))} />
    : <DefaultAvatar {...css(setStyles(customStyles))} />;
}

Avatar.defaultProps = {
  customStyles: null,
  url: null,
};

Avatar.propTypes = {
  customStyles: PT.oneOfType([PT.object, PT.array]),
  url: PT.string,
};

export default withStyles(() => ({}))(Avatar);
