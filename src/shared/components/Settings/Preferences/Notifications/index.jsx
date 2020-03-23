import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import shortId from 'shortid';

import ConsentComponent from 'components/Settings/ConsentComponent';
import IconSettingsWeb from 'assets/images/notifications/bell.svg';
import IconSettingsEmail from 'assets/images/notifications/email.svg';
import NotificationItem from '../NotificationItem';
import { EVENT_TYPE } from '../../constants';

import './styles.scss';

const topics = [
  {
    id: 'MY_CHALLENGES',
    name: 'My Registered Challenges',
    desc: 'We will automatically notify you when the specifications of a challenge you are registered are modified or the checkpoint review is ready',
    enabledMethods: ['web', 'email'],
    types: [
      EVENT_TYPE.PROJECT.ACTIVE,
      EVENT_TYPE.PROJECT.COMPLETED,
    ],
  },
  {
    id: 'GENERAL',
    name: 'General',
    desc: 'You will automatically be notified when new and exciting opportunities are available such as joining a new repo, upcoming Marathon Matches, etc.',
    enabledMethods: ['web'],
    types: [
      EVENT_TYPE.BROADCAST,
    ],
  },
];

const initSettings = (settings) => {
  const newSettings = settings;

  const allTypes = _.flatten(_.map(topics, 'types'));

  allTypes.forEach((type) => {
    if (_.isUndefined(newSettings[type])) {
      newSettings[type] = {
        email: { enabled: 'yes', bundlePeriod: 'immediately' },
        web: { enabled: 'yes', bundlePeriod: 'immediately' },
      };
    }
  });

  return newSettings;
};

export default class NotificationPreferences extends ConsentComponent {
  constructor(props) {
    super(props);

    this.state = {
      settings: initSettings(props.notificationSettings),
      topic: '',
      option: '',
    };

    this.onToggle = this.onToggle.bind(this);
    this.toggleSetting = this.toggleSetting.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { fetchNotificationsFailure } = nextProps;
    const { topic, option } = this.state;
    if (fetchNotificationsFailure) {
      this.toggleSetting(topic, option);
    }
  }

  toggleSetting(notification, option) {
    const { settings } = this.state;
    const newSettings = settings;

    notification.types.forEach((type) => {
      newSettings[type] = {
        ...settings[type],
        [option]: {
          ...settings[type][option],
          enabled: settings[type][option].enabled === 'yes' ? 'no' : 'yes',
          bundlePeriod: 'immediately',
        },
      };
    });

    return newSettings;
  }

  onToggle(notification, option) {
    const { saveNotificationSettings, tokenV3 } = this.props;
    const newSettings = this.toggleSetting(notification, option);

    saveNotificationSettings({ notifications: newSettings }, tokenV3);

    this.setState({
      settings: newSettings,
      topic: notification,
      option,
    });
  }

  render() {
    return (
      <div styleName="NotificationPreferences">
        <h1 styleName="title">
          Notifications
        </h1>
        <div styleName="heading">
          <div styleName="sub-title">
            <span>Notification Type</span>
          </div>
          <div styleName="notification-options">
            <div styleName="icon-website">
              <IconSettingsWeb />
              <span styleName="icon-text">Website</span>
            </div>
            <div styleName="icon-email">
              <IconSettingsEmail />
              <span styleName="icon-text">As email</span>
            </div>
          </div>
        </div>
        <div styleName="preferences-container">
          {
            _.map(topics, (topic) => {
              const firstType = topic.types[0];
              const type = this.state.settings[firstType];
              const webChecked = type.web.enabled === 'yes';
              const emailChecked = type.email.enabled === 'yes';
              const website = _.includes(topic.enabledMethods, 'web');
              const email = _.includes(topic.enabledMethods, 'email');
              const uuid = shortId();
              return (
                <NotificationItem
                  id={uuid}
                  key={uuid}
                  value={topic.id}
                  primaryText={topic.name}
                  secondaryText={topic.desc}
                  webChecked={webChecked}
                  emailChecked={emailChecked}
                  website={website}
                  email={email}
                  onWebToggle={() => this.onToggle(topic, 'web')}
                  onEmailToggle={() => this.onToggle(topic, 'email')}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

NotificationPreferences.defaultProps = {
  tokenV3: '',
  fetchNotificationsFailure: false,
  notificationSettings: {},
};

NotificationPreferences.propTypes = {
  notificationSettings: PT.shape(),
  saveNotificationSettings: PT.func.isRequired,
  tokenV3: PT.string,
  fetchNotificationsFailure: PT.bool,
};
