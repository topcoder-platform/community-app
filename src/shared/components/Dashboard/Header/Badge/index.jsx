import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function Badge({
  badge,
  showXl,
  title,
  xlBadge,
}) {
  let xlBadgeNode;
  if (xlBadge) {
    xlBadgeNode = (
      <div
        onMouseMove={(e) => {
          e.stopPropagation();
          showXl();
        }}
        styleName="xlBadgeNode"
      >
        <div
          onMouseMove={(e) => {
            e.stopPropagation();
          }}
          styleName="xlBadgeHider"
        />
        {
          _.isString(xlBadge) ? (
            <img
              alt={title}
              src={xlBadge}
              styleName="xlBadgeImage"
            />
          ) : xlBadge
        }
      </div>
    );
  }
  return (
    <div
      onMouseMove={() => showXl(true)}
      onMouseEnter={() => showXl(true)}
      onMouseLeave={() => showXl()}
      styleName={`badge ${badge}`}
      title={title}
    >{xlBadgeNode}
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
  xlBadge: PT.oneOfType([PT.node, PT.string]),
};
