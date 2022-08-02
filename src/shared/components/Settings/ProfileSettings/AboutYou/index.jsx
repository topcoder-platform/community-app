/**
 * About You Form
 * Profile Settings Page
 */
import React from 'react';
import PT from 'prop-types';
import FormField from 'components/Settings/FormField';
import FormInputText from 'components/Settings/FormInputText';
import FormInputTextArea from 'components/Settings/FormInputTextArea';

import '../styles.scss';

const AboutYou = (props) => {
  const {
    canModifyTrait,
    newProfileInfo,
    newBasicInfo,
    onUpdateInput,
  } = props;

  return (
    <div styleName="basic-info-container">
      <div styleName="form-container-default">
        <form name="basic-info-form" noValidate autoComplete="off">
          {/* Current Location */}
          <FormField label="Current Location">
            <FormInputText
              disabled={!canModifyTrait}
              id="currentLocation"
              name="currentLocation"
              type="text"
              placeholder="Where in the world are you?"
              onChange={onUpdateInput}
              value={newBasicInfo.currentLocation}
              maxLength="64"
              required
            />
          </FormField>

          {/* Primary interests */}
          <FormField label="Primary interests">
            <FormInputText
              disabled={!canModifyTrait}
              id="primaryInterestInTopcoder"
              name="primaryInterestInTopcoder"
              type="text"
              placeholder="Primary Interest In Topcoder"
              onChange={onUpdateInput}
              value={newBasicInfo.primaryInterestInTopcoder}
              maxLength="64"
              required
            />
          </FormField>

          {/* Primary interests */}
          <FormField label="Short bio">
            <FormInputTextArea
              disabled={!canModifyTrait}
              id="description"
              name="description"
              type="text"
              placeholder="In 240 characters or less, tell the Topcoder community a bit about yourself"
              onChange={onUpdateInput}
              value={newProfileInfo.description}
              maxLength="240"
              cols="3"
              rows="10"
              required
            />
          </FormField>
        </form>
      </div>
    </div>
  );
};

AboutYou.defaultProps = {
  canModifyTrait: false,
  newProfileInfo: {},
  newBasicInfo: {},
};

AboutYou.propTypes = {
  canModifyTrait: PT.bool,
  newProfileInfo: PT.shape(),
  newBasicInfo: PT.shape(),
  onUpdateInput: PT.func.isRequired,
};

export default AboutYou;
