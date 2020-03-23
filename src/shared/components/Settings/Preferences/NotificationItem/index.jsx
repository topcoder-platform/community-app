import React from 'react';
import PT from 'prop-types';

import TogglerItem from '../TogglerItem';


import './styles.scss';

export default function NotificationItem({
  webChecked,
  emailChecked,
  id,
  primaryText,
  secondaryText,
  value,
  onWebToggle,
  onEmailToggle,
  website,
  email,
}) {
  return (
    <div styleName="NotificationItem">
      <div styleName="body">
        <p styleName="primary">
          {primaryText}
        </p>
        <p styleName="secondary">
          {secondaryText}
        </p>
      </div>
      <div styleName="toggler">
        {
          website ? (
            <TogglerItem
              id={`${id}-web`}
              checked={webChecked}
              onToggle={onWebToggle}
              value={value}
            />
          ) : (
            <div styleName="emptyToggler" />
          )
        }
        {
          email ? (
            <TogglerItem
              id={`${id}-email`}
              checked={emailChecked}
              onToggle={onEmailToggle}
              value={value}
            />
          ) : (
            <div styleName="emptyToggler" />
          )
        }
      </div>
    </div>
  );
}

NotificationItem.propTypes = {
  id: PT.string.isRequired,
  value: PT.string.isRequired,
  webChecked: PT.bool.isRequired,
  emailChecked: PT.bool.isRequired,
  website: PT.bool.isRequired,
  email: PT.bool.isRequired,
  primaryText: PT.string.isRequired,
  secondaryText: PT.string.isRequired,
  onWebToggle: PT.func.isRequired,
  onEmailToggle: PT.func.isRequired,
};
