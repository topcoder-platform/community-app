// TODO: All uses of this component MUST be replaced by Avatar component!

import { Avatar } from 'topcoder-react-ui-kit';
import React, { Component } from 'react';
import PT from 'prop-types';
import { config, Link } from 'topcoder-react-utils';
import _ from 'lodash';
import './style.scss';

/* TODO: Should be functional component! */
class LeaderboardAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: props.member,
    };
  }

  render() {
    const {
      onClick, plusOne, url,
    } = this.props;
    const { member } = this.state;
    const targetURL = url || `${window.origin}/members/${member.handle}`;
    let { photoURL } = member;
    if (photoURL) {
      /* Note: 50px is larger than we really need here (the avatar size is
       * 30px), but it matches the target avatar size in the tooltip, shown
       * by the challenge listing when an avatar is hovered. Having the same
       * size will ensure that the avatar in tooltip always appears immediately.
       */
      photoURL = `${config.CDN.PUBLIC}/avatar/${
        encodeURIComponent(photoURL)}?size=50`;
    }
    return (
      <Link
        enforceA
        onClick={onClick}
        to={targetURL}
        openNewTab={!_.includes(window.origin, 'www')}
        styleName={`leaderboard-avatar ${member.position || member.isSmr ? '' : 'light-gray'}`}
      >
        { plusOne ? member.handle : <Avatar url={photoURL} />}
        <span styleName={member.position ? `placement placement-${member.position}` : 'hidden'}>
          {member.position}
        </span>
      </Link>
    );
  }
}

LeaderboardAvatar.defaultProps = {
  member: {},
  onClick: null,
  plusOne: false,
  url: '',
};

LeaderboardAvatar.propTypes = {
  member: PT.shape({}),
  onClick: PT.func,
  plusOne: PT.bool,
  url: PT.string,
};

export default LeaderboardAvatar;
