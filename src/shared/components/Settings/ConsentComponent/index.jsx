/**
 * Abstract component that enables sub-classes to have user consent form functionality
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import UserConsentModal from 'components/Settings/UserConsentModal';

export default class ConsentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onHandleConsent = this.onHandleConsent.bind(this);
    this.shouldRenderConsent = this.shouldRenderConsent.bind(this);
    this.renderConsent = this.renderConsent.bind(this);
    this.showConsent = this.showConsent.bind(this);

    this.state = {
      onConsent: undefined
    }
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

  /**
   * Determines if view show render consent
   *
   * @return {boolean}
   */
  shouldRenderConsent() {
    return this.state.onConsent !== undefined;
  }

  renderConsent() {
    return (<UserConsentModal onSaveTrait={this.onHandleConsent} />)
  }

  /**
   * Show User Consent Modal
   * @param onConsent callback after consent
   */
  showConsent(onConsent) {
    this.setState({ onConsent });
  }

}