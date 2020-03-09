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
    const { changeTab } = this.props;
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
              }
            }
            onKeyPress={
              () => {
                this.setState({ tab: TABS.ACTIVE });
                changeTab(TABS.ACTIVE);
              }
            }
          >ACTIVE CHALLENGES
          </div>
          <div
            className={cn([styles.btn, tab === TABS.BROADCAST && styles.active])}
            role="tab"
            tabIndex="0"
            onClick={
              () => {
                this.setState({ tab: TABS.BROADCAST });
                changeTab(TABS.BROADCAST);
              }
            }
            onKeyPress={
              () => {
                this.setState({ tab: TABS.BROADCAST });
                changeTab(TABS.BROADCAST);
              }
            }
          >NOTIFICATIONS
          </div>
          <div
            className={cn([styles.btn, tab === TABS.COMPLETED && styles.active])}
            role="tab"
            tabIndex="0"
            onClick={
              () => {
                this.setState({ tab: TABS.COMPLETED });
                changeTab(TABS.COMPLETED);
              }
            }
            onKeyPress={
              () => {
                this.setState({ tab: TABS.COMPLETED });
                changeTab(TABS.COMPLETED);
              }
            }
          >COMPLETED CHALLENGES
          </div>
        </div>
        <div className={styles.rights}>
          <div className={styles['notification-setting']}>Notification Settings</div>
        </div>
      </div>
    );
  }
}


TabsPanel.propTypes = {
  changeTab: PropTypes.func.isRequired,
};
