/**
 * Child component of Settings/Account/NameAddress renders the
 * 'Name' and 'Address' sections of account setting page.
 */
/* eslint-disable no-nested-ternary */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import { getAllCountryObjects, getCountryObjFromAlpha3 } from 'utils/countries';

import Select from 'components/Select';

import Styles from './styles.scss';

const countries = getAllCountryObjects();

export default class NameAddress extends React.Component {
  constructor(props) {
    super(props);

    this.toAccountInfo = this.toAccountInfo.bind(this);
    this.shouldDisableSave = this.shouldDisableSave.bind(this);
    this.onUpdateName = this.onUpdateName.bind(this);
    this.onUpdateAddress = this.onUpdateAddress.bind(this);
    this.onUpdateCountry = this.onUpdateCountry.bind(this);
    this.onSaveAccount = this.onSaveAccount.bind(this);

    this.state = {
      nameChanged: false,
      accountInfo: this.toAccountInfo(),
    };
  }

  onUpdateName(e) {
    const { accountInfo: oldAccountInfo } = this.state;
    const accountInfo = { ...oldAccountInfo };
    accountInfo[e.target.name] = e.target.value;
    this.setState({ accountInfo, nameChanged: true });
  }

  onUpdateAddress(e) {
    const { accountInfo: oldAccountInfo } = this.state;
    const accountInfo = { ...oldAccountInfo };
    accountInfo.homeAddress = { ...accountInfo.homeAddress, [e.target.name]: e.target.value };
    this.setState({ accountInfo });
  }

  onUpdateCountry(country) {
    if (country && country.alpha3) {
      const { accountInfo: oldAccountInfo } = this.state;
      const accountInfo = { ...oldAccountInfo };
      accountInfo.homeCountryCode = country.alpha3;
      this.setState({ accountInfo });
    }
  }

  onSaveAccount(e) {
    const {
      profile,
      profileState,
      tokenV3,
      updateProfile,
    } = this.props;
    e.preventDefault();
    if (profileState.updatingProfile) {
      return;
    }
    const newProfile = _.clone(profile);
    delete newProfile.groups;

    const { accountInfo } = this.state;
    newProfile.firstName = accountInfo.firstName;
    newProfile.lastName = accountInfo.lastName;
    newProfile.homeCountryCode = accountInfo.homeCountryCode;

    let homeAddress = _.find(newProfile.addresses, { type: 'HOME' });
    if (!homeAddress) {
      homeAddress = {
        type: 'HOME',
      };
      if (!newProfile.addresses) {
        newProfile.addresses = [];
      }
      newProfile.addresses.push(homeAddress);
    }

    _.merge(homeAddress, accountInfo.homeAddress);

    updateProfile(newProfile, tokenV3);
  }

  toAccountInfo() {
    const { profile } = this.props;
    const homeAddress = _.find(profile.addresses, { type: 'HOME' }) || {};

    let accountInfo = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      homeCountryCode: profile.homeCountryCode,
      homeAddress: _.mapValues(homeAddress, val => (val === null ? '' : val)),
    };

    accountInfo = _.mapValues(accountInfo, val => (val === null ? '' : val));

    return accountInfo;
  }

  shouldDisableSave() {
    const { accountInfo } = this.state;

    const invalid = !_.trim(accountInfo.firstName).length
      || !_.trim(accountInfo.lastName).length
      || !accountInfo.homeCountryCode;

    // Invalid value, can not save
    if (invalid) {
      return true;
    }

    // Value not changed, no need save
    return _.isEqual(accountInfo, this.toAccountInfo());
  }

  render() {
    const {
      profileState,
    } = this.props;
    const {
      updatingProfile,
    } = profileState;

    const {
      accountInfo,
      nameChanged,
    } = this.state;

    const userCountry = getCountryObjFromAlpha3(accountInfo.homeCountryCode);

    return (
      <div>
        <form name="accountInfoForm" noValidate autoComplete="off">
          <div className="settings-section" styleName="name">
            <div className="section-info">
              <h2>
                {' '}
Name
              </h2>
              <div className="description">
Required for legal purposes; will be kept private and not shared with anyone.
              </div>
            </div>
            <div className="section-fields" styleName="account-section-fields">
              <input autoComplete="false" name="hidden" type="text" className="hidden" />
              <div className="form-label">
First name
                <span styleName="no-text-transform">
&nbsp;(Given name)
                </span>
                <span className="mandatory">
*mandatory
                </span>
              </div>
              <div className="form-field" styleName={`validation-bar ${nameChanged ? (accountInfo.firstName ? 'success-bar' : 'error-bar') : ''}`}>
                <input name="firstName" type="text" placeholder="First" onChange={this.onUpdateName} value={accountInfo.firstName} maxLength="64" required />
                <div className={`form-input-error ${accountInfo.firstName ? 'hidden' : ''}`}>
                  <p>
This is a required field.
                  </p>
                </div>
              </div>
              <div className="form-label">
Last name
                <span styleName="no-text-transform">
&nbsp;(Surname)
                </span>
                <span className="mandatory">
*mandatory
                </span>
              </div>
              <div className="form-field" styleName={`validation-bar ${nameChanged ? (accountInfo.lastName ? 'success-bar' : 'error-bar') : ''}`}>
                <input name="lastName" type="text" placeholder="Last" onChange={this.onUpdateName} value={accountInfo.lastName} maxLength="64" required />
                <div className={`form-input-error ${accountInfo.lastName ? 'hidden' : ''}`}>
                  <p>
This is a required field.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="settings-section" styleName="address">
            <div className="section-info">
              <h2>
Address
              </h2>
              <div className="description">
                Required for payments and in case we need to mail you
                something. Will be kept private and not shared with anyone.
              </div>
            </div>
            <div className="section-fields" styleName="account-section-fields">
              <div className="form-label" styleName="address">
Address
              </div>
              <input className="form-field" name="streetAddr1" type="text" placeholder="123 Topcoder Ave." value={accountInfo.homeAddress.streetAddr1} onChange={this.onUpdateAddress} />
              <div className="form-label">
Address 2
                <span styleName="no-text-transform">
&nbsp;(apt., suite, etc.)
                </span>
              </div>
              <input className="form-field" name="streetAddr2" type="text" placeholder="Suite 42" value={accountInfo.homeAddress.streetAddr2} onChange={this.onUpdateAddress} />
              <div className="form-label">
City
              </div>
              <input className="form-field" name="city" type="text" placeholder="Best City in the World" value={accountInfo.homeAddress.city} onChange={this.onUpdateAddress} />
              <div className="form-label">
State/Province
              </div>
              <input className="form-field" name="stateCode" type="text" placeholder="California" value={accountInfo.homeAddress.stateCode} onChange={this.onUpdateAddress} />
              <div className="form-label">
Zip/Post Code
              </div>
              <input className="form-field" name="zip" type="text" placeholder="Zip" value={accountInfo.homeAddress.zip} onChange={this.onUpdateAddress} />
              <div className="form-label">
                <span>
Country
                </span>
                <span className="mandatory">
*mandatory
                </span>
              </div>
              <div className="form-field">
                <Select
                  name="location"
                  options={countries}
                  value={userCountry}
                  onChange={this.onUpdateCountry}
                  placeholder="Country"
                  matchPos="start"
                  matchProp="name"
                  labelKey="name"
                  valueKey="name"
                  clearable={false}
                />
              </div>
            </div>
          </div>
        </form>
        <div className="save-section">
          <PrimaryButton
            disabled={this.shouldDisableSave() || updatingProfile}
            onClick={this.onSaveAccount}
            theme={{ button: Styles['save-button'] }}
          >
            {
              !updatingProfile && 'Save'
            }
            {
              updatingProfile && <i className="fa fa-spinner fa-spin" />
            }
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

NameAddress.propTypes = {
  tokenV3: PT.string.isRequired,
  profile: PT.shape().isRequired,
  profileState: PT.shape().isRequired,
  updateProfile: PT.func.isRequired,
};
