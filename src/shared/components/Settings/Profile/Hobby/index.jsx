/**
 * Child component of Settings/Profile/ renders the
 * 'Hobby' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import UserConsentModal from 'components/Settings/UserConsentModal';
import HobbyList from './List';

import './styles.scss';


export default class Hobby extends React.Component {
  constructor(props) {
    super(props);
    this.onDeleteHobby = this.onDeleteHobby.bind(this);
    this.loadHobbyTrait = this.loadHobbyTrait.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onAddHobby = this.onAddHobby.bind(this);
    this.onShowUserConsent = this.onShowUserConsent.bind(this);

    this.state = {
      showUserConsent: false,
      formInvalid: false,
      errorMessage: '',
      hobbyTrait: this.loadHobbyTrait(props.userTraits),
      personalizationTrait: this.loadPersonalizationTrait(props.userTraits),
      newHobby: {
        hobby: '',
        description: '',
      },
    };
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

  /**
   * Show User Consent Modal
   * @param e event
   */
  onShowUserConsent(e) {
    e.preventDefault();
    const { newHobby } = this.state;
    if (this.onCheckFormValue(newHobby)) {
      return;
    }
    this.setState({ showUserConsent: true });
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newHobby object
   */
  onCheckFormValue(newHobby) {
    let invalid = false;

    let errorMessage = '';
    if (!_.trim(newHobby.hobby).length) {
      errorMessage += 'Hobby, ';
      invalid = true;
    }

    if (!_.trim(newHobby.description).length) {
      errorMessage += 'Description, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
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
   * @param e form submit event
   * @param answer user consent answer value
   */
  onAddHobby(e, answer) {
    e.preventDefault();
    this.setState({ showUserConsent: false });
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

  render() {
    const {
      settingsUI,
    } = this.props;
    const {
      hobbyTrait,
      showUserConsent,
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
            showUserConsent && (<UserConsentModal onSaveTrait={this.onAddHobby} />)
        }
        <div styleName="hobby-container">
          <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
            { errorMessage }
          </div>
          <h1>
            Hobby
          </h1>
          <div styleName="form-container">
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
                      { newHobby.description.length }
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
                onClick={this.onShowUserConsent}
              >
                Add Hobby
              </PrimaryButton>
            </div>
          </div>
          <HobbyList
            hobbyList={{ items: hobbyItems }}
            onDeleteItem={this.onDeleteHobby}
          />
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
