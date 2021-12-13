/* eslint-disable react/no-this-in-sfc */
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PT from 'prop-types';
import moment from 'moment';
import { getRatingColor } from 'utils/tc';
import ReactSVG from 'react-svg';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';
import _ from 'lodash';


let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images', false, /svg/);
}

export default function Graph({ statisticsData, baseline, awardLine }) {
  const flatData = [];
  const dates = [];
  _.each(statisticsData, (entry) => {
    _.each(entry.submissions, (sub) => {
      dates.push(sub.created || null);
      flatData.push({
        ..._.omit(entry, ['submissions']),
        submissionCount: _.get(entry, 'submissions.length', 0),
        ...sub,
      });
    });
  });

  const options = {
    chart: {
      type: 'scatter',
    },
    title: {
      text: '',
    },
    series: [
      {
        data: _.map(flatData, data => ({
          x: moment(data.created).valueOf(),
          y: _.max([0, data.score ? (parseFloat(data.score)) : 0]),
          name: data.handle,
          color: data.ratingColor
            || getRatingColor(data.rating
            || 0),
          customData: data,
        })),
        pointStart: moment(_.min(dates)).valueOf(),
        pointInterval: 24 * 3600 * 1000,
      },
    ],
    legend: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      gridLineColor: '#f8f8f8',
      gridLineWidth: 100,
      gridZIndex: -100,
      dateTimeLabelFormats: {
        millisecond: '%m/%d',
        second: '%m/%d',
        minute: '%m/%d',
        hour: '%m/%d',
        day: '%m/%d',
        week: '%m/%d',
        month: '%m/%d',
        year: '%m/%d',
      },
    },
    yAxis: {
      max: 100,
      min: 0,
      tickInterval: 20,
      title: {
        enabled: false,
      },
      plotLines: [
        ...(awardLine > 0 ? [
          {
            label: {
              text: 'Award',
            },
            color: 'rgba(123, 188, 80, 0.5)',
            value: awardLine,
            width: 3,
          },
        ] : []),
        ...(baseline > 0 ? [
          {
            label: {
              text: 'Baseline',
            },
            color: 'rgba(78, 78, 78, 0.5)',
            value: baseline,
            width: 3,
          },
        ] : []),
        {
          color: 'rgba(51, 51, 51, 1)',
          value: 0,
          width: 3,
        },
      ],
      zIndex: 100,
    },
    tooltip: {
      formatter() {
        const str = `
          <div style="border-radius:4px;">
            ${this.point.customData.photoUrl
    ? `<img height="30" width="30" src="${this.point.customData.photoUrl}" style="position: absolute; border-radius: 50%;" />`
    : <ReactSVG path={assets('./ico-user-default.svg')} />}
            
            <p style="margin-left: 50px">${this.point.customData.handle}</p>
            <br />
            <p style="margin-left: 50px;">${this.point.customData.submissionCount} submissions</p>
            <p style="margin-left: 50px;">Score: ${this.y}</p>
            <p style="margin-left: 50px;">Submitted: ${moment(this.point.customData.created).format('MM/DD/YYYY')} </p>
          </div>
        `;
        return str;
      },
      useHTML: true,
      style: {
        color: '#fff',
      },
      backgroundColor: 'rgb(51,51,51)',
      shared: true,
    },
  };

  return (
    <div styleName="graph-container">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
}

Graph.defaultProps = {
  statisticsData: [],
  baseline: 0,
  awardLine: 0,
};

Graph.propTypes = {
  statisticsData: PT.arrayOf(PT.shape()),
  baseline: PT.number,
  awardLine: PT.number,
};
