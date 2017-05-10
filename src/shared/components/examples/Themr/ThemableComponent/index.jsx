/**
 * A sample themable component: a div with text. Default styling:
 * it has palegreen background, the text is black, Arial, 12pt, normal weight.
 */

import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-themr';
import style from './style.scss';

@themr('ThemableComponent', style)
class ThemableComponent extends React.Component {

  componentWillMount() {
  }

  render() {
    const { theme } = this.props;
    return (
      <div className={theme.box}>
        <span className={theme.text}>
          Themable Component
        </span>
      </div>
    );
  }
}

export default ThemableComponent;

ThemableComponent.propTypes = {
  theme: PT.shape({}).isRequired,
};
