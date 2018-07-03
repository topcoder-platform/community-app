/**
 * Child component of Settings/Header renders summary of number of active challenges.
 * Also renders special badges based on achievements data.
*/
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import TabBar from '../TabBar';
import Badge, { MAP, XL_MAP } from '../../Dashboard/Header/Badge';

import './styles.scss';

export default function Header(props) {
  const {
    profileState,
    showXlBadge,
    xlBadge,
    activeChallengesCount,
    settingsTab
  } = props;
  const achievements = profileState.achievements || [];
  const badges = achievements.filter(x => MAP[x.description]);
  const hasBadges = badges && badges.length;
  const selectTab = (tab) => {
    console.log("Settings tab", tab);
    var sTab;
    switch (tab){
      case 'profile':{
        sTab= 'basicinfo';
        break;
      }
      case 'tools':{
        sTab= 'devices';
        break;
      }
      case 'preferences':{
        sTab= 'email';
        break;
      }
    }
    const tab1= tab+ "/"+sTab;
    console.log("tab1", tab1);
    const tab2= tab1.split("/")[0];
    const tab3= tab1.split("/")[1];
    console.log("tab2", tab2);
    console.log("tab3", tab3);
    
    props.selectTab(tab1);
    
    props.history.push(`/settings/${tab}`);
  };
  return (
    <div styleName="page-state-header">
      <header>
        <div styleName="page-info">
          <h1>Settings</h1>
        </div>
        <TabBar
          settingsTab= {settingsTab}
          selectTab= {selectTab}
        />
        {/* <div styleName="info">
          <div styleName="badgeItem">
            {
              _.map(badges, ({ description }) => (
                <Badge
                  badge={MAP[description]}
                  key={description}
                  showXl={show => showXlBadge(show && description)}
                  title={description}
                  xlBadge={xlBadge === description && XL_MAP[xlBadge]}
                />
              ))
            }
          </div>
          <div styleName="separator" className={hasBadges ? '' : 'hidden'} />
          <div styleName="item">
            <div styleName="value">
              <p>{_.isNumber(activeChallengesCount) && activeChallengesCount >= 0 ? activeChallengesCount : ''}</p>
            </div>
            <div styleName="title">
              <p>Active Challenges</p>
            </div>
          </div>
        </div> */}
      </header>
    </div>
  );
}

Header.defaultProps = {
  xlBadge: null,
  activeChallengesCount: -1,
};

Header.propTypes = {
  profileState: PT.shape().isRequired,
  showXlBadge: PT.func.isRequired,
  xlBadge: PT.string,
  activeChallengesCount: PT.number,
};

