import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import shortId from 'shortid';
import MemberItem from '../MemberItem';

const TopMemberList = ({ topMembers }) => {
  const sortedTopMembers = _.orderBy(topMembers, 'wins', 'desc');

  const topMemberItems = sortedTopMembers.map((member, i) => (
    <MemberItem key={shortId()} member={member} userPlace={i} />
  ));

  return (
    <div className="top-member-list">
      {topMemberItems}
    </div>
  );
};

TopMemberList.propTypes = {
  topMembers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TopMemberList;
