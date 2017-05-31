// TODO: All uses of this component MUST be replaced by Avatar component!

import React, { Component } from 'react';
import PT from 'prop-types';
import './LeaderboardAvatar.scss';

// Constants
const VISIBLE_CHARACTERS = 3;
const MOCK_PHOTO = 'https://acrobatusers.com/assets/images/template/author_generic.jpg';

class LeaderboardAvatar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      member: props.member,
    };
    this.handleError = this.handleError.bind(this);
  }

  handleError() {
    const { member } = this.state;
    member.photoURL = MOCK_PHOTO;
    this.setState({ member });
  }

  render() {
    const { domain, url } = this.props;
    const { member } = this.state;
    const targetURL = url || `//${domain}/members/${member.handle}`;
    return (
      <a href={targetURL} className={`leaderboard-avatar ${member.position || member.isSmr ? 'dark-gray' : 'light-gray'}`}>
        {member.photoURL ?
          <img
            alt="avatar"
            src={member.photoURL}
            className="member-icon"
            onError={this.handleError}
          /> :
          member.handle.slice(0, VISIBLE_CHARACTERS)}
        <span className={member.position ? `placement placement-${member.position}` : 'hidden'}>
          {member.position}
        </span>
      </a>
    );
  }
}

LeaderboardAvatar.propTypes = {
  member: PT.shape({}),
  domain: PT.string,
  url: PT.string,
};

LeaderboardAvatar.defaultProps = {
  member: {},
  domain: process.env.domain,
  url: '',
};

export default LeaderboardAvatar;
