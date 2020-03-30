import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { singlePluralFormatter } from '../../helpers';
import ISOCountries from '../../helpers/ISOCountries';

import './style.scss';

const UsernameAndDetails = ({
  username,
  country,
  numWins,
  memberSince,
}) => {
  const countryObject = _.find(ISOCountries, { alpha3: country });
  const userCountry = countryObject ? countryObject.name : '';

  const numberWins = singlePluralFormatter(numWins, 'win');

  const memberSinceMMMYYYY = moment(memberSince).format('MMM YYYY');

  return (
    <div styleName="username-and-details">
      <h1 styleName="username">
        {username}
      </h1>

      <div styleName="user-details">
        <div styleName="country-and-wins">
          <span styleName="user-country">{userCountry}</span>

          <span>{numberWins && ` / ${numberWins}`}</span>
        </div>

        <div styleName="member-since">
          Member since {memberSinceMMMYYYY}
        </div>
      </div>
    </div>
  );
};

UsernameAndDetails.propTypes = {
  username: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  numWins: PropTypes.number.isRequired,
  memberSince: PropTypes.number.isRequired,
};

export default UsernameAndDetails;
