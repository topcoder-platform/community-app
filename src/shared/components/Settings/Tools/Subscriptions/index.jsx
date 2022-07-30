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
import ErrorMessage from 'components/Settings/ErrorMessage';
import FormField from 'components/Settings/FormField';
import FormInputText from 'components/Settings/FormInputText';
import AddItemIcon from 'assets/images/settings-add-item.svg';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';
import ConfirmationModal from '../../ConfirmationModal';
import SubscriptionList from './List';

import styles from './styles.scss';

export default class Subscription extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteSubscription = this.onHandleDeleteSubscription.bind(this);
    this.onDeleteSubscription = this.onDeleteSubscription.bind(this);
    this.onEditSubscription = this.onEditSubscription.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadSubscriptionTrait = this.loadSubscriptionTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onHandleAddSubscription = this.onHandleAddSubscription.bind(this);
    this.onAddSubscription = this.onAddSubscription.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.onCancelEditStatus = this.onCancelEditStatus.bind(this);

    const { userTraits } = props;
    this.state = {
      formInvalid: false,
      isSubmit: false,
      subscriptionTrait: this.loadSubscriptionTrait(userTraits),
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newSubscription: {
        name: '',
      },
      isMobileView: false,
      screenSM: 767,
      showConfirmation: false,
      indexNo: null,
      isEdit: false,
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
      isSubmit: false,
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
    if (e) e.preventDefault();
    const { newSubscription } = this.state;
    this.setState({ isSubmit: true });
    if (this.onCheckFormValue(newSubscription)) {
      return;
    }
    this.showConsent(this.onAddSubscription.bind(this));
  }

  /**
   * Edit Subscription by index
   * @param indexNo the Subscription index no
   */
  onEditSubscription(indexNo) {
    const { subscriptionTrait } = this.state;
    this.setState({
      newSubscription: {
        name: subscriptionTrait.traits.data[indexNo].name,
      },
      isEdit: true,
      indexNo,
      isSubmit: false,
    });
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newSubscription object
   */
  onCheckFormValue(newSubscription) {
    let invalid = false;

    if (!_.trim(newSubscription.name).length) {
      invalid = true;
    }

    this.setState({ formInvalid: invalid });
    return invalid;
  }

  onHandleDeleteSubscription(indexNo) {
    this.setState({
      showConfirmation: true,
      indexNo,
    });
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
    this.setState({
      showConfirmation: false,
      indexNo: null,
      formInvalid: false,
      isEdit: false,
      isSubmit: false,
    });
  }

  /**
   * Add new subscription
   * @param answer user consent answer value
   */
  onAddSubscription(answer) {
    const {
      newSubscription, personalizationTrait, isEdit, indexNo,
    } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { subscriptionTrait } = this.state;
    if (subscriptionTrait.traits && subscriptionTrait.traits.data.length > 0) {
      const newSubscriptionTrait = _.cloneDeep(subscriptionTrait);
      if (isEdit) {
        newSubscriptionTrait.traits.data.splice(indexNo, 1);
      }
      newSubscriptionTrait.traits.data.push(newSubscription);
      updateUserTrait(handle, 'subscription', newSubscriptionTrait.traits.data, tokenV3);
    } else {
      const newSubscriptions = [];
      newSubscriptions.push(newSubscription);
      addUserTrait(handle, 'subscription', newSubscriptions, tokenV3);
    }
    const empty = {
      name: '',
    };
    this.setState({
      newSubscription: empty,
      isEdit: false,
      indexNo: null,
      inputChanged: false,
      isSubmit: false,
    });
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
    this.setState({ newSubscription, isSubmit: false });
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
      this.setState({ newSubscription, isSubmit: false });
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

  onCancelEditStatus() {
    const { isEdit } = this.state;
    if (isEdit) {
      this.setState({
        isEdit: false,
        indexNo: null,
        formInvalid: false,
        isSubmit: false,
        newSubscription: {
          name: '',
        },
      });
    }
  }

  render() {
    const {
      subscriptionTrait, showConfirmation, indexNo, isEdit, isSubmit,
    } = this.state;
    const subscriptionItems = subscriptionTrait.traits
      ? subscriptionTrait.traits.data.slice() : [];
    const { newSubscription, formInvalid } = this.state;
    const canModifyTrait = !this.props.traitRequestCount;

    return (
      <React.Fragment>
        {
        this.shouldRenderConsent() && this.renderConsent()
      }
        {showConfirmation
      && (
        <ConfirmationModal
          onConfirm={() => this.showConsent(this.onDeleteSubscription.bind(this, indexNo))}
          onCancel={() => this.setState({ showConfirmation: false, indexNo: null })}
          name={subscriptionTrait.traits.data[indexNo].name}
        />
      )}
        <div styleName="form-container">
          <Collapse>
            <h2 styleName="form-title">
              Subscriptions
            </h2>
            {
            subscriptionItems.length > 0
            && (
              <SubscriptionList
                subscriptionList={{ items: subscriptionItems }}
                onDeleteItem={this.onHandleDeleteSubscription}
                disabled={!canModifyTrait}
                onEditItem={this.onEditSubscription}
              />
            )
          }
            <div styleName="form-content">
              <div styleName="form-label">
                {
                  isEdit ? (<React.Fragment>Edit subscription</React.Fragment>)
                    : (<React.Fragment>Add a new subscription</React.Fragment>)
                }
              </div>
              <div styleName="form-body">
                <form styleName="subscription-form" noValidate autoComplete="off">
                  <FormField label="Subscription Name" style={{ flex: '0 0 100%' }}>
                    <FormInputText
                      disabled={!canModifyTrait}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Type here the Subscription Name"
                      onChange={this.onUpdateInput}
                      value={newSubscription.name}
                      maxLength="64"
                      required
                    />
                    {
                      isSubmit && (
                        <ErrorMessage invalid={formInvalid} message="Name cannot be empty" />
                      )
                    }
                  </FormField>
                </form>
              </div>
              <div styleName="form-footer">
                {!isEdit && (
                <PrimaryButton
                  theme={{ button: styles.button }}
                  onClick={this.onHandleAddSubscription}
                >
                  <AddItemIcon styleName="icon" /> Add Subscription to Your List
                </PrimaryButton>
                )}

                { isEdit && (
                <React.Fragment>
                  <PrimaryButton
                    theme={{ button: styles.button }}
                    onClick={this.onHandleAddSubscription}
                  >
                    Edit Subscription to Your List
                  </PrimaryButton>
                  <SecondaryButton
                    theme={{ button: styles.button }}
                    onClick={this.onCancelEditStatus}
                  >
                    Cancel
                  </SecondaryButton>
                </React.Fragment>
                )}
              </div>
            </div>
          </Collapse>
        </div>
      </React.Fragment>
    );
  }
}

Subscription.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  traitRequestCount: PT.number.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
};
