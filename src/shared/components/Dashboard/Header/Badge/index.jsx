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
    if (_.isString(xlBadge)) {
      xlBadgeNode = (
        <img
          alt={title}
          onMouseLeave={() => showXl()}
          src={xlBadge}
          styleName="xlBadge"
        />
      );
    } else {
      xlBadgeNode = (
        <div styleName="xlBadgeNode">
          {xlBadge}
        </div>
      );
    }
  }
  return (
    <div
      onMouseEnter={() => showXl(true)}
      onMouseLeave={() => showXl()}
      styleName={`badge ${badge}`}
      title={title}
    >{xlBadgeNode}</div>
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
