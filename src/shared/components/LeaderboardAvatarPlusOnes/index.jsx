// TODO: All uses of this component MUST be replaced by Avatar component!

import React, { PureComponent } from 'react';
import PT from 'prop-types';
import { Link } from 'utils/router';
import './style.scss';

class LeaderboardAvatarPlusOnes extends PureComponent {
  render() {
    const { onClick, openNewTab, plusCount, url } = this.props;
    return (
      <Link
        enforceA
        onClick={onClick}
        to={url}
        styleName="light-gray"
        target={openNewTab ? '_blank' : undefined}
      >
        {plusCount}
      </Link>
    );
  }
}

LeaderboardAvatarPlusOnes.defaultProps = {
  onClick: null,
  openNewTab: false,
  plusCount: '+1',
  url: '',
};

LeaderboardAvatarPlusOnes.propTypes = {
  onClick: PT.func,
  openNewTab: PT.bool,
  plusCount: PT.string,
  url: PT.string,
};

export default LeaderboardAvatarPlusOnes;
