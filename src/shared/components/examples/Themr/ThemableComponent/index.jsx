/**
 * A sample themable component: a div with text. Default styling:
 * it has palegreen background, the text is black, Arial, 12pt, normal weight.
 */

import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-themr';
import style from './style.scss';

function ThemableComponent({ theme }) {
  return (
    <div className={theme.box}>
      <span className={theme.text}>
        Themable Component
      </span>
    </div>
  );
}

export default themr('ThemableComponent', style)(ThemableComponent);

ThemableComponent.propTypes = {
  theme: PT.shape({}).isRequired,
};
