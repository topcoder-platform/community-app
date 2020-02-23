import React from 'react';
import PropTypes from 'prop-types';
import MemberItem from '../MemberItem';

import './style.scss';

const MemberList = (({ members }) => (
  <div styleName="member-list">
    {
      members.map(member => <MemberItem key={member} member={member} />)
    }
  </div>
));

MemberList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MemberList;
