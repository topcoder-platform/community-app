/**
 * render Education list
 */
import React from 'react';
import PT from 'prop-types';
import Item from './Item';

import './styles.scss';

export default function EducationList(props) {
  const {
    educationList,
    onDeleteItem,
    onEditItem,
  } = props;

  return (
    <div styleName={`container ${educationList.items.length > 0 ? 'active' : ''}`}>
      <ul>
        {
          educationList.items.map((education, index) => (
            <li key={`${education.type}${index + 1}`}>
              <Item
                education={education}
                index={index}
                onDeleteItem={onDeleteItem}
                onEditItem={onEditItem}
              />
            </li>
          ))
        }
      </ul>
    </div>
  );
}

EducationList.propTypes = {
  educationList: PT.shape().isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};
