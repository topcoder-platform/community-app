/**
 * Email Preferences component.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import LoadingIndicator from 'components/LoadingIndicator';
import ToggleableItem from 'components/Settings/ToggleableItem';

import './styles.scss';

const newsletters = [
  {
    id: 'TOPCODER_NL_GEN',
    name: 'General Newsletter',
    desc: 'News summary from all tracks and programs',
  },
  {
    id: 'TOPCODER_NL_DESIGN',
    name: 'Design Newsletter',
    desc: 'Website, mobile and product design; UI and UX',
  },
  {
    id: 'TOPCODER_NL_DEV',
    name: 'Development Newsletter',
    desc: 'Software architecture, component assembly, application development, and bug hunting',
  },
  {
    id: 'TOPCODER_NL_DATA',
    name: 'Data Science Newsletter',
    desc: 'Algorithm and data structures, statistical analysis',
  },
  {
    id: 'TOPCODER_NL_IOS',
    name: 'iOS Community Newsletter',
    desc: 'Mobile app design and development for iOS, with Swift emphasis',
  },
  {
    id: 'TOPCODER_NL_TCO',
    name: 'TCO Newsletter',
    desc: 'Our annual online and onsite tournament to celebrate and reward the community',
  },
  /*
  {
    id: 'TOPCODER_NL_PREDIX',
    name: 'Predix Community Newsletter',
    desc: 'Design and development on GE’s platform for the Industrial Internet of Things',
  },
  */
  {
    id: 'TOPCODER_NL_IBM_COGNITIVE',
    name: 'Cognitive Community Newsletter',
    desc: 'Never miss out on info about the Topcoder Cognitive Community',
  },
];

export default class EmailPreferences extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const {
      profile,
      saveEmailPreferences,
      tokenV3,
    } = this.props;
    const switches = document.querySelectorAll('input[name="eprf-onoffswitch"]');
    const newPreferences = {};
    _.forEach(switches, (sw) => {
      if (sw.checked) {
        newPreferences[sw.value] = true;
      } else {
        newPreferences[sw.value] = false;
      }
    });
    // adding a default `false` value for the Predix newsetter for now
    // as per http://apps.topcoder.com/forums/?module=Thread&threadID=920048&start=0
    newPreferences.TOPCODER_NL_PREDIX = false;

    saveEmailPreferences(
      profile,
      tokenV3,
      newPreferences,
    );
  }

  render() {
    const {
      profileState,
    } = this.props;

    const showLoading = !profileState.emailPreferences;
    const userEmailPrefs = profileState.emailPreferences || {};

    const renderItems = () => (
      <div styleName="preferences-container">
        {
          _.map(newsletters, (newsletter) => {
            const checked = userEmailPrefs[newsletter.id];
            return (
              <ToggleableItem
                key={newsletter.id}
                id={newsletter.id}
                value={newsletter.id}
                checked={checked}
                primaryText={newsletter.name}
                secondaryText={newsletter.desc}
                onToggle={this.onChange}
              />
            );
          })
        }
      </div>
    );

    return (
      <div styleName="EmailPreferences">
        <h1 styleName="title">
Email Preferences
        </h1>
        {
          showLoading && <LoadingIndicator />
        }
        {
          !showLoading && renderItems()
        }
      </div>
    );
  }
}

EmailPreferences.propTypes = {
  tokenV3: PT.string.isRequired,
  profile: PT.shape().isRequired,
  profileState: PT.shape().isRequired,
  saveEmailPreferences: PT.func.isRequired,
};
