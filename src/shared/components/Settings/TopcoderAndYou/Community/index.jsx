/* eslint-disable jsx-a11y/label-has-for */
/**
 * Communities
 * Topcoder And You Settings Page
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import Item from './Item';
import data from './data';

import './styles.scss';

const Community = (props) => {
  const {
    communityItems,
    onCommunityChange,
  } = props;

  return (
    <div styleName="community-container">
      <div styleName="community-list">
        {
          _.map(data, (item) => {
            const checked = communityItems[item.id] || false;
            return (
              <Item
                icon={item.icon}
                key={item.id}
                id={item.id}
                value={item.id}
                checked={checked}
                title={item.name}
                programID={item.programID}
                description={item.description}
                link={item.link}
                onToggle={event => onCommunityChange(event, item, event.target.checked)}
              />
            );
          })
        }
      </div>
    </div>
  );
};

Community.defaultProps = {
  communityItems: [],
};

Community.propTypes = {
  communityItems: PT.arrayOf(PT.shape()),
  onCommunityChange: PT.func.isRequired,
};

export default Community;
