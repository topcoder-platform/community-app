/**
 * Child component of Settings/Profile/ renders the
 * 'Basic Info' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import { getAllCountryObjects } from 'utils/countries';

import Select from 'components/Select';

import ImageInput from '../ImageInput';
import dropdowns from './dropdowns.json';

import Styles from './styles.scss';

const countries = getAllCountryObjects();

export default class BasicInfo extends React.Component {
  constructor(props) {
    super(props);

    this.shouldDisableSave = this.shouldDisableSave.bind(this);
    this.onUpdateCountry = this.onUpdateCountry.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onSaveBasicInfo = this.onSaveBasicInfo.bind(this);
    this.toBasicInfo = this.toBasicInfo.bind(this);
    this.isBasicInfoCreated = this.isBasicInfoCreated.bind(this);

    this.state = {
      savingBasicInfo: false,
      inputChanged: false,
      basicInfo: this.toBasicInfo(props.userTraits),
    };
  }

  componentWillReceiveProps(nextProps) {
    const newBasicInfo = this.toBasicInfo(nextProps.userTraits);
    this.setState({
      basicInfo: newBasicInfo,
      savingBasicInfo: false,
    });
  }

  onSaveBasicInfo(e) {
    e.preventDefault();
    this.setState({
      savingBasicInfo: true,
    });

    const {
      handle,
      tokenV3,
      addUserTrait,
      updateUserTrait,
    } = this.props;
    const { basicInfo } = this.state;
    let newInfo = { ...basicInfo };

    /**
     * omit fields that the api can't accept now.
     * remove this line when api is fixed.
     * see: http://apps.topcoder.com/forums/?module=Thread&threadID=919568&start=0
     * */
    newInfo = _.omit(newInfo, ['birthDate', 'address', 'state', 'city', 'zipCode', 'currentLocation']);

    if (this.isBasicInfoCreated()) {
      updateUserTrait(handle, 'basic_info', [newInfo], tokenV3);
    } else {
      addUserTrait(handle, 'basic_info', [newInfo], tokenV3);
    }
  }

  onUpdateSelect(option) {
    if (option) {
      const { basicInfo: oldBasicInfo } = this.state;
      const basicInfo = { ...oldBasicInfo };
      basicInfo[option.key] = option.name;
      this.setState({ basicInfo, inputChanged: true });
    }
  }


  onUpdateInput(e) {
    const { basicInfo: oldBasicInfo } = this.state;
    const basicInfo = { ...oldBasicInfo };
    basicInfo[e.target.name] = e.target.value;
    this.setState({ basicInfo, inputChanged: true });
  }

  onUpdateCountry(country) {
    if (country && country.alpha3) {
      const { basicInfo: oldBasicInfo } = this.state;
      const basicInfo = { ...oldBasicInfo };
      basicInfo.country = country.name;
      this.setState({ basicInfo, inputChanged: true });
    }
  }

  isBasicInfoCreated() {
    const { userTraits } = this.props;
    const trait = userTraits.filter(t => t.traitId === 'basic_info');
    const created = trait.length !== 0;
    return created;
  }

  toBasicInfo(userTraits) {
    const { handle } = this.props;
    const defaultInfo = {
      handle,
      firstName: '',
      lastName: '',
      shortBio: '',
      gender: 'male',
      ethnicBackground: 'Caucasian',
      tshirtSize: 'S',
      country: '',
      primaryInterestInTopcoder: '',

      birthDate: '',
      address: '',
      state: '',
      city: '',
      zipCode: '',
      currentLocation: '',
    };
    const trait = userTraits.filter(t => t.traitId === 'basic_info');
    const basicInfo = trait.length === 0 ? null : trait[0].traits.data[0];
    return _.extend(defaultInfo, basicInfo);
  }

  shouldDisableSave() {
    const { basicInfo, inputChanged } = this.state;

    const invalid = !_.trim(basicInfo.firstName).length
      || !_.trim(basicInfo.lastName).length
      || !_.trim(basicInfo.shortBio).length
      || !_.trim(basicInfo.address).length
      || !_.trim(basicInfo.city).length
      || !_.trim(basicInfo.zipCode).length
      || !_.trim(basicInfo.currentLocation).length
      || !_.trim(basicInfo.primaryInterestInTopcoder).length
      || !_.trim(basicInfo.birthDate).length
      || !_.trim(basicInfo.gender).length
      || !_.trim(basicInfo.ethnicBackground).length
      || !_.trim(basicInfo.tshirtSize).length
      || !_.trim(basicInfo.state).length
      || !_.trim(basicInfo.country).length;

    // Invalid value, can not save
    if (invalid) {
      return true;
    }

    // Value not changed, no need save
    return inputChanged === false;
  }

  render() {
    const {
      settingsUI,
    } = this.props;
    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.BASIC ? '' : 'hide';

    const {
      basicInfo,
      savingBasicInfo,
    } = this.state;

    return (
      <div styleName={containerStyle}>
        <div styleName="basic-info-container">
          <div styleName="user-icon">
            <ImageInput
              {...this.props}
            />
          </div>
          <div styleName="form-container">
            <p styleName="handle">
              { basicInfo.handle }
            </p>
            <form name="BasicInfoForm" noValidate autoComplete="off">
              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="firstName">
Firstname
                  </label>
                  <input id="firstName" name="firstName" type="text" placeholder="First Name" onChange={this.onUpdateInput} value={basicInfo.firstName} maxLength="64" required />
                </div>
                <div styleName="field">
                  <label htmlFor="lastName">
Lastname
                  </label>
                  <input id="lastName" name="lastName" type="text" placeholder="Last Name" onChange={this.onUpdateInput} value={basicInfo.lastName} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field">
                  <label styleName="bio-label" htmlFor="shortBio">
                    <span>
Short Bio
                    </span>
                    {' '}
                    <span>
                      { basicInfo.shortBio.length }
/240
                    </span>
                  </label>
                  <textarea id="shortBio" styleName="bio-text" name="shortBio" placeholder="shortBio" onChange={this.onUpdateInput} value={basicInfo.shortBio} maxLength="240" cols="3" rows="10" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="birthDate">
Birth Date
                  </label>
                  <input id="birthDate" styleName="date-input" name="birthDate" type="date" onChange={this.onUpdateInput} value={basicInfo.birthDate} required />
                </div>

                <div styleName="field">
                  <label htmlFor="gender">
Gender
                  </label>
                  <Select
                    name="gender"
                    options={dropdowns.gender}
                    value={basicInfo.gender}
                    onChange={this.onUpdateSelect}
                    placeholder="Gender"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                  />
                </div>

                <div styleName="field">
                  <label htmlFor="ethnicBackground">
Ethnic
                  </label>
                  <Select
                    name="ethnicBackground"
                    options={dropdowns.ethnicBackground}
                    value={basicInfo.ethnicBackground}
                    onChange={this.onUpdateSelect}
                    placeholder="Ethnic"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                  />
                </div>

                <div styleName="field">
                  <label htmlFor="tshirtSize">
T-Shirt-Size
                  </label>
                  <Select
                    name="tshirtSize"
                    options={dropdowns.tshirtSize}
                    value={basicInfo.tshirtSize}
                    onChange={this.onUpdateSelect}
                    placeholder="tshirtSize"
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
                  </label>
                  <input id="address" name="address" type="text" placeholder="address" onChange={this.onUpdateInput} value={basicInfo.address} maxLength="64" required />
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
                    value={basicInfo.country}
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
                  <input id="state" name="state" type="text" placeholder="state" onChange={this.onUpdateInput} value={basicInfo.state} maxLength="64" required />
                </div>
              </div>

              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="city">
City
                  </label>
                  <input id="city" name="city" type="text" placeholder="city" onChange={this.onUpdateInput} value={basicInfo.city} maxLength="64" required />
                </div>
                <div styleName="field">
                  <label htmlFor="zipCode">
ZIP Code
                  </label>
                  <input id="zipCode" name="zipCode" type="text" placeholder="zipCode" onChange={this.onUpdateInput} value={basicInfo.zipCode} maxLength="64" required />
                </div>
              </div>

              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="currentLocation">
Current Location
                  </label>
                  <input id="currentLocation" name="currentLocation" type="text" placeholder="currentLocation" onChange={this.onUpdateInput} value={basicInfo.currentLocation} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field">
                  <label htmlFor="primaryInterestInTopcoder">
Primary Interest of Topcoder
                  </label>
                  <input id="primaryInterestInTopcoder" name="primaryInterestInTopcoder" type="text" placeholder="primaryInterestInTopcoder" onChange={this.onUpdateInput} value={basicInfo.primaryInterestInTopcoder} maxLength="64" required />
                </div>
              </div>

            </form>

            <div className="save-section">
              <PrimaryButton
                onClick={this.onSaveBasicInfo}
                disabled={this.shouldDisableSave() || savingBasicInfo}

                theme={{ button: Styles['save-button'] }}
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
        </div>
      </div>
    );
  }
}

BasicInfo.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  settingsUI: PT.shape().isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
};
