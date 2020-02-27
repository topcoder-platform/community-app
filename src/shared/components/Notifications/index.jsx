import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import IconArrow from 'assets/images/notifications/arrow.svg';
import styles from './style.scss';
import TabsPanel from './TabsPanel';

const eventTypes = {
  PROJECT: {
    ACTIVE: 'connect.notification.project.active',
    COMPLETED: 'connect.notification.project.completed',
  },
};
const Item = ({ item, markNotificationAsRead, showPoint }) => (
  <div className={styles['noti-item']}>
    <div className={styles.left}>
      <p className={styles.txt}>{item.contents}</p>
      <span className={styles['time-txt']}>{moment(item.date).fromNow()}</span>
    </div>
    <div className={styles.right}>
      {
        !item.isRead
        && showPoint
        && (
          <div
            role="button"
            className={cn([styles.point, item.isSeen && styles['point-grey'], !item.isSeen && styles['point-red']])}
            onClick={() => { markNotificationAsRead(item); }}
            onKeyPress={() => { markNotificationAsRead(item); }}
            tabIndex="0"
          />
        )}
    </div>
  </div>
);
Item.propTypes = {
  item: PropTypes.shape.isRequired,
  markNotificationAsRead: PropTypes.func.isRequired,
  showPoint: PropTypes.bool.isRequired,
};

const challenges = (listReceived) => {
  const list = listReceived || [];
  const challengeTitles = _.uniq(
    list.map(noti => noti.sourceName).filter(x => x),
  );
  const group = challengeTitles.map(title => ({
    challengeTitle: title, items: list.filter(t => t.sourceName === title),
  }));

  return group;
};

export default class NotificationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsedChallenges: {},
      showCompleted: false,
    };
  }

  componentWillUnmount() {
    // mark all notifications as seen when go to another page
    const { markAllNotificationAsSeen } = this.props;
    markAllNotificationAsSeen();
  }

  toggleChallenge = (challengeIdx, collapsedChallenges) => {
    const collapsed = collapsedChallenges || {};
    if (collapsed[challengeIdx]) {
      collapsed[challengeIdx] = false;
    } else {
      collapsed[challengeIdx] = true;
    }
    this.setState({ collapsedChallenges: collapsed });
  }

  render() {
    const {
      notifications, markNotificationAsRead,
      dismissChallengeNotifications,
    } = this.props;
    const { collapsedChallenges, showCompleted } = this.state;
    let challengesList = [];
    if (showCompleted) {
      challengesList = _.filter((notifications || []),
        t => t.eventType === eventTypes.PROJECT.COMPLETED);
    } else {
      challengesList = _.filter((notifications || []),
        t => t.eventType !== eventTypes.PROJECT.COMPLETED);
    }
    return (
      <div className={styles['outer-container']}>
        <h1 className={styles.heading}>Notifications</h1>
        <div className={styles['notifications-panel']}>
          <TabsPanel
            showActive={() => {
              this.setState({ showCompleted: false });
            }}
            showCompleted={() => this.setState({ showCompleted: true })}
          />
          <div className={styles['noti-body']}>
            <Fragment key="nonComplete">
              {
                challenges(challengesList).map((challenge) => {
                  const challegeId = challenge && challenge.items && challenge.items.length
                    && challenge.items[0].sourceId;

                  return (
                    <Fragment key={`challenge-${challegeId}`}>
                      <div key={`noti-${challegeId}`} className={styles['challenge-title']}>
                        <span>{challenge.challengeTitle}</span>
                        <div className={cn([styles['challenge-header-rights'],
                          !showCompleted && styles['hide-challenge-header-rights']])}
                        >
                          <div
                            role="button"
                            tabIndex="0"
                            className={styles['dismiss-challenge']}
                            onClick={() => {
                              if (challegeId) {
                                dismissChallengeNotifications(challegeId);
                              }
                            }}
                            onKeyPress={() => {
                              if (challegeId) {
                                dismissChallengeNotifications(challegeId);
                              }
                            }}
                          >&times;
                          </div>

                          <IconArrow
                            className={cn([styles.arrow,
                              (challegeId && _.has(collapsedChallenges, challegeId)
                              && collapsedChallenges[challegeId]) ? styles.down : styles.up])}
                            onClick={() => {
                              if (challegeId) {
                                this.toggleChallenge(challegeId, collapsedChallenges);
                              }
                            }}
                          />
                        </div>
                      </div>
                      {
                        (!collapsedChallenges[challegeId])
                        && challenge.items.map(item => (
                          <Item
                            item={item}
                            markNotificationAsRead={markNotificationAsRead}
                            key={`noti-item-${item.id}`}
                            showPoint={!showCompleted}
                          />
                        ))}
                    </Fragment>
                  );
                })
              }
            </Fragment>
          </div>
        </div>
      </div>
    );
  }
}

NotificationList.defaultProps = {
  notifications: [],
};

NotificationList.propTypes = {
  /**
   * Array of Notifications, each with properties:
   *
   *   - id {number} message identifier
   *   - sourceId {number} identifies the associated challenge
   *   - sourceName {string} challenge title
   *   - eventType {string} indicates if challenge is active(connect.notification.project.active)
   *       or completed(connect.notification.project.completed)
   *   - date {date} when notification was raised
   *   - isRead {boolean} indicates if is read
   *   - isSeen {boolean} indicates if is seen
   *   - contents {string} message
   *
  */
  notifications: PropTypes.arrayOf(PropTypes.object),


  /**
   * Called with item to be marked as read.
   *
   * @param item {object} Item to be marked as read
   */
  markNotificationAsRead: PropTypes.func.isRequired,

  /**
   * Called with challenge id to be marked for dismiss.
   *
   * @param challengeId {number} challange to be marked for dismiss.
   */
  dismissChallengeNotifications: PropTypes.func.isRequired,

  /**
   * Called to be mark all notifications as seen.
   *
   */
  markAllNotificationAsSeen: PropTypes.func.isRequired,
};
