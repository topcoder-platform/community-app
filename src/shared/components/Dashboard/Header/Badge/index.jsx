import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function Badge({
  badge,
  showXl,
  title,
  xlBadge,
}) {
  return (
    <div
      onMouseEnter={() => showXl(true)}
      onMouseLeave={() => showXl()}
      styleName={`badge ${badge}`}
      title={title}
    >
      {
        xlBadge ? (
          <img
            alt={title}
            onMouseLeave={() => showXl()}
            src={xlBadge}
            styleName="xlBadge"
          />
        ) : null
      }
    </div>
  );
}

Badge.defaultProps = {
  xlBadge: '',
};

Badge.propTypes = {
  badge: PT.string.isRequired,
  showXl: PT.bool.isRequired,
  title: PT.string.isRequired,
  xlBadge: PT.string,
};
