import _ from 'lodash';
import Carousel from 'components/Carousel';
import config from 'utils/config';
import PT from 'prop-types';
import React from 'react';

import { Link } from 'topcoder-react-utils';

import Dial from './Dial';
import LArrow from '../../../../../assets/images/arrow-prev.svg';
import RArrow from '../../../../../assets/images/arrow-next.svg';

import './style.scss';

const PACTS_FULL_URL = `${config.URL.COMMUNITY}/PactsMemberServlet?module=PaymentHistory&full_list=true`;
const PACTS_OWED_URL = `${config.URL.COMMUNITY}/PactsMemberServlet?module=PaymentHistory&full_list=false`;

export default function Earnings({ finances, showEarnings }) {
  if (!showEarnings) return null;

  const map = {};
  finances.forEach((x) => { map[x.status] = x; });

  const owed = _.get(map.OWED, 'amount', 0);
  const paid = _.get(map.PAID, 'amount', 0);
  const total = owed + paid;

  if (!total) {
    return (
      <div styleName="container">
        <Link
          styleName="link"
          to="/challenges"
        >Start competing today</Link>&zwnj;
        to gain experience and win prize money!
      </div>
    );
  }

  if (owed && paid) {
    return (
      <div styleName="container">
        <Carousel
          NextButton={RArrow}
          PrevButton={LArrow}
          slideWidth="300px"
        >
          <Dial
            amount={paid}
            show={showEarnings}
            title="Paid"
            url={PACTS_FULL_URL}
          />
          <Dial
            amount={owed}
            show={showEarnings}
            title="Owed"
            url={PACTS_OWED_URL}
          />
          <Dial
            amount={total}
            show={showEarnings}
            title="Total"
            url={PACTS_FULL_URL}
          />
        </Carousel>
      </div>
    );
  }

  return (
    <div styleName="container">
      <Dial
        amount={total}
        show={showEarnings}
        title="Total Earnings"
        url={PACTS_FULL_URL}
      />
    </div>
  );
}

Earnings.propTypes = {
  finances: PT.arrayOf(PT.shape({
    amount: PT.number.isRequired,
    status: PT.string.isRequired,
  })).isRequired,
  showEarnings: PT.bool.isRequired,
};
