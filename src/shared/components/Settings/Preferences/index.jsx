/* eslint-disable prefer-destructuring */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import NewsletterPreferencesContainer from 'containers/NewsletterPreferences';
import PreferenceList from './List';

import ErrorWrapper from '../ErrorWrapper';

import styles from './styles.scss';

export default class Preferences extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.loadOnboardingChecklistTrait = this.loadOnboardingChecklistTrait.bind(this);
    this.newsRef = React.createRef();

    const { userTraits } = props;
    this.state = {
      onboardingChecklistTrait: this.loadOnboardingChecklistTrait(userTraits),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { isSaving, setIsSaving } = this.props;
    const onboardingChecklistTrait = this.loadOnboardingChecklistTrait(nextProps.userTraits);
    this.setState({
      onboardingChecklistTrait,
    });
    if (isSaving !== nextProps.isSaving) {
      setTimeout(() => {
        setIsSaving(false);
      }, 600);
    }
  }

  /**
   * Get onboarding checklist trait
   * @param userTraits the all user traits
   */
  loadOnboardingChecklistTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'onboarding_checklist');
    const onboardingChecklist = trait.length === 0 ? {} : trait[0];
    return _.assign({}, onboardingChecklist);
  }

  save() {
    const { isSaving, setIsSaving } = this.props;
    if (isSaving) {
      return;
    }
    setIsSaving(true);

    this.newsRef.current.getWrappedInstance().save();
  }

  render() {
    const { profile: { email }, isSaving } = this.props;
    const { onboardingChecklistTrait } = this.state;

    const traitData = onboardingChecklistTrait.traits.data[0];
    let paymentSetupCompleted = false;
    if (_.has(traitData, 'user_payment_method')) {
      paymentSetupCompleted = !_.isEmpty(traitData.user_payment_method.payment_method)
        && traitData.user_payment_method.status === 'completed';
    }

    const saveBtn = (
      <PrimaryButton
        onClick={this.save}
        theme={{
          button: `${styles['save-changes-btn']} ${isSaving ? styles.disabled : ''}`,
        }}
        disabled={!!isSaving}
      >
        Save Changes
      </PrimaryButton>
    );

    return (
      <ErrorWrapper>
        <div styleName="preferences-container">
          <div styleName="header">
            <h3>Platform preferences</h3>
          </div>
          <div styleName="platform-banner">
            <NewsletterPreferencesContainer
              email={email}
              ref={this.newsRef}
            />
            <PreferenceList paymentSetupCompleted={paymentSetupCompleted} />
          </div>
        </div>
        <div styleName="footer">{saveBtn}</div>
      </ErrorWrapper>
    );
  }
}

Preferences.defaultProps = {
  isSaving: false,
};

Preferences.propTypes = {
  profile: PT.shape().isRequired,
  isSaving: PT.bool,
  setIsSaving: PT.func.isRequired,
  userTraits: PT.array.isRequired,
};
