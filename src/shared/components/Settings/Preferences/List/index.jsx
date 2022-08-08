/* eslint-disable jsx-a11y/label-has-for */
/**
 * Preferences
 * Forum and Payment preferences List
 */
import _ from 'lodash';
import React from 'react';
import Item from './Item';
import data from './data';

const preferenceList = () => (
  <div>
    {
      _.map(data, item => (
        <Item
          icon={item.icon}
          key={item.id}
          id={item.id}
          title={item.name}
          description={item.description}
          link={item.link}
          linkTitle={item.linkTitle}
        />
      ))
    }
  </div>
);

export default preferenceList;
