import PT from 'prop-types';
import React from 'react';

import { TABS } from 'actions/page/dashboard';

import Option from './Option';

import './style.scss';

export default function Header({
  numChallenges,
  numCommunities,
  switchTab,
  tab,
}) {
  let myChallengesTitle = 'My Active Challenges';
  if (numChallenges) myChallengesTitle += ` (${numChallenges})`;

  let myCommunitiesTitle = 'My Communities';
  if (numCommunities) myCommunitiesTitle += ` (${numCommunities})`;

  return (
    <div styleName="container">
      <Option
        selected={tab === TABS.MY_ACTIVE_CHALLENGES}
        select={() => switchTab(TABS.MY_ACTIVE_CHALLENGES)}
        title={myChallengesTitle}
      />
      <Option
        selected={tab === TABS.COMMUNITIES}
        select={() => switchTab(TABS.COMMUNITIES)}
        title={myCommunitiesTitle}
      />
      <Option
        selected={tab === TABS.SRMS}
        select={() => switchTab(TABS.SRMS)}
        title="SRMs"
      />
    </div>
  );
}

Header.propTypes = {
  numChallenges: PT.number.isRequired,
  numCommunities: PT.number.isRequired,
  switchTab: PT.func.isRequired,
  tab: PT.string.isRequired,
};
