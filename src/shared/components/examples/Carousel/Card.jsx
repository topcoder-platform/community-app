import PT from 'prop-types';
import React from 'react';

export default function Card({
  color,
  height,
  text,
  width,
}) {
  return (
    <div
      style={{
        backgroundColor: color,
        height,
        width,
      }}
    >
      {text}
    </div>
  );
}

Card.defaultProps = {
  color: 'white',
  height: 90,
  text: 'Card',
  width: 120,
};

Card.propTypes = {
  color: PT.string,
  height: PT.number,
  text: PT.string,
  width: PT.number,
};
