/**
 * Child component of Settings
 * Preferences renders setting page for user preferences.
 */
import React from 'react';

import Email from './Email';
import Personalization from './Personalization';
import SideBar from './SideBar';

import './styles.scss';

const tabs = {
  EMAIL: 'e-mail',
  FORUM: 'forum',
  PAYMENT: 'payment',
  LETTER: 'invitation letter',
  REFERRALS: 'referrals',
  PERSONALIZATION: 'personalization',
};

export default class Preferences extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTab = this.toggleTab.bind(this);

    this.state = {
      currentTab: 'e-mail',
    };
  }

  toggleTab(tab) {
    this.setState({ currentTab: tab });
  }

  render() {
    const {
      currentTab,
    } = this.state;

    const renderTabContent = (tab) => {
      switch (tab) {
        case 'e-mail':
          return <Email {...this.props} />;
        case 'personalization':
          return <Personalization {...this.props} />;
        default:
          return null;
      }
    };

    return (
      <div styleName="preferences-container">
        <div styleName="col-bar">
          <SideBar
            tabs={tabs}
            currentTab={currentTab}
            toggle={this.toggleTab}
          />
        </div>
        <div styleName="col-content">
          { renderTabContent(currentTab) }
        </div>
      </div>
    );
  }
}
