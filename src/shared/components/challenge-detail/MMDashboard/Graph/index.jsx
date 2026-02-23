/* eslint-disable react/no-this-in-sfc */
import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PT from 'prop-types';
import moment from 'moment';
import { getHighlightedColor, getRatingColor, getUnSelectedColors } from 'utils/tc';
import DefaultUserImage from 'assets/images/ico-user-default.png';

import _ from 'lodash';
import styles from './styles.scss';

export default function Graph({ statisticsData, baseline, awardLine }) {
  const [point, setPoint] = useState(null);

  const flatData = [];
  const dates = [];
  _.each(statisticsData, (entry) => {
    _.each(entry.submissions, (sub) => {
      dates.push(sub.created || sub.createdAt || null);
      flatData.push({
        ..._.omit(entry, ['submissions']),
        submissionCount: _.get(entry, 'submissions.length', 0),
        ...sub,
      });
    });
  });

  const pointDatas = _.chain(flatData)
    .map((data) => {
      let color;
      let isSelected = false;
      if (point) {
        isSelected = point.customData.handle === data.handle;
        if (isSelected) {
          color = getHighlightedColor(data.rating || 0);
        } else {
          color = getUnSelectedColors(data.rating || 0);
        }
      } else {
        color = data.ratingColor || getRatingColor(data.rating || 0);
      }

      const score = parseFloat(data.score);
      const x = moment(data.created || data.createdAt).valueOf();
      const y = _.max([0, Number.isFinite(score) ? score : 0]);

      return {
        x,
        y,
        name: data.handle,
        color,
        customData: data,
        marker: {
          enabled: true,
          width: 'circle',
          radius: isSelected ? 6 : 4,
        },
        className: !isSelected && point ? styles.selectedPoint : '',
      };
    })
    .filter(pointData => Number.isFinite(pointData.x) && Number.isFinite(pointData.y))
    .value();

  const options = {
    plotOptions: {
      line: {
        events: {
          click() {
            this.group.toFront();
          },
        },
      },
    },
    chart: {
      type: 'scatter',
      backgroundColor: '#fff',
      events: {
        click: () => {
          setPoint(null);
        },
      },
    },
    title: {
      text: '',
    },
    series: [
      {
        data: pointDatas,
        turboThreshold: 0,
        pointStart: moment(_.min(dates)).valueOf(),
        pointInterval: 24 * 3600 * 1000,
        backgroundColor: 'rgb(51,51,51)',
        point: {
          events: {
            click: (e) => {
              if (e && e.point) {
                setPoint(e.point);
              }
            },
          },
        },
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
      backgroundColor: '#fff',
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
          color: '#fff',
          value: 0,
          width: 3,
        },
      ],
      zIndex: 100,
    },
    tooltip: {
      formatter() {
        const currentPointer = this.point || point;
        if (currentPointer) {
          const str = `
            <div style="border-radius:4px; padding-top: 15px; padding-left: 10px;">
              <img height="30" width="30" src="${currentPointer.customData.photoUrl || DefaultUserImage}" style="position: absolute; border-radius: 50%;" />
              <p style="margin-left: 50px">${currentPointer.customData.handle}</p>
              <br />
              <p style="margin-left: 50px;">${currentPointer.customData.submissionCount} submissions</p>
              <p style="margin-left: 50px;">Score: ${this.y}</p>
              <p style="margin-left: 50px;">Submitted: ${moment(currentPointer.customData.created || currentPointer.customData.createdAt).format('MM/DD/YYYY')} </p>
            </div>
          `;
          return str;
        }
        return false;
      },
      useHTML: true,
      style: {
        color: '#fff',
      },
      backgroundColor: point ? '#2e2e2e' : 'rgb(51,51,51)',
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
