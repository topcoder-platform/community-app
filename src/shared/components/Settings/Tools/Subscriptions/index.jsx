/**
 * Child component of Settings/Tools/ renders the
 * 'Subscription' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-undef */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import ConsentComponent from 'components/Settings/ConsentComponent';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import SubscriptionList from './List';

import './styles.scss';


export default class Subscription extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteSubscription = this.onHandleDeleteSubscription.bind(this);
    this.onDeleteSubscription = this.onDeleteSubscription.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadSubscriptionTrait = this.loadSubscriptionTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onHandleAddSubscription = this.onHandleAddSubscription.bind(this);
    this.onAddSubscription = this.onAddSubscription.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    const { userTraits } = props;
    this.state = {
      formInvalid: false,
      errorMessage: '',
      subscriptionTrait: this.loadSubscriptionTrait(userTraits),
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newSubscription: {
        name: '',
      },
      isMobileView: false,
      screenSM: 768,
    };
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillReceiveProps(nextProps) {
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    const subscriptionTrait = this.loadSubscriptionTrait(nextProps.userTraits);
    this.setState({
      subscriptionTrait,
      personalizationTrait,
      formInvalid: false,
      errorMessage: '',
      newSubscription: {
        name: '',
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onHandleAddSubscription(e) {
    e.preventDefault();
    const { newSubscription } = this.state;
    if (this.onCheckFormValue(newSubscription)) {
      return;
    }
    this.showConsent(this.onAddSubscription.bind(this));
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newSubscription object
   */
  onCheckFormValue(newSubscription) {
    let invalid = false;

    let errorMessage = '';

    if (!_.trim(newSubscription.name).length) {
      errorMessage += 'Name';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
  }

  onHandleDeleteSubscription(indexNo) {
    this.showConsent(this.onDeleteSubscription.bind(this, indexNo));
  }

  /**
   * Delete subscription by index
   * @param indexNo the subscription index no
   */
  onDeleteSubscription(indexNo) {
    const { subscriptionTrait } = this.state;
    const newSubscriptionTrait = { ...subscriptionTrait };
    newSubscriptionTrait.traits.data.splice(indexNo, 1);
    this.setState({
      subscriptionTrait: newSubscriptionTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newSubscriptionTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'subscription', newSubscriptionTrait.traits.data, tokenV3);
    } else {
      deleteUserTrait(handle, 'subscription', tokenV3);
    }
  }

  /**
   * Add new subscription
   * @param answer user consent answer value
   */
  onAddSubscription(answer) {
    const { newSubscription, personalizationTrait } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { subscriptionTrait } = this.state;
    if (subscriptionTrait.traits && subscriptionTrait.traits.data.length > 0) {
      const newSubscriptionTrait = { ...subscriptionTrait };
      newSubscriptionTrait.traits.data.push(newSubscription);
      this.setState({ subscriptionTrait: newSubscriptionTrait });
      updateUserTrait(handle, 'subscription', newSubscriptionTrait.traits.data, tokenV3);
    } else {
      const newSubscriptions = [];
      newSubscriptions.push(newSubscription);
      const traits = {
        data: newSubscriptions,
      };
      this.setState({ subscriptionTrait: { traits } });
      addUserTrait(handle, 'subscription', newSubscriptions, tokenV3);
    }
    const empty = {
      name: '',
    };
    this.setState({ newSubscription: empty });
    // save personalization
    if (_.isEmpty(personalizationTrait)) {
      const personalizationData = { userConsent: answer };
      addUserTrait(handle, 'personalization', [personalizationData], tokenV3);
    } else {
      const trait = personalizationTrait.traits.data[0];
      if (trait.userConsent !== answer) {
        const personalizationData = { userConsent: answer };
        updateUserTrait(handle, 'personalization', [personalizationData], tokenV3);
      }
    }
  }

  /**
   * Update input value
   * @param e event
   */
  onUpdateInput(e) {
    const { newSubscription: oldSubscription } = this.state;
    const newSubscription = { ...oldSubscription };
    newSubscription[e.target.name] = e.target.value;
    this.setState({ newSubscription });
  }

  /**
   * Update select value
   * @param option selected value
   */
  onUpdateSelect(option) {
    if (option) {
      const { newSubscription: oldSubscription } = this.state;
      const newSubscription = { ...oldSubscription };
      newSubscription[option.key] = option.name;
      this.setState({ newSubscription });
    }
  }

  /**
   * Get subscription trait
   * @param userTraits the all user traits
   */
  loadSubscriptionTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'subscription');
    const subscriptions = trait.length === 0 ? {} : trait[0];
    return _.assign({}, subscriptions);
  }

  /**
   * Get personalization trait
   * @param userTraits the all user traits
   */
  loadPersonalizationTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'personalization');
    const personalization = trait.length === 0 ? {} : trait[0];
    return _.assign({}, personalization);
  }

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  render() {
    const { subscriptionTrait, isMobileView } = this.state;
    const subscriptionItems = subscriptionTrait.traits
      ? subscriptionTrait.traits.data.slice() : [];
    const { newSubscription, formInvalid, errorMessage } = this.state;

    return (
      <div styleName="subscription-container">
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
          { errorMessage }
        </div>
        <h1>
          Subscriptions
        </h1>
        <div styleName={`sub-title ${subscriptionItems.length > 0 ? '' : 'hidden'}`}>
          Your subscriptions
        </div>
        {
          !isMobileView
          && (
            <SubscriptionList
              subscriptionList={{ items: subscriptionItems }}
              onDeleteItem={this.onDeleteSubscription}
            />
          )
        }
        <div styleName={`sub-title ${subscriptionItems.length > 0 ? 'second' : 'first'}`}>
          Add a new subscription
        </div>
        <div styleName="form-container-default">
          <form name="device-form" noValidate autoComplete="off">
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="name">
                  Name
                </label>
              </div>
              <div styleName="field col-2">
                <span styleName="text-required">* Required</span>
                <input id="name" name="name" type="text" placeholder="Name" onChange={this.onUpdateInput} value={newSubscription.name} maxLength="128" required />
              </div>
            </div>
          </form>
          <div styleName="button-save">
            <PrimaryButton
              styleName="complete"
              onClick={this.onHandleAddSubscription}
            >
              Add subscription to your list
            </PrimaryButton>
          </div>
        </div>
        <div styleName="form-container-mobile">
          <form name="subscription-form" noValidate autoComplete="off">
            <div styleName="row">
              <p>
                Add Subscription
              </p>
            </div>
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="name">
                  Name
                  <span styleName="text-required">* Required</span>
                </label>
                <input id="name" name="name" type="text" placeholder="Name" onChange={this.onUpdateInput} value={newSubscription.name} maxLength="128" required />
              </div>
            </div>
          </form>
          <div styleName="button-save">
            <PrimaryButton
              styleName="complete"
              onClick={this.onHandleAddSubscription}
            >
              Add Subscription
            </PrimaryButton>
          </div>
        </div>
        {
          isMobileView
          && (
            <SubscriptionList
              subscriptionList={{ items: subscriptionItems }}
              onDeleteItem={this.onHandleDeleteSubscription}
            />
          )
        }
      </div>
    );
  }
}

Subscription.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
};
