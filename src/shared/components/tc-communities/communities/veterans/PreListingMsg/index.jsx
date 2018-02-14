import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import React from 'react';

import style from './style.scss';

export default function PreListingMsg() {
  return (
    <div styleName="container">
      <JoinCommunity
        label="Join Now"
        joinCommunityWrapper={style.joinCommunityWrapper}
        theme={{
          container: style.joinContainer,
          link: { button: style.join },
        }}
      />&zwnj;
      to access challenges that are exclusively available for US veterans.
    </div>
  );
}
