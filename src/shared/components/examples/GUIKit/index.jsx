import React from 'react';
import CheckboxExample from './Checkbox';
import TextInputExample from './TextInput';
import TextareaExample from './Textarea';
import RadioButtonExample from './RadioButton';
import DatepickerExample from './Datepicker';
import DropdownTermsExample from './DropdownTerms';
import TogglesExample from './Toggles';
import DropdownExample from './Dropdown';

import './style.scss';

export default function GUIKit() {
  return (
    <div styleName="container">
      <h2 styleName="sectionTitle">TEXTBOX</h2>
      <TextInputExample />

      <h2 styleName="sectionTitle">TEXTBOX SMALL</h2>
      <TextInputExample size="xs" />

      <h2 styleName="sectionTitle">TEXTAREA</h2>
      <TextareaExample />

      <h2 styleName="sectionTitle">CHECKBOXES</h2>
      <CheckboxExample />

      <h2 styleName="sectionTitle">RADIO BUTTONS</h2>
      <RadioButtonExample />

      <h2 styleName="sectionTitle">DATE PICKER</h2>
      <DatepickerExample />

      <h2 styleName="sectionTitle">DROPDOWN SKILLS</h2>
      <DropdownTermsExample />

      <h2 styleName="sectionTitle">TOGGLES</h2>
      <TogglesExample />

      <h2 styleName="sectionTitle">DROPDOWN</h2>
      <DropdownExample />

      <h2 styleName="sectionTitle">DROPDOWN  SMALL</h2>
      <DropdownExample size="xs" />
    </div>
  );
}
