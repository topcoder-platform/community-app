/**
 * render Hobby list
 */
import React from 'react';
import PT from 'prop-types';
import Item from './Item';

import './styles.scss';

export default function HobbyList(props) {
  const {
    hobbyList,
    onDeleteItem,
    onEditItem,
  } = props;

  return (
    <div styleName={`container ${hobbyList.items.length > 0 ? 'active' : ''}`}>
      <ul>
        {
          hobbyList.items.map((hobby, index) => (
            <li key={`${hobby.hobby}${index + 1}`}>
              <Item
                hobby={hobby}
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

HobbyList.propTypes = {
  hobbyList: PT.shape().isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};
