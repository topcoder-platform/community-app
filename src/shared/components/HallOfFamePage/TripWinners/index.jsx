/**
 * Trip Winners Component.  Renders the eligible roles for trips in the event with
 * lists of the winners.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ContentfulLoader from 'containers/ContentfulLoader';
import Role from './Role';

import allRoles from './allRoles.scss';
import styles from './styles.scss';

const TripWinners = ({ roles }) => {
  const winnerData = roles;
  const members = _.map(winnerData.data, item => (item.fields.members));
  let maxWinners = 0;
  let memberIds = [];
  for (let i = 0; i !== members.length; i += 1) {
    memberIds = memberIds.concat(_.map(members[i], item => (item.sys.id)));
    if (members[i].length > maxWinners) {
      maxWinners = members[i].length;
    }
  }
  return (
    <ContentfulLoader
      entryIds={memberIds}
      render={(result) => {
        for (let i = 0; i !== members.length; i += 1) {
          for (let j = 0; j !== members[i].length; j += 1) {
            winnerData.data[i].fields.members[j].fields =
              result.entries.items[members[i][j].sys.id].fields;
          }
        }
        return (
          <div className={styles.container}>
            {
              winnerData.data.map(roleData => (
                <Role
                  key={roleData.fields.title}
                  data={roleData.fields}
                  count={maxWinners}
                  theme={allRoles}
                />
              ))
            }
          </div>
        );
      }}
    />
  );
};

TripWinners.propTypes = {
  roles: PT.shape().isRequired,
};

export default TripWinners;
