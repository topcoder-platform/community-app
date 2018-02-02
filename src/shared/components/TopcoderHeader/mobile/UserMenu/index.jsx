import _ from 'lodash';
import { Avatar } from 'topcoder-react-ui-kit';
import PT from 'prop-types';
import React from 'react';
import { getRatingColor } from 'utils/tc';
import SubMenu, { SUB_MENU_SHAPE } from '../SubMenu';
import './style.scss';

export default function UserMenu({ menu, profile }) {
  return (
    <div>
      <div styleName="title">
        <a href={`/members/${profile.handle}`}>
          <Avatar url={profile.photoURL} />
          <span
            style={{
              color: getRatingColor(_.get(profile, 'maxRating.rating', 0)),
            }}
            styleName="handle"
          >{profile.handle}</span>
        </a>
      </div>
      <SubMenu hideTitle subMenu={menu} />
    </div>
  );
}

UserMenu.defaultProps = {
  menu: null,
  profile: null,
};

UserMenu.propTypes = {
  menu: SUB_MENU_SHAPE,
  profile: PT.shape({}),
};
