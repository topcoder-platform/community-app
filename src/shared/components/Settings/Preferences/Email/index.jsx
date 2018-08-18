/**
 * Email Preferences component.
 */
import { map, debounce } from 'lodash';
import React from 'react';
import PT from 'prop-types';

import ConsentComponent from 'components/Settings/ConsentComponent';
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

const SAVE_DELAY = 1000;

export default class EmailPreferences extends ConsentComponent {
  saveEmailPreferences = debounce(() => {
    const {
      profile,
      saveEmailPreferences,
      tokenV3,
    } = this.props;
    const { emailPreferences } = this.state;

    saveEmailPreferences(
      profile,
      tokenV3,
      emailPreferences,
    );
  }, SAVE_DELAY);

  constructor(props) {
    super(props);
    this.state = {
      emailPreferences: {},
      populated: null,
    };
    this.onHandleChange = this.onHandleChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.populate = this.populate.bind(this);
  }

  componentDidMount() {
    const { profileState: { emailPreferences } } = this.props;
    if (emailPreferences) this.populate(emailPreferences);
  }

  componentWillReceiveProps(nextProps) {
    const { profileState: { emailPreferences } } = nextProps;
    if (emailPreferences) this.populate(emailPreferences);
  }

  onHandleChange(id, checked) {
    this.showConsent(this.onChange.bind(this, id, checked));
  }

  onChange(id, checked) {
    const { emailPreferences } = this.state;
    emailPreferences[id] = checked;
    this.setState({
      emailPreferences,
    }, () => this.saveEmailPreferences());
  }

  populate(data) {
    const { populated } = this.state;
    if (populated) return;
    this.setState({
      emailPreferences: { ...data },
      populated: true,
    });
  }

  render() {
    const { emailPreferences } = this.state;
    return (
      <div styleName="EmailPreferences">
        <h1 styleName="title">
          Email Preferences
        </h1>
        <div styleName="sub-title">
          Your preferences
        </div>
        <div styleName="preferences-container">
          {
            this.shouldRenderConsent() && this.renderConsent()
          }
          {
            map(newsletters, (newsletter) => {
              const checked = emailPreferences[newsletter.id] || false;
              return (
                <ToggleableItem
                  key={newsletter.id}
                  id={newsletter.id}
                  value={newsletter.id}
                  checked={checked}
                  primaryText={newsletter.name}
                  secondaryText={newsletter.desc}
                  onToggle={e => this.onHandleChange(newsletter.id, e.target.checked)}
                />
              );
            })
          }
        </div>
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
