import React from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';
import { config } from 'topcoder-react-utils';
import UserInfo from './UserInfo';
import UserStats from './UserStats';

import './style.scss';

const MemberItem = ({
  member,
  userPlace,
  withBio,
  shouldAnimate = false,
}) => {
  const memberItemStyles = classNames(
    'member-item',
    { 'with-bio': withBio },
  );

  const memberItem = (
    <a
      styleName={memberItemStyles}
      href={`${config.URL.BASE}/members/${member.handle}`}
    >
      <UserInfo user={member} userPlace={userPlace} withBio={withBio} />

      <UserStats member={member} userPlace={userPlace} />
    </a>
  );

  if (shouldAnimate) {
    return (
      <ReactCSSTransitionGroup
        transitionName="member-item"
        transitionAppear
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {memberItem}
      </ReactCSSTransitionGroup>
    );
  }

  return memberItem;
};

MemberItem.propTypes = {
  member: PropTypes.shape({}).isRequired,
  userPlace: PropTypes.number,
  withBio: PropTypes.bool,
  shouldAnimate: PropTypes.bool,
};

export default MemberItem;
