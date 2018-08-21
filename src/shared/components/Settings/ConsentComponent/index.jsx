/**
 * Abstract component that enables sub-classes to have user consent form functionality
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import UserConsentModal from 'components/Settings/UserConsentModal';
import PT from 'prop-types';

export default class ConsentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onHandleConsent = this.onHandleConsent.bind(this);
    this.shouldRenderConsent = this.shouldRenderConsent.bind(this);
    this.renderConsent = this.renderConsent.bind(this);
    this.showConsent = this.showConsent.bind(this);
    ConsentComponent.getTraitData = ConsentComponent.getTraitData.bind(this);
    ConsentComponent.getUserConsent = ConsentComponent.getUserConsent.bind(this);

    this.state = {
      onConsent: undefined,
    };
  }

  onHandleConsent(e, answer) {
    e.preventDefault();
    const { onConsent } = this.state;
    this.setState({ onConsent: undefined });
    if (onConsent === undefined) {
      return;
    }
    onConsent(answer);
  }

  static getTraitData(userTraits) {
    const trait = userTraits.filter(t => t.traitId === 'personalization');
    if (trait.length !== 0) {
      return trait[0].traits.data[0];
    }
    return null;
  }

  static getUserConsent(userTraits) {
    const traitData = ConsentComponent.getTraitData(userTraits);

    if (traitData && typeof traitData.userConsent === 'boolean') {
      return traitData.userConsent;
    }
    // by default, when personalization user trait hasn't been
    // created yet, user doesn't give consent
    return false;
  }

  /**
   * Show User Consent Modal
   * @param onConsent callback after consent
   */
  showConsent(onConsent) {
    const { userTraits } = this.props;
    const userConsent = ConsentComponent.getUserConsent(userTraits);
    if (userConsent === undefined) {
      this.setState({ onConsent });
    } else {
      onConsent(userConsent);
    }
  }

  /**
   * Determines if view show render consent
   *
   * @return {boolean}
   */
  shouldRenderConsent() {
    const { onConsent } = this.state;
    return onConsent;
  }

  renderConsent() {
    return (<UserConsentModal onSaveTrait={this.onHandleConsent} />);
  }
}

ConsentComponent.propTypes = {
  userTraits: PT.array.isRequired,
};
