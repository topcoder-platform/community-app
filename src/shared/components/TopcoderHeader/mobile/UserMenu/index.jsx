import Avatar from 'components/Avatar';
import _ from 'lodash';
import React from 'react';
import { getRatingColor } from 'utils/tc';
import SubMenu from '../SubMenu';
import './style.scss';

export default function UserMenu({menu, profile}) {
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
