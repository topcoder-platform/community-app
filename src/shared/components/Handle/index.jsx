import React from 'react';
import PT from 'prop-types';

import { getRatingColor } from 'utils/tc';
import './styles.scss';

const Handle = (props) => {
  const { handle, rating, size } = props;
  const color = getRatingColor(rating);
  return (
    <a href="" styleName="handle" style={{ color, fontSize: `${size}px` }}>
      {handle}
    </a>
  );
};

Handle.propTypes = {
  handle: PT.string,
  rating: PT.number,
  size: PT.number,
};

Handle.defaultProps = {
  handle: '',
  rating: 0,
  size: 24,
};

export default Handle;
