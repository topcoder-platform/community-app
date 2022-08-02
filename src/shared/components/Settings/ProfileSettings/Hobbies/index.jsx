/* eslint-disable jsx-a11y/label-has-for */
/**
 * Hobbies Form
 * Profile Settings Page
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import ErrorMessage from 'components/Settings/ErrorMessage';
import FormInputText from 'components/Settings/FormInputText';
import FormInputTextArea from 'components/Settings/FormInputTextArea';
import FormField from 'components/Settings/FormField';
import AddItemIcon from 'assets/images/settings-add-item.svg';

import './styles.scss';

const Hobbies = (props) => {
  const {
    isEdit,
    canModifyTrait,
    isSubmit,
    formInvalid,
    newHobby,
    onUpdateInput,
    onHandleAddHobby,
    onCancelEditStatus,
  } = props;

  return (
    <div styleName="hobby-container">
      <div styleName="form-container-default">
        <form name="device-form" noValidate autoComplete="off">
          {/* Hobby */}
          <FormField label="Hobby">
            <FormInputText
              id="hobby"
              name="hobby"
              type="text"
              placeholder="Type here your hobbies"
              onChange={onUpdateInput}
              value={newHobby.hobby}
              maxLength="128"
              required
            />
            {
              isSubmit && formInvalid && (
                <ErrorMessage invalid={_.isEmpty(newHobby.hobby)} message="Hobby cannot be empty" />
              )
            }
          </FormField>

          {/* Description */}
          <FormField label="Description">
            <FormInputTextArea
              disabled={!canModifyTrait}
              id="description"
              name="description"
              type="text"
              placeholder="Shot description about your hobby"
              onChange={onUpdateInput}
              value={newHobby.description}
              maxLength="160"
              cols="3"
              rows="10"
              required
            />
          </FormField>
        </form>
        <div styleName="edit-text-wrapper">
          {!isEdit && (
            <span
              styleName="edit-text"
              role="presentation"
              disabled={!canModifyTrait}
              onClick={onHandleAddHobby}
            >
              <AddItemIcon /> Add hobby to your list
            </span>
          )}

          { isEdit && (
            <React.Fragment>
              <span
                styleName="edit-text"
                role="presentation"
                disabled={!canModifyTrait}
                onClick={onHandleAddHobby}
              >
                Edit hobby to your list
              </span>
              <span styleName="button-cancel">
                <span
                  role="presentation"
                  styleName="edit-text"
                  onClick={onCancelEditStatus}
                >
                  Cancel
                </span>
              </span>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

Hobbies.defaultProps = {
  isEdit: false,
  formInvalid: false,
  isSubmit: false,
  newHobby: {},
};

Hobbies.propTypes = {
  isEdit: PT.bool,
  canModifyTrait: PT.bool.isRequired,
  formInvalid: PT.bool,
  isSubmit: PT.bool,
  newHobby: PT.shape(),
  onUpdateInput: PT.func.isRequired,
  onHandleAddHobby: PT.func.isRequired,
  onCancelEditStatus: PT.func.isRequired,
};

export default Hobbies;
