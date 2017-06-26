/* eslint jsx-a11y/no-static-element-interactions:0 */

import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';

import './ChallengeFilter.scss';

const ChallengeFilter = (props) => {
  const { groups, selectedGroupId, selectGroup } = props;
  return (
    <div styleName="container">
      {
        groups.map(group => (
          <div
            key={group.id}
            onClick={() => selectGroup(group.id)}
            styleName={cn(['row', { selected: group.id === selectedGroupId }])}
          >
            <span>{group.name}</span>
            <span>{group.number}</span>
          </div>
        ))
      }
    </div>
  );
};

ChallengeFilter.propTypes = {
  groups: PT.arrayOf(PT.shape()),
  selectedGroupId: PT.string,
  selectGroup: PT.func.isRequired,
};

ChallengeFilter.defaultProps = {
  groups: [],
  selectedGroupId: '',
};

export default ChallengeFilter;
