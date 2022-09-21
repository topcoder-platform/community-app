import React from 'react';
import PT from 'prop-types';
import UserAvatar from '../../User/UserAvatar';
import UsernameAndDetails from '../../User/UsernameAndDetails';
import UserStats from '../../User/UserStats';

import './styles.scss';

const MemberSearchItem = ({ index, item }) => (
  <div styleName={`member-search-item ${index % 2 ? 'odd' : ''}`} key={index}>
    <div styleName="left-content">
      <UserAvatar
        photoURL={item.photoURL}
        handle={item.handle}
      />
      <UsernameAndDetails
        username={item.handle}
        country={item.competitionCountryCode}
        numWins={item.wins}
        memberSince={item.createdAt}
      />
    </div>

    <div styleName="right-content">
      <UserStats tracks={item.tracks} skills={item.skills} />
    </div>

  </div>
);

MemberSearchItem.defaultProps = {
  index: 0,
  item: {},
};

MemberSearchItem.propTypes = {
  index: PT.number,
  item: PT.shape(),
};

export default MemberSearchItem;
