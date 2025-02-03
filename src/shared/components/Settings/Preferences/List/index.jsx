/* eslint-disable jsx-a11y/label-has-for */
/**
 * Preferences
 * Forum and Payment preferences List
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import Item from './Item';
import data from './data';

const preferenceList = ({ paymentSetupCompleted }) => (
  <div>
    {
      _.map(data, (item) => {
        let itemLink;
        if (item.id !== 'payment' || paymentSetupCompleted === true) {
          itemLink = item.link;
        } else {
          itemLink = item.altLink;
        }

        return (
          <Item
            icon={item.icon}
            key={item.id}
            id={item.id}
            title={item.name}
            description={item.description}
            link={itemLink}
            linkTitle={item.linkTitle}
          />
        );
      })
    }
  </div>
);

export default preferenceList;

preferenceList.propTypes = {
  paymentSetupCompleted: PT.bool.isRequired,
};
