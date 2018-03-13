/**
 * Trip Winners Component.  Renders the eligible roles for trips in the event with
 * lists of the winners.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import Role from './Role';

import allRoles from './allRoles.scss';
import styles from './styles.scss';

const TripWinners = ({ roles }) => {
  const maxWinners = _.max(roles.map(role => role.winners.length));

  return (
    <div className={styles.container}>
      {
        roles.map(roleData => (
          <Role key={roleData.role} data={roleData} count={maxWinners} theme={allRoles} />
        ))
      }
    </div>
  );
};

TripWinners.propTypes = {
  roles: PT.arrayOf(PT.shape()).isRequired,
};

export default TripWinners;
