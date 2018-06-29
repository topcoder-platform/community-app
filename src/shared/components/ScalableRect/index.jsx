/**
 * Creates a dynamically scalable rectangular container with the specified fixed
 * ratio of its sides.
 *
 * Sometimes it is necessary, but not straightforward to implement with HTML and
 * CSS, thus this component: juts tell it what sides ration you need (in the
 * form W:H, like 4:3 or 16:9 via the "ratio" prop, and pass in the children
 * you want to render in this container).
 */

import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function ScalableRect({ children, className, ratio }) {
  const aux = ratio.split(':');
  const paddingBottom = `${(100 * aux[1]) / aux[0]}%`;

  /* NOTE: In case the following code looks strange to you, mind that we want to
   * allow the user to set custom styles on this component. If user passes in a
   * "className" prop (possibly "styleName", but that one is converted to
   * "className" by Babel just before being passed into this component), it
   * should not interfere with the sizing behavior, thus we need an extra <div>
   * level in this component; however, if user does not need a custom styling,
   * we can save one level of HTML code, so we do it. */
  const rect = (
    <div
      style={{ paddingBottom }}
      styleName="container"
    >
      <div styleName="wrapper">
        {children}
      </div>
    </div>
  );
  return className ? (
    <div className={className}>
      {rect}
    </div>
  ) : rect;
}

ScalableRect.defaultProps = {
  className: null,
  ratio: '1:1',
};

ScalableRect.propTypes = {
  children: PT.node.isRequired,
  className: PT.string,
  ratio: PT.string,
};
