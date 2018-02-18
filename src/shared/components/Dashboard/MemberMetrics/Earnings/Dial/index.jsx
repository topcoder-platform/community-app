/**
 * The Dial component shows a single competition track statistic.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import Coin from '../Coin';

import './style.scss';

export default function Dial({
  amount,
  title,
  url,
}) {
  return (
    <a href={url} styleName="container">
      <p styleName="title">{_.startCase(title)}</p>
      <p
        styleName="content"
      ><Coin />{Math.round(amount).toLocaleString()}</p>
    </a>
  );
}

Dial.propTypes = {
  amount: PT.number.isRequired,
  title: PT.string.isRequired,
  url: PT.string.isRequired,
};
