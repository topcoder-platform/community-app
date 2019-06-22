/**
 * render ServiceProvider list
 */
import React from 'react';
import PT from 'prop-types';
import Item from './Item';

import './styles.scss';

export default function ServiceProviderList(props) {
  const {
    serviceProviderList,
    onDeleteItem,
    disabled,
    onEditItem,
  } = props;

  return (
    <div styleName={`container ${serviceProviderList.items.length > 0 ? 'active' : ''} ${disabled ? 'disabled' : ''}`}>
      <ul>
        {
          serviceProviderList.items.map((serviceProvider, index) => (
            <li key={`${serviceProvider.type}${index + 1}`}>
              <Item
                serviceProvider={serviceProvider}
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

ServiceProviderList.propTypes = {
  serviceProviderList: PT.shape().isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
  disabled: PT.bool,
};

ServiceProviderList.defaultProps = {
  disabled: false,
};
