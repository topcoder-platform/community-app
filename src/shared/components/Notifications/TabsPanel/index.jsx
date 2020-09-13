import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './style.scss';


const TABS = {
  COMPLETED: 'completed',
  BROADCAST: 'broadcast',
  ACTIVE: 'active',
};

export default class TabsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: TABS.ACTIVE,
    };
  }


  render() {
    const { changeTab, tracking } = this.props;
    const { tab } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.lefts}>
          <div
            className={cn([styles.btn, tab === TABS.ACTIVE && styles.active])}
            role="tab"
            tabIndex="0"
            onClick={
              () => {
                this.setState({ tab: TABS.ACTIVE });
                changeTab(TABS.ACTIVE);
                tracking.event('Click', 'Change Tab', 'Active Challenges');
              }
            }
            onKeyPress={
              () => {
                this.setState({ tab: TABS.ACTIVE });
                changeTab(TABS.ACTIVE);
                tracking.event('Click', 'Change Tab', 'Active Challenges');
              }
            }
          >CHALLENGES
          </div>
          <div
            className={cn([styles.btn, tab === TABS.BROADCAST && styles.active])}
            role="tab"
            tabIndex="0"
            onClick={
              () => {
                this.setState({ tab: TABS.BROADCAST });
                changeTab(TABS.BROADCAST);
                tracking.event('Click', 'Change Tab', 'Notifications');
              }
            }
            onKeyPress={
              () => {
                this.setState({ tab: TABS.BROADCAST });
                changeTab(TABS.BROADCAST);
                tracking.event('Click', 'Change Tab', 'Notifications');
              }
            }
          >NOTIFICATIONS
          </div>
          {/*
            * Disabled until Backend updated (add flag completed in notifications)
            *
          <div
            className={cn([styles.btn, tab === TABS.COMPLETED && styles.active])}
            role="tab"
            tabIndex="0"
            onClick={
              () => {
                this.setState({ tab: TABS.COMPLETED });
                changeTab(TABS.COMPLETED);
                tracking.event('Click', 'Change Tab', 'Completed Challenges');
              }
            }
            onKeyPress={
              () => {
                this.setState({ tab: TABS.COMPLETED });
                changeTab(TABS.COMPLETED);
                tracking.event('Click', 'Change Tab', 'Completed Challenges');
              }
            }
          >COMPLETED CHALLENGES
          </div>
          */}
        </div>
        {/*
          * Disabled until Settings page is ready
          *
        <div className={styles.rights}>
          <div className={styles['notification-setting']}>Notification Settings</div>
        </div>
        */}
      </div>
    );
  }
}


TabsPanel.propTypes = {
  changeTab: PropTypes.func.isRequired,
  tracking: PropTypes.shape().isRequired,
};
