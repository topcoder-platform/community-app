/**
 * Child component of Settings/Profile/ renders the
 * 'Hobby' page.
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
import HobbyList from './List';

import './styles.scss';


export default class Hobby extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteHobby = this.onHandleDeleteHobby.bind(this);
    this.onDeleteHobby = this.onDeleteHobby.bind(this);
    this.loadHobbyTrait = this.loadHobbyTrait.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onHandleAddHobby = this.onHandleAddHobby.bind(this);
    this.onAddHobby = this.onAddHobby.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);

    const { userTraits } = props;
    this.state = {
      formInvalid: false,
      errorMessage: '',
      hobbyTrait: this.loadHobbyTrait(userTraits),
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newHobby: {
        hobby: '',
        description: '',
      },
      isMobileView: false,
      screenSM: 767,
    };
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillReceiveProps(nextProps) {
    const hobbyTrait = this.loadHobbyTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      hobbyTrait,
      personalizationTrait,
      formInvalid: false,
      errorMessage: '',
      newHobby: {
        hobby: '',
        description: '',
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
  onHandleAddHobby(e) {
    e.preventDefault();
    const { newHobby } = this.state;
    if (this.onCheckFormValue(newHobby)) {
      return;
    }
    this.showConsent(this.onAddHobby.bind(this));
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newHobby object
   */
  onCheckFormValue(newHobby) {
    let invalid = false;

    let errorMessage = '';
    const invalidFields = [];
    if (!_.trim(newHobby.hobby).length) {
      invalidFields.push('Hobby');
      invalid = true;
    }

    if (!_.trim(newHobby.description).length) {
      invalidFields.push('Description');
      invalid = true;
    }

    if (invalidFields.length > 0) {
      errorMessage += invalidFields.join(', ');
      errorMessage += ' cannot be empty';
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
  }

  onHandleDeleteHobby(indexNo) {
    this.showConsent(this.onDeleteHobby.bind(this, indexNo));
  }

  /**
   * Delete hobby by index
   * @param indexNo the hobby index no
   */
  onDeleteHobby(indexNo) {
    const { hobbyTrait } = this.state;
    const newHobbyTrait = { ...hobbyTrait };
    newHobbyTrait.traits.data.splice(indexNo, 1);
    this.setState({
      hobbyTrait: newHobbyTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newHobbyTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'hobby', newHobbyTrait.traits.data, tokenV3);
    } else {
      deleteUserTrait(handle, 'hobby', tokenV3);
    }
  }

  /**
   * Add new hobby
   * @param answer user consent answer value
   */
  onAddHobby(answer) {
    const { newHobby, personalizationTrait, hobbyTrait } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;

    // save hobby
    if (hobbyTrait.traits && hobbyTrait.traits.data.length > 0) {
      const newHobbyTrait = { ...hobbyTrait };
      newHobbyTrait.traits.data.push(newHobby);
      this.setState({ hobbyTrait: newHobbyTrait });
      updateUserTrait(handle, 'hobby', newHobbyTrait.traits.data, tokenV3);
    } else {
      const newHobbies = [];
      newHobbies.push(newHobby);
      const traits = {
        data: newHobbies,
      };
      this.setState({ hobbyTrait: { traits } });
      addUserTrait(handle, 'hobby', newHobbies, tokenV3);
    }
    const empty = {
      hobby: '',
      description: '',
    };
    this.setState({ newHobby: empty });

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
    const { newHobby: oldHobby } = this.state;
    const newHobby = { ...oldHobby };
    newHobby[e.target.name] = e.target.value;
    this.setState({ newHobby });
  }

  /**
   * Get hobby trait
   * @param userTraits the all user traits
   */
  loadHobbyTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'hobby');
    const hobbys = trait.length === 0 ? {} : trait[0];
    return _.assign({}, hobbys);
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
    const {
      settingsUI,
    } = this.props;
    const {
      hobbyTrait,
      isMobileView,
    } = this.state;
    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.HOBBY ? '' : 'hide';
    const hobbyItems = hobbyTrait.traits
      ? hobbyTrait.traits.data.slice() : [];
    const { newHobby, formInvalid, errorMessage } = this.state;

    return (
      <div styleName={containerStyle}>
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        <div styleName="hobby-container">
          <h1>
            Hobby
          </h1>
          <div styleName={`sub-title ${hobbyItems.length > 0 ? '' : 'hidden'}`}>
            Your hobbies
          </div>
          {
            !isMobileView && hobbyItems.length > 0
            && (
              <HobbyList
                hobbyList={{ items: hobbyItems }}
                onDeleteItem={this.onDeleteHobby}
              />
            )
          }
          <div styleName={`sub-title ${hobbyItems.length > 0 ? 'second' : 'first'}`}>
            Add a new hobby
          </div>
          <div styleName="form-container-default">
            <form name="device-form" noValidate autoComplete="off">
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="hobby">
                    Hobby
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <span styleName="text-required">* Required</span>
                  <input id="hobby" name="hobby" type="text" placeholder="Hobby" onChange={this.onUpdateInput} value={newHobby.hobby} maxLength="128" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label styleName="description-label" htmlFor="description">
                    Description
                    <input type="hidden" />
                  </label>
                </div>
                <div styleName="field col-2">
                  <div styleName="description">
                    <div styleName="first-line">
                      <span styleName="description-counts">
                        {newHobby.description.length}
                        /160
                      </span>
                      <span styleName="text-required">* Required</span>
                    </div>
                    <textarea id="description" styleName="description-text" name="description" placeholder="Description" onChange={this.onUpdateInput} value={newHobby.description} maxLength="160" cols="3" rows="10" required />
                  </div>
                </div>
              </div>
            </form>
            <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
              {errorMessage}
            </div>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onHandleAddHobby}
              >
                Add hobby to your list
              </PrimaryButton>
            </div>
          </div>
          <div styleName="form-container-mobile">
            <form name="hobby-form" noValidate autoComplete="off">
              <div styleName="row">
                <p>
                  Add Hobby
                </p>
              </div>
              <div styleName="row">
                <div styleName="field row-1">
                  <label htmlFor="hobby">
                    Hobby
                    <input type="hidden" />
                  </label>
                  <input id="hobby" name="hobby" type="text" placeholder="Hobby" onChange={this.onUpdateInput} value={newHobby.hobby} maxLength="128" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field row-2">
                  <label styleName="description-label" htmlFor="description">
                    <span>
                      Description
                    </span>
                    {' '}
                    <span styleName="description-counts">
                      {newHobby.description.length}
                      /160
                    </span>
                  </label>
                  <textarea id="description" styleName="description-text" name="description" placeholder="Description" onChange={this.onUpdateInput} value={newHobby.description} maxLength="160" cols="3" rows="10" required />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onHandleAddHobby}
              >
                Add Hobby
              </PrimaryButton>
            </div>
          </div>
          {
            isMobileView && hobbyItems.length > 0
            && (
              <HobbyList
                hobbyList={{ items: hobbyItems }}
                onDeleteItem={this.onHandleDeleteHobby}
              />
            )
          }
        </div>
      </div>
    );
  }
}

Hobby.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
  settingsUI: PT.shape().isRequired,
};
