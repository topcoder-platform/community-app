import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './style.scss';


const TABS = {
  COMPLETED: 'completed',
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
    const { showActive, showCompleted } = this.props;
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
                showActive();
              }
            }
            onKeyPress={
              () => {
                this.setState({ tab: TABS.ACTIVE });
                showActive();
              }
            }
          >ACTIVE CHALLENGES
          </div>
          <div
            className={cn([styles.btn, tab === TABS.COMPLETED && styles.active])}
            role="tab"
            tabIndex="0"
            onClick={
              () => {
                this.setState({ tab: TABS.COMPLETED });
                showCompleted();
              }
            }
            onKeyPress={
              () => {
                this.setState({ tab: TABS.COMPLETED });
                showCompleted();
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
  showActive: PropTypes.func.isRequired,
  showCompleted: PropTypes.func.isRequired,
};
