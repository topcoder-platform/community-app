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
  } = props;

  return (
    <div styleName={`container ${softwareList.items.length > 0 ? 'active' : ''}`}>
      <ul>
        {
          softwareList.items.map((software, index) => (
            <li key={`${software.type}${index + 1}`}>
              <Item software={software} index={index} onDeleteItem={onDeleteItem} />
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
};
