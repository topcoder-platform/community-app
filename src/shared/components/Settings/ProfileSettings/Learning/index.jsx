/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
/**
 * Learning And Education Form
 * Profile Settings Page
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';

import ErrorMessage from 'components/Settings/ErrorMessage';
import FormInputText from 'components/Settings/FormInputText';
import FormField from 'components/Settings/FormField';
import AddItemIcon from 'assets/images/settings-add-item.svg';
import FormInputDatePicker from 'components/Settings/FormInputDatePicker';

import EducationList from './List';

import './styles.scss';

const Learning = (props) => {
  const {
    formInvalid,
    isSubmit,
    isEdit,
    educationItems,
    onHandleDeleteEducation,
    onEditEducation,
    startDateInvalid,
    startDateInvalidMsg,
    endDateInvalid,
    endDateInvalidMsg,
    newEducation,
    onUpdateInput,
    onUpdateDate,
    onHandleAddEducation,
    onCancelEditStatus,
  } = props;

  return (
    <div styleName="education-container">
      {
        educationItems.length > 0
        && (
          <EducationList
            educationList={{ items: educationItems }}
            onDeleteItem={onHandleDeleteEducation}
            onEditItem={onEditEducation}
          />
        )
      }
      <div styleName="form-container-default">
        <form name="device-form" noValidate autoComplete="off">
          {/* Name of College or University */}
          <FormField label="Name of College or University">
            <FormInputText
              id="schoolCollegeName"
              name="schoolCollegeName"
              type="text"
              placeholder="Enter Name of school"
              onChange={onUpdateInput}
              value={newEducation.schoolCollegeName}
              maxLength="64"
              required
            />
            {
              isSubmit && formInvalid && (
                <ErrorMessage invalid={_.isEmpty(newEducation.schoolCollegeName)} message="Name cannot be empty" />
              )
            }
          </FormField>

          {/* Degree */}
          <FormField label="Degree">
            <FormInputText
              id="major"
              name="major"
              type="text"
              placeholder="Enter Degree"
              onChange={onUpdateInput}
              value={newEducation.major}
              maxLength="64"
              required
            />
          </FormField>

          <div styleName="date-wrapper">
            {/* Start Date */}
            <FormField label="Degree">

              <FormInputDatePicker
                readOnly
                displayFormat="MM/DD/YYYY"
                placeholder="MM/DD/YYYY"
                isOutsideRange={function dayAfterToday(date) { return moment(date).add(-1, 'days').isAfter(); }}
                value={newEducation.timePeriodFrom}
                id="date-from1"
                onChange={date => onUpdateDate(date, 'timePeriodFrom')}
              />

              {isSubmit && (
                <ErrorMessage
                  invalid={startDateInvalid}
                  message={startDateInvalidMsg}
                />
              )}
            </FormField>

            {/* End Date */}
            <FormField label="End Date (or expected)">

              {
                  newEducation.graduated ? (
                    <FormInputDatePicker
                      readOnly
                      displayFormat="MM/DD/YYYY"
                      placeholder="MM/DD/YYYY"
                      isOutsideRange={function dayAfterToday(date) { return moment(date).add(-1, 'days').isAfter(); }}
                      value={newEducation.timePeriodTo}
                      id="date-to1"
                      onChange={date => onUpdateDate(date, 'timePeriodTo')}
                    />
                  ) : (
                    <FormInputDatePicker
                      readOnly
                      displayFormat="MM/DD/YYYY"
                      placeholder="MM/DD/YYYY"
                      value={newEducation.timePeriodTo}
                      isOutsideRange={function dayAfterToday(date) { return moment(date).add(-1, 'days').isAfter(); }}
                      id="date-to1"
                      onChange={date => onUpdateDate(date, 'timePeriodTo')}
                      allowFutureYear
                    />
                  )
                }

              {
                isSubmit && (
                  <ErrorMessage
                    invalid={endDateInvalid}
                    message={endDateInvalidMsg}
                  />
                )
              }
            </FormField>
          </div>

          <div styleName="checkbox-wrapper">
            <div styleName="checkbox-input-wrapper">
              <input
                name="graduated"
                checked={newEducation.graduated}
                id="graduated"
                onChange={onUpdateInput}
                type="checkbox"
              />
              <label htmlFor="graduated">
                <div styleName="checkbox-input-label">
                      &nbsp;
                </div>
                <input type="hidden" />
              </label>
            </div>
            <label htmlFor="graduated" styleName="graduated">
              Graduated
              <input type="hidden" />
            </label>
          </div>
        </form>
        <div styleName="edit-text-wrapper">
          {!isEdit && (
            <span
              role="presentation"
              styleName="edit-text"
              onClick={onHandleAddEducation}
            >
              <AddItemIcon /> Add Another School / Degree
            </span>
          )}

          { isEdit && (
            <React.Fragment>
              <span
                role="presentation"
                styleName="edit-text"
                onClick={onHandleAddEducation}
              >
                Edit Another School / Degree
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

Learning.defaultProps = {
  formInvalid: false,
  isSubmit: false,
  isEdit: false,
  educationItems: [],
  newEducation: {},
  startDateInvalid: false,
  startDateInvalidMsg: '',
  endDateInvalid: false,
  endDateInvalidMsg: '',
};

Learning.propTypes = {
  formInvalid: PT.bool,
  isSubmit: PT.bool,
  isEdit: PT.bool,
  educationItems: PT.arrayOf(PT.shape()),
  onHandleDeleteEducation: PT.func.isRequired,
  onEditEducation: PT.func.isRequired,
  startDateInvalid: PT.bool,
  startDateInvalidMsg: PT.string,
  endDateInvalid: PT.bool,
  endDateInvalidMsg: PT.string,
  newEducation: PT.shape(),
  onUpdateInput: PT.func.isRequired,
  onUpdateDate: PT.func.isRequired,
  onHandleAddEducation: PT.func.isRequired,
  onCancelEditStatus: PT.func.isRequired,
};

export default Learning;
