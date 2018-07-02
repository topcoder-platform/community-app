/**
 * A simple page that lists all published dashboard announcements, helping to
 * figure out their scheduled order.
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';

import Item from './Item';

import './style.scss';

export default function Announcements({
  announcements,
  loading,
}) {
  let content;
  if (loading) content = <LoadingIndicator />;
  else {
    const list = _.clone(announcements);
    list.sort((a, b) => moment(a.fields.startDate).diff(b.fields.startDate));

    const dateMap = {};

    const indexDate = (date, start) => {
      const d = moment(date).valueOf();
      if (!dateMap[d]) {
        dateMap[d] = {
          numSlots: 1,
          numStarts: 0,
          timestamp: d,
        };
      } else if (start) dateMap[d].numSlots += 1;
    };

    list.forEach((item) => {
      indexDate(item.fields.endDate);
      indexDate(item.fields.startDate, true);
    });

    let dates = _.values(dateMap);
    dates.sort((a, b) => a.timestamp - b.timestamp);

    let pos = 0;
    dates = dates.map((date) => {
      date.top = pos; // eslint-disable-line no-param-reassign
      pos += 102 * date.numSlots;
      return (
        <div
          key={date.timestamp}
          styleName="date"
          style={{
            top: date.top,
          }}
        >
          {moment(date.timestamp).toString()}
        </div>
      );
    });

    const levelEnds = [];
    const cards = list.map((item) => {
      const start = moment(item.fields.startDate).valueOf();
      const startObj = dateMap[start];
      const top = startObj.top + (102 * startObj.numStarts);
      startObj.numStarts += 1;

      const end = moment(item.fields.endDate).valueOf();
      const endObj = dateMap[end];
      const height = endObj.top - top;

      while (levelEnds.length && start > _.last(levelEnds)) levelEnds.pop();
      levelEnds.push(end);

      return (
        <Item
          height={height}
          item={item}
          key={item.sys.id}
          level={levelEnds.length - 1}
          top={top}
        />
      );
    });

    content = (
      <div styleName="content">
        {cards}
        {dates}
      </div>
    );
  }

  return (
    <div styleName="container">
      <h1>
Currently Published and Scheduled Dashboard Announcements
      </h1>
      {content}
    </div>
  );
}

Announcements.propTypes = {
  announcements: PT.arrayOf(PT.object).isRequired,
  loading: PT.bool.isRequired,
};
