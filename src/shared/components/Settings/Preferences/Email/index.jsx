/**
 * Child component of Settings/Email renders setting page for email preferences.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import LoadingIndicator from 'components/LoadingIndicator';
import Styles from './styles.scss';

const newsletters = [
  {
    id: 'TOPCODER_NL_GEN',
    name: 'General Newsletter',
    desc: 'News summary from all tracks and programs',
  },
  {
    id: 'TOPCODER_NL_DESIGN',
    name: 'Design Newsletter',
    desc: 'Website, mobile, and product design; UI and UX',
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
  {
    id: 'TOPCODER_NL_PREDIX',
    name: 'Predix Community Newsletter',
    desc: 'Design and development on GE’s platform for the Industrial Internet of Things',
  },
  {
    id: 'TOPCODER_NL_IBM_COGNITIVE',
    name: 'Cognitive Community Newsletter',
    desc: 'Never miss out on info about the Topcoder Cognitive Community',
  },
];

export default class Email extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.dataUnchanged = this.dataUnchanged.bind(this);
  }

  onChange() {
    const switches = document.querySelectorAll('input[name="eprf-onoffswitch"]');
    const newPreferences = {};
    _.forEach(switches, (sw) => {
      if (sw.checked) {
        newPreferences[sw.value] = true;
      }
    });
    this.setState({ emailPreferences: newPreferences });
  }

  onSave(e) {
    e.preventDefault();

    if (!_.isUndefined(this.state.emailPreferences)) {
      this.props.saveEmailPreferences(
        this.props.profile,
        this.props.tokenV3,
        this.state.emailPreferences,
      );
    }
  }

  dataUnchanged() {
    return _.isUndefined(this.state.emailPreferences)
    || _.isEqual(this.state.emailPreferences, this.props.profileState.emailPreferences);
  }

  render() {
    const {
      profileState,
    } = this.props;
console.log("Email props", props);
    const { savingEmailPreferences } = profileState;

    const showLoading = !profileState.emailPreferences;
    const userEmailPrefs = this.state.emailPreferences || profileState.emailPreferences || {};

    return (
      <div styleName="email-preferences-container">
        <div className="settings-section" styleName="newsletters">
          <div className="section-fields">
            <div styleName="newsletters">
              {
              showLoading && <LoadingIndicator />
              }
              {
              !showLoading && _.map(newsletters, (newsletter) => {
                const enabled = userEmailPrefs[newsletter.id];
                return (
                  <div styleName="newsletter" key={newsletter.id}>
                    <div styleName={`content ${enabled ? '' : 'disabled'}`}>
                      <div styleName="newsletter-details">
                        <div styleName="text">
                          <span styleName="title">{newsletter.name}</span>
                          <div styleName="description">
                            <span>{newsletter.desc}</span>
                          </div>
                        </div>
                      </div>
                      <div className="onoffswitch">
                        <input
                          type="checkbox"
                          name="eprf-onoffswitch"
                          id={`EMAIL-pre-onoffswitch-${newsletter.id}`}
                          value={newsletter.id}
                          defaultChecked={enabled}
                          onChange={this.onChange}
                          className="onoffswitch-checkbox"
                        />
                        <label htmlFor={`EMAIL-pre-onoffswitch-${newsletter.id}`} className="onoffswitch-label">
                          <span className="onoffswitch-inner" />
                          <span className="onoffswitch-switch" />
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })
              }
            </div>
          </div>
        </div>
        <div className="save-section">
          <PrimaryButton
            disabled={this.dataUnchanged() || savingEmailPreferences}
            onClick={this.onSave}
            theme={{ button: Styles['save-button'] }}
          >
            {
              !savingEmailPreferences && 'Save'
            }
            {
              savingEmailPreferences && <i className="fa fa-spinner fa-spin" />
            }
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

Email.propTypes = {
  tokenV3: PT.string.isRequired,
  profile: PT.shape().isRequired,
  profileState: PT.shape().isRequired,
  saveEmailPreferences: PT.func.isRequired,
};
