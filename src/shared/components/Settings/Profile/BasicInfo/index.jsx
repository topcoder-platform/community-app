/**
 * Child component of Settings/Profile/ renders the
 * 'Basic Info' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-for */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import { getAllCountryObjects } from 'utils/countries';
import UserConsentModal from 'components/Settings/UserConsentModal';
import Select from 'components/Select';
import ImageInput from '../ImageInput';
import Track from './Track';

import dropdowns from './dropdowns.json';
import tracks from './tracks';

import './styles.scss';

const countries = getAllCountryObjects();

export default class BasicInfo extends React.Component {
  constructor(props) {
    super(props);

    this.shouldDisableSave = this.shouldDisableSave.bind(this);
    this.onUpdateCountry = this.onUpdateCountry.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onSaveBasicInfo = this.onSaveBasicInfo.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCheckFormValue = this.onCheckFormValue.bind(this);
    this.onShowUserConsent = this.onShowUserConsent.bind(this);

    this.state = {
      showUserConsent: false,
      savingBasicInfo: false,
      inputChanged: false,
      formInvalid: false,
      errorMessage: '',
      basicInfoTrait: this.loadBasicInfoTraits(props.userTraits),
      personalizationTrait: this.loadPersonalizationTrait(props.userTraits),
      newBasicInfo: {
        handle: '',
        firstName: '',
        lastName: '',
        gender: '',
        ethnicBackground: null,
        shortBio: '',
        tshirtSize: '',
        country: '',
        primaryInterestInTopcoder: '',
        currentLocation: '',
        birthDate: '',
        userId: '',
        description: '',
        otherLangName: null,
        status: '',
        email: '',
        addresses: [{
          streetAddr1: '',
          streetAddr2: '',
          city: '',
          stateCode: '',
          zip: '',
          type: 'Home',
        }],
        homeCountryCode: null,
        competitionCountryCode: null,
        photoURL: '',
        tracks: [],
      },
    };
  }

  componentDidMount() {
    const { basicInfoTrait } = this.state;
    const basicInfo = basicInfoTrait.traits ? basicInfoTrait.traits.data[0] : {};
    this.processBasicInfo(basicInfo);
  }

  componentWillReceiveProps(nextProps) {
    const basicInfoTrait = this.loadBasicInfoTraits(nextProps.userTraits);
    const basicInfo = basicInfoTrait.traits ? basicInfoTrait.traits.data[0] : {};
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.processBasicInfo(basicInfo);
    this.setState({
      basicInfoTrait,
      personalizationTrait,
      savingBasicInfo: false,
      inputChanged: false,
    });
  }

  onCheckFormValue(newBasicInfo) {
    let invalid = false;
    let birthDateInvalid = false;
    let errorMessage = '';
    let dateError = '';

    if (!_.trim(newBasicInfo.firstName).length) {
      errorMessage += 'FirstName, ';
      invalid = true;
    }

    if (!_.trim(newBasicInfo.lastName).length) {
      errorMessage += 'LastName, ';
      invalid = true;
    }

    if (!_.trim(newBasicInfo.gender).length) {
      errorMessage += 'Gender, ';
      invalid = true;
    }

    if (!_.trim(newBasicInfo.tshirtSize).length) {
      errorMessage += 'T shirt size, ';
      invalid = true;
    }

    if (!_.trim(newBasicInfo.addresses[0].streetAddr1).length
        || !_.trim(newBasicInfo.addresses[0].city).length
        || !_.trim(newBasicInfo.addresses[0].stateCode).length
        || !_.trim(newBasicInfo.addresses[0].zip).length) {
      errorMessage += 'Address Information, ';
      invalid = true;
    }

    if (!_.trim(newBasicInfo.currentLocation).length) {
      errorMessage += 'Current Location, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += 'cannot be empty';
    }

    if (!_.trim(newBasicInfo.birthDate).length) {
      dateError += 'Birth Date is incomplete or have an invalid date';
      birthDateInvalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage = `${errorMessage}.${dateError}`;
    } else if (dateError.length > 0) {
      errorMessage = dateError;
      invalid = birthDateInvalid;
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
  }

  /**
   * Show User Consent Modal
   * @param {*} e event
   */
  onShowUserConsent(e) {
    e.preventDefault();
    const { newBasicInfo } = this.state;
    if (this.onCheckFormValue(newBasicInfo)) {
      return;
    }
    this.setState({ showUserConsent: true });
  }

  /**
   * Save Basic Info
   * @param e form submit event
   * @param answer user consent answer value
   */
  onSaveBasicInfo(e, answer) {
    e.preventDefault();
    const { newBasicInfo, basicInfoTrait, personalizationTrait } = this.state;
    this.setState({
      savingBasicInfo: true,
      showUserConsent: false,
    });

    const {
      handle,
      tokenV3,
      addUserTrait,
      updateUserTrait,
    } = this.props;
    newBasicInfo.birthDate = new Date(newBasicInfo.birthDate).toISOString();

    if (basicInfoTrait.traits && basicInfoTrait.traits.data.length > 0) {
      const newBasicInfoTrait = { ...basicInfoTrait };
      newBasicInfoTrait.traits.data = [];
      newBasicInfoTrait.traits.data.push(newBasicInfo);
      updateUserTrait(handle, 'basic_info', newBasicInfoTrait.traits.data, tokenV3);
    } else {
      const data = [];
      data.push(newBasicInfo);
      addUserTrait(handle, 'basic_info', data, tokenV3);
    }

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

  onUpdateSelect(option) {
    if (option) {
      const { newBasicInfo: oldBasicInfo } = this.state;
      const newBasicInfo = { ...oldBasicInfo };
      newBasicInfo[option.key] = option.name;
      this.setState({ newBasicInfo, inputChanged: true });
    }
  }

  onUpdateInput(e) {
    const { newBasicInfo: oldBasicInfo } = this.state;
    const newBasicInfo = { ...oldBasicInfo };
    switch (e.target.name) {
      case 'stateCode':
      case 'zip':
      case 'city':
      case 'streetAddr1':
      case 'streetAddr2':
        newBasicInfo.addresses[0][e.target.name] = e.target.value;
        break;
      default:
        newBasicInfo[e.target.name] = e.target.value;
    }

    this.setState({ newBasicInfo, inputChanged: true });
  }

  onUpdateCountry(country) {
    if (country && country.alpha3) {
      const { newBasicInfo: oldBasicInfo } = this.state;
      const newBasicInfo = { ...oldBasicInfo };
      newBasicInfo.country = country.name;
      this.setState({ newBasicInfo, inputChanged: true });
    }
  }

  /**
   * Change toggle button check value
   * @param id community id
   * @param checked check value
   */
  onChange(id, checked) {
    const { newBasicInfo } = this.state;
    if (checked) {
      newBasicInfo.tracks.push(id.toUpperCase());
    } else {
      _.remove(newBasicInfo.tracks, track => (
        track.toUpperCase() === id.toUpperCase()
      ));
    }
    this.setState({ newBasicInfo, inputChanged: true });
  }

  /**
   * Get basic info trait
   * @param userTraits the all user traits
   */
  loadBasicInfoTraits = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'basic_info');
    const basicInfo = trait.length === 0 ? {} : trait[0];
    return _.assign({}, basicInfo);
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

  /**
   * Process basic info state
   */
  processBasicInfo = (value) => {
    const { newBasicInfo } = this.state;
    const { handle, profile } = this.props;
    if (_.has(value, 'handle')) {
      newBasicInfo.handle = value.handle;
      if (_.has(value, 'addresses') && value.addresses.length > 0) {
        newBasicInfo.addresses[0].city = value.addresses[0].city ? value.addresses[0].city : '';
        newBasicInfo.addresses[0].stateCode = value.addresses[0].stateCode ? value.addresses[0].stateCode : '';
        newBasicInfo.addresses[0].streetAddr1 = value.addresses[0].streetAddr1 ? value.addresses[0].streetAddr1 : '';
        newBasicInfo.addresses[0].streetAddr2 = value.addresses[0].streetAddr2 ? value.addresses[0].streetAddr2 : '';
        newBasicInfo.addresses[0].zip = value.addresses[0].zip ? value.addresses[0].zip : '';
        if (newBasicInfo.addresses[0].streetAddr1 === '' && _.has(value, 'address')) {
          newBasicInfo.addresses[0].streetAddr1 = value.address;
        }
      } else {
        newBasicInfo.addresses[0].city = _.has(value, 'city') ? value.city : '';
        newBasicInfo.addresses[0].stateCode = _.has(value, 'state') ? value.state : '';
        newBasicInfo.addresses[0].streetAddr1 = _.has(value, 'address') ? value.address : '';
        newBasicInfo.addresses[0].zip = _.has(value, 'zipCode') ? value.zipCode : '';
      }
      if (_.has(value, 'birthDate')) {
        newBasicInfo.birthDate = moment(value.birthDate).format('YYYY-MM-DD');
      }
      if (_.has(value, 'competitionCountryCode')) {
        newBasicInfo.competitionCountryCode = value.competitionCountryCode;
      } else {
        newBasicInfo.competitionCountryCode = profile.competitionCountryCode;
      }
      if (_.has(value, 'country')) {
        newBasicInfo.country = value.country;
      }
      if (_.has(value, 'currentLocation')) {
        newBasicInfo.currentLocation = value.currentLocation;
      }
      if (_.has(value, 'description')) {
        newBasicInfo.description = value.description;
      } else {
        newBasicInfo.description = profile.description ? profile.description : '';
      }
      if (_.has(value, 'email')) {
        newBasicInfo.email = value.email;
      } else {
        newBasicInfo.email = profile.email;
      }
      if (_.has(value, 'firstName')) {
        newBasicInfo.firstName = value.firstName;
      }
      if (_.has(value, 'gender')) {
        newBasicInfo.gender = value.gender;
      } else {
        newBasicInfo.gender = profile.gender;
      }
      if (_.has(value, 'homeCountryCode')) {
        newBasicInfo.homeCountryCode = value.homeCountryCode;
      } else {
        newBasicInfo.homeCountryCode = profile.homeCountryCode;
      }
      if (_.has(value, 'lastName')) {
        newBasicInfo.lastName = value.lastName;
      }
      if (_.has(value, 'photoURL')) {
        newBasicInfo.photoURL = value.photoURL;
      } else {
        newBasicInfo.photoURL = profile.photoURL;
      }
      if (_.has(value, 'primaryInterestInTopcoder')) {
        newBasicInfo.primaryInterestInTopcoder = value.primaryInterestInTopcoder;
      }
      if (_.has(value, 'status')) {
        newBasicInfo.status = value.status;
      } else {
        newBasicInfo.status = profile.status;
      }
      if (_.has(value, 'tracks')) {
        newBasicInfo.tracks = value.tracks ? value.tracks : [];
      } else {
        newBasicInfo.tracks = profile.tracks ? profile.tracks : [];
      }
      if (_.has(value, 'tshirtSize')) {
        newBasicInfo.tshirtSize = value.tshirtSize;
      }
      if (_.has(value, 'userId')) {
        newBasicInfo.userId = value.userId;
      } else {
        newBasicInfo.userId = profile.userId;
      }
      this.setState({ newBasicInfo });
    } else {
      newBasicInfo.handle = handle;
      newBasicInfo.gender = 'male';
      newBasicInfo.tshirtSize = 'S';
      newBasicInfo.userId = profile.userId;
      newBasicInfo.status = profile.status;
      newBasicInfo.email = profile.email;
      newBasicInfo.homeCountryCode = profile.homeCountryCode;
      newBasicInfo.competitionCountryCode = profile.competitionCountryCode;
      newBasicInfo.photoURL = profile.photoURL;
      newBasicInfo.tracks = profile.tracks ? profile.tracks : [];
      newBasicInfo.description = profile.description ? profile.description : '';
      this.setState({ newBasicInfo });
    }
  }

  /**
   * Check form validation
   * @returns {boolean}
   */
  shouldDisableSave() {
    const { newBasicInfo, inputChanged } = this.state;

    const invalid = !_.trim(newBasicInfo.firstName).length
      || !_.trim(newBasicInfo.lastName).length
      || !_.trim(newBasicInfo.description).length
      || !_.trim(newBasicInfo.gender).length
      || !_.trim(newBasicInfo.tshirtSize).length
      || !_.trim(newBasicInfo.country).length
      || !_.trim(newBasicInfo.primaryInterestInTopcoder).length
      || !_.trim(newBasicInfo.currentLocation).length
      || !_.trim(newBasicInfo.birthDate).length
      || (newBasicInfo.addresses.length > 0 && !_.trim(newBasicInfo.addresses[0].city).length)
      || (newBasicInfo.addresses.length > 0 && !_.trim(newBasicInfo.addresses[0].stateCode).length)
      || (newBasicInfo.addresses.length > 0 && !_.trim(newBasicInfo.addresses[0].zip).length)
      || (newBasicInfo.addresses.length > 0
        && !_.trim(newBasicInfo.addresses[0].streetAddr1).length);
    // Invalid value, can not save
    if (invalid) {
      return true;
    }

    // Value not changed, no need save
    return inputChanged === false;
  }

  render() {
    const {
      savingBasicInfo,
      newBasicInfo,
      formInvalid,
      errorMessage,
      showUserConsent,
    } = this.state;

    return (
      <div styleName="basic-info-container">
        {
          showUserConsent && (<UserConsentModal onSaveTrait={this.onSaveBasicInfo} />)
        }
        <div styleName="about-me-container">
          <div styleName="user-icon">
            <ImageInput
              {...this.props}
            />
          </div>
          <div styleName="form-container">
            <p styleName="handle">
              { newBasicInfo.handle }
            </p>
            <div styleName="mb-user-card">
              <ImageInput
                {...this.props}
              />
            </div>
            <form name="BasicInfoForm" noValidate autoComplete="off">
              <div styleName="user-card">
                <div styleName="img-container">
                  <ImageInput
                    {...this.props}
                  />
                </div>
                <div styleName="main">
                  <p styleName="user-handle">
                    { newBasicInfo.handle }
                  </p>
                  <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
                    { errorMessage }
                  </div>
                  <div styleName="row">
                    <div styleName="field">
                      <label htmlFor="firstName">
                        Firstname
                        <span styleName="text-required">* Required</span>
                      </label>

                      <input id="firstName" name="firstName" type="text" placeholder="First Name" onChange={this.onUpdateInput} value={newBasicInfo.firstName} maxLength="64" required />
                    </div>
                    <div styleName="field">
                      <label htmlFor="lastName">
                        Lastname
                        <span styleName="text-required">* Required</span>
                      </label>
                      <input id="lastName" name="lastName" type="text" placeholder="Last Name" onChange={this.onUpdateInput} value={newBasicInfo.lastName} maxLength="64" required />
                    </div>
                  </div>
                </div>
              </div>
              <div styleName="row">
                <div styleName="field">
                  <label styleName="bio-label" htmlFor="description">
                    <span>
                      Short Bio
                    </span>
                    <span>
                      {newBasicInfo.description.length}/240
                    </span>
                  </label>
                  <textarea id="description" styleName="bio-text" name="description" placeholder="short Bio" onChange={this.onUpdateInput} value={newBasicInfo.description} maxLength="240" cols="3" rows="10" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="birthDate">
                    Birth Date
                    <span styleName="text-required">* Required</span>
                  </label>
                  <input id="birthDate" styleName="date-input" name="birthDate" type="date" onChange={this.onUpdateInput} value={newBasicInfo.birthDate} required />
                </div>
                <div styleName="field">
                  <label htmlFor="gender">
                    Gender
                    <span styleName="text-required">* Required</span>
                  </label>
                  <Select
                    name="gender"
                    options={dropdowns.gender}
                    value={newBasicInfo.gender}
                    onChange={this.onUpdateSelect}
                    placeholder="Gender"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                  />
                </div>
                <div styleName="field">
                  <label htmlFor="tshirtSize">
                    T-Shirt-Size
                    <span styleName="text-required">* Required</span>
                  </label>
                  <Select
                    name="tshirtSize"
                    options={dropdowns.tshirtSize}
                    value={newBasicInfo.tshirtSize}
                    onChange={this.onUpdateSelect}
                    placeholder="t-shirt Size"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                  />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="address">
                    Address
                    <span styleName="text-required">* Required</span>
                  </label>
                  <input id="address" name="streetAddr1" type="text" placeholder="Address Line 1" onChange={this.onUpdateInput} value={`${newBasicInfo.addresses.length > 0 ? newBasicInfo.addresses[0].streetAddr1 : ''}`} maxLength="64" required />
                  <input id="address" name="streetAddr2" type="text" styleName="second-addr" placeholder="Address Line 2  " onChange={this.onUpdateInput} value={`${newBasicInfo.addresses.length > 0 ? newBasicInfo.addresses[0].streetAddr2 : ''}`} maxLength="64" />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="country">
                    Country
                  </label>
                  <Select
                    name="country"
                    options={countries}
                    value={newBasicInfo.country}
                    onChange={this.onUpdateCountry}
                    placeholder="Country"
                    matchPos="start"
                    matchProp="name"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                  />
                </div>
                <div styleName="field">
                  <label htmlFor="state">
                    State
                  </label>
                  <input id="state" name="stateCode" type="text" placeholder="state" onChange={this.onUpdateInput} value={`${newBasicInfo.addresses.length > 0 ? newBasicInfo.addresses[0].stateCode : ''}`} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="city">
                    City
                  </label>
                  <input id="city" name="city" type="text" placeholder="city" onChange={this.onUpdateInput} value={`${newBasicInfo.addresses.length > 0 ? newBasicInfo.addresses[0].city : ''}`} maxLength="64" required />
                </div>
                <div styleName="field">
                  <label htmlFor="zipCode">
                    ZIP Code
                  </label>
                  <input id="zipCode" name="zip" type="text" placeholder="zipCode" onChange={this.onUpdateInput} value={`${newBasicInfo.addresses.length > 0 ? newBasicInfo.addresses[0].zip : ''}`} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="currentLocation">
                    Current Location
                    <span styleName="text-required">* Required</span>
                  </label>
                  <input id="currentLocation" name="currentLocation" type="text" placeholder="current Location" onChange={this.onUpdateInput} value={newBasicInfo.currentLocation} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="primaryInterestInTopcoder">
                    Primary Interest of Topcoder
                  </label>
                  <input id="primaryInterestInTopcoder" name="primaryInterestInTopcoder" type="text" placeholder="primary Interest In Topcoder" onChange={this.onUpdateInput} value={newBasicInfo.primaryInterestInTopcoder} maxLength="64" required />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div styleName="tracks-container">
          <div styleName="title-info">
            <div styleName="title">
              Tracks
            </div>
            <p styleName="description">
              Topcoder&apos;s three categories of challenges... please pick at
              least one based on your skills and interests.
            </p>
          </div>
          <div styleName="track-list">
            {
              _.map(tracks, (track) => {
                const result = newBasicInfo.tracks.filter(item => (
                  item.toUpperCase() === track.id.toUpperCase()
                ));
                const checked = result.length !== 0;
                return (
                  <Track
                    icon={track.icon}
                    key={track.id}
                    id={track.id}
                    value={track.id}
                    checked={checked}
                    title={track.name}
                    description={track.description}
                    onToggle={event => this.onChange(track.id, event.target.checked)}
                  />
                );
              })
            }
          </div>
        </div>
        <div styleName="button-save">
          <PrimaryButton
            styleName="white-label"
            disabled={false}
            onClick={this.onShowUserConsent}
          >
            {
              'Save Changes'
            }
            {
              savingBasicInfo && '......'
            }
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

BasicInfo.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  profile: PT.shape().isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
};
