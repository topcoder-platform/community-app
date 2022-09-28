import React, { useState, useMemo } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import IconPhoto from 'assets/images/timeline-wall/icon-photo.svg';
import IconVideo from 'assets/images/timeline-wall/icon-video.svg';
import IconTooltipDown from 'assets/images/timeline-wall/tooltip-down.svg';
import IconTooltipLeft from 'assets/images/timeline-wall/tooltip-left.svg';
import FormInputText from 'components/Settings/FormInputText';
import FormField from 'components/Settings/FormField';
import FormInputDatePicker from 'components/Settings/FormInputDatePicker';
import FormInputTextArea from 'components/Settings/FormInputTextArea';
import PhotoVideoPicker from 'components/GUIKit/PhotoVideoPicker';
import IconCloseGreen from 'assets/images/icon-close-green.svg';
import IconCloseBlack from 'assets/images/tc-edu/icon-close-big.svg';

import style from './styles.scss';

function AddEvents({ className, role }) {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const canSubmitForm = useMemo(() => !!formData.eventName
    && !!formData.date
    && !!formData.description
    && !!formData.files
    && !!formData.files.length, [formData]);


  return (
    <div className={className} styleName="container">
      <IconTooltipLeft styleName="hide-desktop show-mobile" />

      {role === 'Guest' ? (<div styleName="no-login">Please login or create an account to add an event.</div>) : null}
      {role !== 'Guest' && !showAddForm ? (
        <button onClick={() => setShowAddForm(true)} styleName="btn-add-event" type="button">
          <span styleName="text-left">What event would you like to add?</span>

          <div styleName="block-right">
            <div styleName="block-right-1"><IconPhoto /> <span styleName="hide-mobile">Photo</span></div>
            <div styleName="separator" />
            <div styleName="block-right-1"><IconVideo /> <span styleName="hide-mobile">Video</span></div>
          </div>
        </button>
      ) : null}

      {role !== 'Guest' && showAddForm ? (
        <div styleName="add-event-form">
          <div styleName="header">
            <span>Add New Event</span>
            <button
              onClick={() => {
                setFormData({
                  eventName: '',
                  description: '',
                });
                setShowAddForm(false);
              }}
              type="button"
            >
              <IconCloseGreen styleName="hide-mobile" />
              <IconCloseBlack width="14" height="14" styleName="hide-desktop show-mobile" />
            </button>
          </div>

          <div styleName="form-container">
            <div styleName="block-left">
              <div styleName="block-left-top">
                <FormField label="Event name" styleName="field-event-name">
                  <FormInputText
                    id="eventName"
                    name="eventName"
                    type="text"
                    placeholder="In 38 characters or less, write event name here"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        eventName: e.target.value,
                      });
                    }}
                    value={formData.eventName}
                    maxLength="38"
                    showChartCount
                  />
                </FormField>

                <FormField label="Event Date" styleName="field-event-date">
                  <FormInputDatePicker
                    readOnly
                    displayFormat="MM/DD/YYYY"
                    placeholder="Event Date"
                    isOutsideRange={date => moment(date).add(-1, 'days').isAfter()}
                    value={formData.date}
                    id="event-date"
                    onChange={(date) => {
                      setFormData({
                        ...formData,
                        date,
                      });
                    }}
                  />
                </FormField>
              </div>

              <FormField label="Description" isTextarea styleName="field-event-description">
                <FormInputTextArea
                  id="description"
                  name="description"
                  type="text"
                  placeholder="In 240 characters or less, tell the Topcoder community a bit about yourself"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    });
                  }}
                  value={formData.description}
                  maxLength="240"
                  cols="3"
                  rows="10"
                  required
                  showBottomChartCount
                  showChartCount={false}
                />
              </FormField>
            </div>

            <PhotoVideoPicker
              file={formData.files}
              className={style['field-photo-picker']}
              onFilePick={(files) => {
                setFormData({
                  ...formData,
                  files: files.slice(0, 3),
                });
              }}
              infoText={'Drag & drop your photo or video here\nYou can upload only up to 3 photos/videos'}
              infoTextMobile="Drag & drop your photo or video here"
              btnText="BROWSE"
            />
          </div>

          <div styleName="block-bottom">
            <button
              onClick={() => {
                setFormData({
                  eventName: '',
                  description: '',
                });
                setShowAddForm(false);
              }}
              styleName="btn-outline btn-cancel"
              type="button"
            >CANCEL
            </button>

            <button
              onClick={() => {
                setFormData({
                  eventName: '',
                  description: '',
                });
                setShowAddForm(false);
              }}
              disabled={!canSubmitForm}
              styleName="btn-primary"
              type="button"
            >SHARE EVENT
            </button>
          </div>
        </div>
      ) : null}

      <IconTooltipDown styleName="hide-mobile" />
    </div>
  );
}

/**
 * Default values for Props
 */
AddEvents.defaultProps = {
  className: '',
  role: '',
};

/**
 * Prop Validation
 */
AddEvents.propTypes = {
  className: PT.string,
  role: PT.string,
};

export default AddEvents;
