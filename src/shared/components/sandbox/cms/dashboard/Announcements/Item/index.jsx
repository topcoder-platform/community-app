import moment from 'moment-timezone';
import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function Item({
  height,
  item,
  level,
  top,
}) {
  const {
    endDate,
    startDate,
    title,
  } = item.fields;
  return (
    <a
      href={`/community-app-assets/api/edit-contentful-entry/${item.sys.id}`}
      styleName="container"
      style={{
        left: 250 + (20 * level),
        minHeight: height,
        right: 20 * level,
        top,
      }}
      target="_blank"
    >
      <h1 styleName="title">{title}</h1>
      <div>Start Date: {moment(startDate).toString()}</div>
      <div>End Date: {moment(endDate).toString()}</div>
    </a>
  );
}

Item.propTypes = {
  height: PT.number.isRequired,
  item: PT.shape({
    endDate: PT.string.isRequired,
    startDate: PT.string.isRequired,
    title: PT.string.isRequired,
  }).isRequired,
  level: PT.number.isRequired,
  top: PT.number.isRequired,
};
