/**
 * Email Preferences component.
 */
import { debounce, isEqual, map } from 'lodash';
import React from 'react';
import PT from 'prop-types';

import ConsentComponent from 'components/Settings/ConsentComponent';
import ToggleableItem from 'components/Settings/ToggleableItem';

import './styles.scss';

const SAVE_DELAY = 1000;
const newsletters = [
  {
    id: 'TOPCODER_NL_GEN',
    name: 'General Newsletter',
    desc: 'News summary from Topcoder',
  },
];

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
    if (emailPreferences && !isEqual(this.state.emailPreferences, emailPreferences)) {
      this.populate(emailPreferences);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { profileState: { emailPreferences } } = nextProps;
    if (emailPreferences && this.props.profileState.emailPreferences !== emailPreferences) {
      return true;
    }
    return false;
  }

  onHandleChange(id, checked) {
    this.showConsent(this.onChange.bind(this, id, checked));
  }

  onChange(id, checked) {
    document.querySelectorAll(`#pre-onoffswitch-${id}`).forEach((el) => { el.checked = checked; }); // eslint-disable-line no-param-reassign
    const { emailPreferences } = this.state;
    emailPreferences[id] = checked;
    this.setState({
      emailPreferences,
    }, () => this.saveEmailPreferences());
  }

  populate(data) {
    this.setState({
      emailPreferences: { ...data },
    });
  }

  render() {
    const { profileState: { emailPreferences } } = this.props;
    return (
      <div styleName="EmailPreferences">
        <h1 styleName="title">
          E-Mail Preferences
        </h1>
        <div styleName="preferences-container">
          {
            this.shouldRenderConsent() && this.renderConsent()
          }
          {
            map(newsletters, (newsletter) => {
              const checked = emailPreferences ? emailPreferences[newsletter.id] : false;
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
