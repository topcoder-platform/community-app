import React from 'react';
import DefaultAvatar from '../../../assets/images/ico-user-default.svg';
import './style.scss';

export default function Avatar({url}) {
  return url
    ? <img alt="Avatar" src={url} styleName="avatar" />
    : <DefaultAvatar styleName="avatar" />;
}
