/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
/**
 * Personal Details Form
 * Profile Settings Page
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import ErrorMessage from 'components/Settings/ErrorMessage';
import FormInputText from 'components/Settings/FormInputText';
import Select from 'components/Settings/FormInputSelect';
import FormField from 'components/Settings/FormField';
import FormInputDatePicker from 'components/Settings/FormInputDatePicker';

import '../styles.scss';

const PersonalDetails = (props) => {
  const {
    canModifyTrait,
    countries,
    newProfileInfo,
    newBasicInfo,
    onUpdateDate,
    onUpdateInput,
    inputChanged,
    onUpdateCountry,
  } = props;

  return (
    <div styleName="basic-info-container">
      <div styleName="form-container-default">
        <form name="basic-info-form" noValidate autoComplete="off">

          {/* First Name */}
          <FormField label="First Name">
            <FormInputText
              disabled={!canModifyTrait}
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter First Name"
              onChange={onUpdateInput}
              value={newProfileInfo.firstName}
              maxLength="64"
              required
            />
            <ErrorMessage
              invalid={
                _.isEmpty(newProfileInfo.firstName)
                && !_.isNull(newProfileInfo.firstName)
                && inputChanged
              }
              message="First Name cannot be empty"
            />
          </FormField>

          {/* Last Name */}
          <FormField label="Last Name">
            <FormInputText
              disabled={!canModifyTrait}
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter Last Name"
              onChange={onUpdateInput}
              value={newProfileInfo.lastName}
              maxLength="64"
              required
            />
            <ErrorMessage
              invalid={
                _.isEmpty(newProfileInfo.lastName)
                && !_.isNull(newProfileInfo.lastName)
                && inputChanged
              }
              message="Last Name cannot be empty"
            />
          </FormField>

          {/* Birth Date */}
          <FormField label="Birth Date">
            <FormInputDatePicker
              readOnly
              displayFormat="MM/DD/YYYY"
              placeholder="MM/DD/YYYY"
              isOutsideRange={function dayAfterToday(date) { return moment(date).add(-1, 'days').isAfter(); }}
              value={newBasicInfo.birthDate}
              id="date-range-picker1"
              onChange={date => onUpdateDate(date)}
            />
          </FormField>

          {/* Address */}
          <FormField label="Address">
            <FormInputText
              disabled={!canModifyTrait}
              id="address"
              name="streetAddr1"
              type="text"
              placeholder="Your address"
              onChange={onUpdateInput}
              value={`${
                newProfileInfo.addresses.length > 0
                && newProfileInfo.addresses[0].streetAddr1 != null
                  ? newProfileInfo.addresses[0].streetAddr1
                  : ''
              }`}
              maxLength="64"
              required
            />
          </FormField>

          {/* Address 2 */}
          <FormField label="Address 2">
            <FormInputText
              disabled={!canModifyTrait}
              id="address2"
              name="streetAddr2"
              type="text"
              placeholder="Your address continued"
              onChange={onUpdateInput}
              value={`${
                newProfileInfo.addresses.length > 0
                && newProfileInfo.addresses[0].streetAddr2 != null
                  ? newProfileInfo.addresses[0].streetAddr2
                  : ''
              }`}
              maxLength="64"
            />
          </FormField>

          {/* City */}
          <FormField label="City">
            <FormInputText
              disabled={!canModifyTrait}
              id="city"
              name="city"
              type="text"
              placeholder="Which city do you live in?"
              onChange={onUpdateInput}
              value={`${
                newProfileInfo.addresses.length > 0
                && newProfileInfo.addresses[0].city != null
                  ? newProfileInfo.addresses[0].city
                  : ''
              }`}
              maxLength="64"
              required
            />
          </FormField>

          {/* State */}
          <FormField label="State">
            <FormInputText
              disabled={!canModifyTrait}
              id="state"
              name="stateCode"
              type="text"
              placeholder="State"
              onChange={onUpdateInput}
              value={`${
                newProfileInfo.addresses.length > 0
                && newProfileInfo.addresses[0].stateCode != null
                  ? newProfileInfo.addresses[0].stateCode
                  : ''
              }`}
              maxLength="64"
              required
            />
          </FormField>

          {/* Zip */}
          <FormField label="ZIP">
            <FormInputText
              disabled={!canModifyTrait}
              id="zipCode"
              name="zip"
              type="text"
              placeholder="Your ZIP or Postal Code"
              onChange={onUpdateInput}
              value={`${
                newProfileInfo.addresses.length > 0
                && newProfileInfo.addresses[0].zip != null
                  ? newProfileInfo.addresses[0].zip
                  : ''
              }`}
              maxLength="64"
              required
            />
          </FormField>

          {/* Country */}
          <FormField label="Country">
            <Select
              name="country"
              options={countries}
              value={newBasicInfo.country}
              onChange={onUpdateCountry}
              placeholder="Country"
              matchPos="start"
              matchProp="name"
              labelKey="name"
              valueKey="name"
              disabled={!canModifyTrait}
              clearable={false}
            />
            <ErrorMessage
              invalid={_.isEmpty(newBasicInfo.country) && inputChanged}
              message="Country cannot be empty"
              addMargin
            />
          </FormField>
        </form>
      </div>
    </div>
  );
};

PersonalDetails.defaultProps = {
  countries: [],
  canModifyTrait: false,
  newProfileInfo: {},
  newBasicInfo: {},
  inputChanged: false,
};

PersonalDetails.propTypes = {
  countries: PT.arrayOf(PT.shape()),
  canModifyTrait: PT.bool,
  newProfileInfo: PT.shape(),
  newBasicInfo: PT.shape(),
  onUpdateDate: PT.func.isRequired,
  onUpdateInput: PT.func.isRequired,
  onUpdateCountry: PT.func.isRequired,
  inputChanged: PT.bool,
};

export default PersonalDetails;
