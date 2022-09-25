/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-shadow */
import React, { useState } from 'react';

import PT from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import CloseIcon from 'assets/images/icon-close-green.svg';
import FormField from 'components/Settings/FormField';
import FormInputText from 'components/Settings/FormInputText';
import FormInputTextArea from 'components/Settings/FormInputTextArea';
import FormInputDatePicker from 'components/Settings/FormInputDatePicker';
import moment from 'moment';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import style from './styles.scss';

const Form = ({ onCancel, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState();

  const files = [
    {
      url: 'https://images.ctfassets.net/b5f1djy59z3a/oUIUOElTboWoXaEpdLKhT/f8f08809197733e8bfcb62baebd97eba/Home_Hero_Banner_Topcoder_Academy_2.jpg',
    },
    {
      url: 'https://images.ctfassets.net/b5f1djy59z3a/oUIUOElTboWoXaEpdLKhT/f8f08809197733e8bfcb62baebd97eba/Home_Hero_Banner_Topcoder_Academy_2.jpg',
    },
    {
      url: 'https://images.ctfassets.net/b5f1djy59z3a/syPow3qaOGYfCTi5Z7Yos/a6ebeedba1c5b5db7a5e5f016da39926/August_Skill_Builder.png',
    },
  ];

  const [fileSelected, setFileSelected] = useState(false);

  const onClickBrowse = () => {
    const inputElement = document.getElementById('upload');
    inputElement.click();
  };

  const onSelect = () => {
    setFileSelected(true);
  };

  const onSubmitEvent = () => {
    setFileSelected(false);
    setDescription('');
    setEventName('');
    setDate(null);
    onCancel();
    onSubmit();
  };

  const isFormValid = fileSelected && description.length && eventName.length && date;

  return (
    <div styleName="form">
      <div>
        <h3 styleName="title">ADD NEW EVENT</h3>
      </div>

      <div role="presentation" styleName="close-icon" onClick={onCancel}>
        <CloseIcon />
      </div>

      <div styleName="content">
        <div styleName="left">
          <div styleName="left-upper">
            <FormField label="Event name" styleName="">
              <FormInputText
                id="eventName"
                name="eventName"
                type="text"
                placeholder="In 38 characters or less, write event name here"
                onChange={e => setEventName(e.target.value)}
                value={eventName}
                maxLength="38"
                required
              />
            </FormField>

            <FormField label="Birth Date">
              <FormInputDatePicker
                displayFormat="MM/DD/YYYY"
                placeholder="Event Date"
                isOutsideRange={function dayAfterToday(dt) { return moment(dt).add(-1, 'days').isAfter(); }}
                value={date}
                id="date-range-picker1"
                onChange={newDate => setDate(newDate)}
              />
            </FormField>
          </div>
          <FormField label="Description">
            <FormInputTextArea
              id="description"
              name="description"
              type="text"
              placeholder="In 240 characters or less, write a description about the event"
              onChange={e => setDescription(e.target.value)}
              value={description}
              maxLength="240"
              cols="3"
              rows="10"
              required
            />
          </FormField>
        </div>

        <div styleName="right">
          {
            fileSelected ? (
              <div styleName="files-uploaded">
                {
                  files.map(file => (
                    <img src={file.url} key={uuidv4} alt="files uploaded" />
                  ))
                }
              </div>
            ) : (
              <div styleName="file-upload-area">
                <h3>
                  Drag & drop your photo or video here You can upload only up to 3 photos/videos
                </h3>

                <PrimaryButton theme={{ button: style.button }} onClick={onClickBrowse}>
                  BROWSE
                </PrimaryButton>
                <input type="file" id="upload" multiple styleName="file" onChange={onSelect} />
              </div>
            )
          }
        </div>
      </div>

      <div styleName="footer-buttons">
        <PrimaryButton theme={{ button: style.button }} onClick={onCancel} size="small">
          CANCEL
        </PrimaryButton>
        <PrimaryButton
          size="small"
          theme={{ button: isFormValid ? style.button : style.disabledButton }}
          onClick={onSubmitEvent}
          disabled={!isFormValid}
        >
          SHARE EVENT
        </PrimaryButton>
      </div>

    </div>
  );
};

Form.propTypes = {
  onCancel: PT.func.isRequired,
  onSubmit: PT.func.isRequired,
};

export default Form;
