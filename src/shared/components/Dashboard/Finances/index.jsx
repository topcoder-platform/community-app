import config from 'utils/config';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';

import { Link } from 'topcoder-react-utils';

import Coin from './Coin';
import Dial from './Dial';

import './style.scss';

const PACTS_FULL_URL = `${config.URL.COMMUNITY}/PactsMemberServlet?module=PaymentHistory&full_list=true`;
const PACTS_OWED_URL = `${config.URL.COMMUNITY}/PactsMemberServlet?module=PaymentHistory&full_list=false`;

export default function Finances({
  finances,
  loading,
}) {
  const map = {};
  finances.forEach((x) => { map[x.status] = x; });

  let total = 0.0;
  if (map.OWED) total += map.OWED.amount || 0;
  if (map.PAID) total += map.PAID.amount || 0;

  console.log(loading);
  let content;
  if (loading) {
    content = (
      <div styleName="loading">
        <LoadingIndicator />
      </div>
    );
  } else if (!total) {
    content = (
      <p styleName="textMessage">
        <Link
          styleName="link"
          to="/challenges"
        >Start competing today</Link>&zwnj;
        to gain experience and win prize money!
      </p>
    );
  } else if (map.OWED && map.PAID) {
    content = (
      <div styleName="innerContainer">
        <Dial
          amount={map.PAID.amount}
          title="Paid"
          url={PACTS_FULL_URL}
        />
        <Dial
          amount={map.OWED.amount}
          title="Owed"
          url={PACTS_OWED_URL}
        />
        <Dial
          amount={total}
          title="Total"
          url={PACTS_FULL_URL}
        />
      </div>
    );
  } else {
    content = (
      <a href={PACTS_FULL_URL} styleName="totalNumber">
        <Coin />{Math.round(total).toLocaleString()}
      </a>
    );
  }

  return (
    <div styleName="container">
      <h1 styleName="title">Your Earnings</h1>
      {content}
    </div>
  );
}

Finances.propTypes = {
  finances: PT.arrayOf(PT.shape({
    amount: PT.number.isRequired,
    status: PT.string.isRequired,
  })).isRequired,
  loading: PT.bool.isRequired,
};
