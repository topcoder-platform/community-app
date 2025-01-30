/**
 * render Software list
 */
import React from 'react';
import PT from 'prop-types';
import Item from './Item';

import './styles.scss';

export default function SoftwareList(props) {
  const {
    softwareList,
    onDeleteItem,
    onEditItem,
  } = props;

  return (
    <div styleName="container">
      <ul>
        {
          softwareList.items.map((software, index) => (
            <li key={`${software.type}${index + 1}`}>
              <Item
                software={software}
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

SoftwareList.propTypes = {
  softwareList: PT.shape().isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};

SoftwareList.defaultProps = {
};
