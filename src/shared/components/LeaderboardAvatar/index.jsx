// TODO: All uses of this component MUST be replaced by Avatar component!

import config from 'utils/config';
import React, { Component } from 'react';
import PT from 'prop-types';
import './style.scss';

// Constants
const VISIBLE_CHARACTERS = 3;
const MOCK_PHOTO = 'https://acrobatusers.com/assets/images/template/author_generic.jpg';

/* TODO: Should be functional component! */
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
    const { openNewTab, url } = this.props;
    const { member } = this.state;
    const targetURL = url || `${config.URL.BASE}/members/${member.handle}`;
    return (
      <a
        href={targetURL}
        styleName={`leaderboard-avatar ${member.position || member.isSmr ? 'dark-gray' : 'light-gray'}`}
        target={openNewTab ? '_blank' : undefined}
      >
        {member.photoURL ?
          <img
            alt="avatar"
            src={member.photoURL}
            onError={this.handleError}
          /> :
          member.handle.slice(0, VISIBLE_CHARACTERS)}
        <span styleName={member.position ? `placement placement-${member.position}` : 'hidden'}>
          {member.position}
        </span>
      </a>
    );
  }
}

LeaderboardAvatar.defaultProps = {
  member: {},
  openNewTab: false,
  url: '',
};

LeaderboardAvatar.propTypes = {
  member: PT.shape({}),
  openNewTab: PT.bool,
  url: PT.string,
};

export default LeaderboardAvatar;
