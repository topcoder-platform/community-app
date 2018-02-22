import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function Badge({ badge, title }) {
  return (
    <div styleName={`badge ${badge}`} title={title} />
  );
}

Badge.propTypes = {
  badge: PT.string.isRequired,
  title: PT.string.isRequired,
};
