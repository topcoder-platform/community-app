/**
 * User Avatar Tooltip Component.
 *
 * USAGE:
 * Wrap with <UserAvatarTooltip></UserAvatarTooltip> tags the element(s) which
 * should show the tooltip when hovered. Pass in the user profile object via
 * the 'user' prop.
 */

import config from 'utils/config';
import React, { Component } from 'react';
import PT from 'prop-types';
// import moment from 'moment';
import Tooltip from 'components/Tooltip';
import { Avatar } from 'topcoder-react-ui-kit';
import styles from './style.scss';

/**
 * Renders the tooltip's content.
 * It includes: user profile picture, handle, his country and the TC registration
 * date. Also includes his ratings for some competition tracks, which are listed in
 * the profile object. It does not currently include the number of victories and the
 * tracks with largest amounts of victories, as the TC API v2 does not provide an
 * efficient way to query those.
 */
function Tip(props) {
  /* const joined = moment(props.user.memberSince).format('MMM YYYY');
  const rating = props.user.ratingSummary.map(item => (
    <span styleName="rating" key={item.name}>
      <span>{item.name}</span>
      <span>{item.rating}</span>
    </span>
  )); */
  const { photoLink } = props.user;
  let src = photoLink;
  if (src && !src.startsWith('http')) {
    src = `${config.URL.BASE}/${src}`;
  }

  return (
    <div styleName="user-avatar-tooltip">
      <Avatar
        theme={{
          avatar: styles.avatar,
        }}
        url={src}
      />
      <div styleName="handle">{props.user.handle}</div>
      {/* Below block is commented out as it's not possible to get this information
      // as of now.
      <div styleName="info">
        <span styleName="country">{props.user.country}</span>
        <span styleName="wins">&nbsp;<span styleName="separtor">/</span> 257 wins&nbsp;</span>
        <span styleName="joined"><span styleName="separtor">/</span> Joined {joined}</span>
      </div>
      <div styleName="achievements">
        <h3>Ratings</h3>
        {rating}
      </div> */}
    </div>
  );
}

Tip.propTypes = {
  user: PT.shape({
    country: PT.string,
    handle: PT.string,
    memberSince: PT.string,
    photoLink: PT.string,
    ratingSummary: PT.array,
  }).isRequired,
};

/**
 * Renders the tooltip.
 */
class UserAvatarTooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
    };
  }

  render() {
    const tip = <Tip user={this.state.user} />;
    return (
      <Tooltip content={tip}>
        <div>{this.props.children}</div>
      </Tooltip>
    );
  }
}

UserAvatarTooltip.defaultProps = {
  user: {
    country: '',
    handle: '',
    memberSince: '',
    photoLink: '',
    ratingSummary: [],
  },
};

UserAvatarTooltip.propTypes = {
  children: PT.node.isRequired,
  user: PT.shape({
    country: PT.string,
    handle: PT.string,
    memberSince: PT.string,
    photoLink: PT.string,
    ratingSummary: PT.array,
  }),
};

export default UserAvatarTooltip;
