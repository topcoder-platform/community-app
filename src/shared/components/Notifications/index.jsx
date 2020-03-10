import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'topcoder-react-utils';
import IconArrow from 'assets/images/notifications/arrow.svg';
import styles from './style.scss';
import TabsPanel from './TabsPanel';

// TODO: We change this later based on API event mapping
const eventTypes = {
  PROJECT: {
    ACTIVE: [
      'challenge.notification.events',
      'submission.notification.create',
    ],
    COMPLETED: 'challenge.notification.completed',
  },
  BROADCAST: 'admin.notification.broadcast',
};

// Dynamic element, to select between Link and Div
const ConditionalWrapper = ({
  condition, renderLink, renderDiv, children,
}) => (
  condition ? renderLink(children) : renderDiv(children)
);

const Item = ({
  item, auth, markNotificationAsRead, showPoint, isLink,
}) => (
  <ConditionalWrapper
    condition={isLink}
    renderLink={children => (
      <Link
        to={`/challenges/${item.sourceId}`}
        className={styles['noti-item']}
        onClick={() => !item.isRead && markNotificationAsRead(item, auth.tokenV3)}
      >
        {children}
      </Link>
    )}
    renderDiv={children => (
      <div className={styles['noti-item']}>
        {children}
      </div>
    )}
  >
    <Fragment>
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
              onClick={() => {
                if (!isLink) {
                  markNotificationAsRead(item, auth.tokenV3);
                }
              }}
              onKeyPress={() => {
                markNotificationAsRead(item, auth.tokenV3);
              }}
              tabIndex="0"
            />
          )}
      </div>
    </Fragment>
  </ConditionalWrapper>
);
Item.propTypes = {
  item: PropTypes.shape().isRequired,
  auth: PropTypes.shape().isRequired,
  markNotificationAsRead: PropTypes.func.isRequired,
  showPoint: PropTypes.bool.isRequired,
  isLink: PropTypes.bool.isRequired,
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
      activeTab: 'active',
    };
  }

  componentWillUnmount() {
    // mark all notifications as seen when go to another page
    const {
      markAllNotificationAsSeen, notifications, auth,
    } = this.props;
    const notificationsList = _.filter((notifications || []), t => !t.isSeen);
    const result = _.map(notificationsList, 'id').join('-');
    if (result) {
      markAllNotificationAsSeen(result, auth.tokenV3);
    }
  }

  changeTab = (tab) => {
    this.setState({
      activeTab: tab,
    });
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

  isLink = (item) => {
    const ret = (eventTypes.PROJECT.ACTIVE.includes(item.eventType)
      || eventTypes.PROJECT.COMPLETED.includes(item.eventType))
      && item.sourceId;
    return ret;
  }

  render() {
    const {
      auth, notifications, loadNotifications, markNotificationAsRead,
      dismissChallengeNotifications,
    } = this.props;
    const { collapsedChallenges, activeTab } = this.state;
    let challengesList = [];
    if (activeTab === 'active') {
      challengesList = _.filter((notifications || []),
        t => eventTypes.PROJECT.ACTIVE.includes(t.eventType));
    } else if (activeTab === 'completed') {
      challengesList = _.filter((notifications || []),
        t => eventTypes.PROJECT.COMPLETED.includes(t.eventType));
    } else {
      challengesList = _.filter((notifications || []),
        t => eventTypes.BROADCAST.includes(t.eventType));
    }
    return (
      <div className={styles['outer-container']}>
        <h1 className={styles.heading}>Notifications</h1>
        <div className={styles['notifications-panel']}>
          <TabsPanel
            changeTab={tab => this.setState({ activeTab: tab })}
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
                          activeTab !== 'completed' && styles['hide-challenge-header-rights']])}
                        >
                          <div
                            role="button"
                            tabIndex="0"
                            className={styles['dismiss-challenge']}
                            onClick={() => {
                              if (challegeId) {
                                dismissChallengeNotifications(challegeId, auth.tokenV3);
                              }
                            }}
                            onKeyPress={() => {
                              if (challegeId) {
                                dismissChallengeNotifications(challegeId, auth.tokenV3);
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
                            notifications={notifications}
                            item={item}
                            auth={auth}
                            loadNotifications={loadNotifications}
                            markNotificationAsRead={markNotificationAsRead}
                            key={`noti-item-${item.id}`}
                            showPoint={activeTab !== 'completed'}
                            isLink={this.isLink(item)}
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

NotificationList.propTypes = {
  auth: PropTypes.shape().isRequired,
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
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,

  loadNotifications: PropTypes.func.isRequired,

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
