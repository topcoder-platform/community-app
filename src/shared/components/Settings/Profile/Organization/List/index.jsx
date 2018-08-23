/**
 * render Organization list
 */
import React from 'react';
import PT from 'prop-types';
import Item from './Item';

import './styles.scss';

export default function OrganizationList(props) {
  const {
    organizationList,
    onDeleteItem,
  } = props;

  return (
    <div styleName={`container ${organizationList.items.length > 0 ? 'active' : ''}`}>
      <ul>
        {
          organizationList.items.map((organization, index) => (
            <li key={`${organization.name}${index + 1}`}>
              <Item organization={organization} index={index} onDeleteItem={onDeleteItem} />
            </li>
          ))
        }
      </ul>
    </div>
  );
}

OrganizationList.propTypes = {
  organizationList: PT.shape().isRequired,
  onDeleteItem: PT.func.isRequired,
};
