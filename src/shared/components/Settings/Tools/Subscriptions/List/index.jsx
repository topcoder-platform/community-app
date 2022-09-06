/**
 * render Subscription list
 */
import React from 'react';
import PT from 'prop-types';
import Item from './Item';

import './styles.scss';

export default function SubscriptionList(props) {
  const {
    subscriptionList,
    onDeleteItem,
    onEditItem,
  } = props;

  return (
    <div styleName="container">
      <ul>
        {
          subscriptionList.items.map((subscription, index) => (
            <li key={`${subscription.type}${index + 1}`}>
              <Item
                subscription={subscription}
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

SubscriptionList.propTypes = {
  subscriptionList: PT.shape().isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};

SubscriptionList.defaultProps = {
};
