/* eslint-env browser */
import d3 from 'd3';
import moment from 'moment';
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import { getRatingColor } from 'utils/tc';
// import { RATING_COLORS } from 'utils/tc';
import ChartTooltip from '../ChartTooltip';
import styles from './index.scss';

export default class HistoryGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.mobileWidth = 0;
    this.graphRef = React.createRef();
  }

  componentDidMount() {
    const $scope = this;
    $scope.desktop = window.innerWidth >= 900;
    this.draw();
    this.resizeHandle = () => {
      if (window.innerWidth < 900
        && ($scope.desktop
        || (this.mobileWidth !== HistoryGraph.getMobileWidthGrapthMeasurements()))) {
        $scope.desktop = false;
        this.draw();
      } else if (window.innerWidth >= 900 && !$scope.desktop) {
        $scope.desktop = true;
        this.draw();
      }
    };
    window.addEventListener('resize', this.resizeHandle);
    this.bodyClickHandle = (event) => {
      if (event.target && event.target.tagName === 'circle') {
        return;
      }
      this.setState({ show: false });
    };
    document.body.addEventListener('click', this.bodyClickHandle);
  }

  componentDidUpdate(prevProps) {
    const { history } = this.props;
    if (prevProps.history !== history) {
      this.draw();
    }
  }

  componentWillUnmount() {
    // hide popup chart tooltip when go to another page
    this.setState({ show: false, href: '' });
    window.removeEventListener('resize', this.resizeHandle);
    document.body.removeEventListener('click', this.bodyClickHandle);
  }

  static getMobileWidthGrapthMeasurements() {
    return window.innerWidth - 32;
  }

  draw() {
    const $scope = this;
    const { history: wrapper, track, subTrack } = this.props;

    if (!wrapper) {
      return;
    }
    let { history } = wrapper;
    history = history ? history.map((_h) => {
      const h = { ..._h };
      if (h.rating) {
        h.newRating = h.rating;
      }
      if (h.date) {
        h.ratingDate = h.date;
      }
      h.ratingDate = new Date(h.ratingDate).toISOString();
      return h;
    }) : [];

    history.sort(({ ratingDate: d1 }, { ratingDate: d2 }) => moment(d1) - moment(d2));

    const parseDate = d3.time.format.utc('%Y-%m-%dT%H:%M:%S.%LZ').parse;

    const desktopMeasurements = {
      w: subTrack === 'SRM' ? 534 : 390,
      h: 344,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    };

    const mobileMeasurements = {
      w: 0,
      h: 240,
      padding: {
        top: 0,
        right: 0,
        bottom: 24,
        left: 0,
      },
    };

    d3.select($scope.graphRef.current).select('svg').remove();
    let { w, h } = $scope.desktop ? desktopMeasurements : mobileMeasurements;
    const { padding } = $scope.desktop ? desktopMeasurements : mobileMeasurements;
    if (!$scope.desktop) {
      w = HistoryGraph.getMobileWidthGrapthMeasurements();
      h = w * 240 / 288.0;
      this.mobileWidth = w;
    }
    // const totalH = h + padding.top + padding.bottom;

    const x = d3.time.scale()
      .range([padding.left + 5, (w + padding.left) - 5])
      .domain(d3.extent(history, d => parseDate(d.ratingDate)));

    const y = d3.scale.linear()
      .range([(h + padding.top) - 5, padding.top + 5])
      .domain(d3.extent(history, d => d.newRating));

    // if history is not present then show empty graph with some default x and y axis
    if (_.isEmpty(history)) {
      y.domain([1000, 1600]);
      const fromDate = d3.time.format.utc('%Y-%m-%dT%H:%M:%SZ').parse(moment().utc().subtract(2, 'years').format());
      const toDate = d3.time.format.utc('%Y-%m-%dT%H:%M:%SZ').parse(moment().utc().format());
      x.domain([fromDate, toDate]);
    }


    function yAxis(ticks) {
      return d3.svg.axis()
        .scale(y)
        .ticks(ticks || 10)
        .orient('left');
    }

    function xAxis(ticks) {
      return d3.svg.axis()
        .scale(x)
        .ticks(ticks || 10)
        .orient('bottom');
    }

    const line = d3.svg.line()
      .x(d => x(parseDate(d.ratingDate)))
      .y(d => y(d.newRating));


    const svg = d3.select($scope.graphRef.current).append('svg')
      .attr('width', w + padding.left + padding.right)
      .attr('height', h + padding.top + padding.bottom);

    svg.append('rect')
      .attr('x', padding.left)
      .attr('y', padding.top)
      .attr('width', w)
      .attr('height', h);


    /*
    svg.append('g')
      .attr('class', `${styles.x} ${styles.axis}`)
      .attr('transform', `translate(0,${h + padding.top})`)
      .call(xAxis().tickFormat((d) => {
        const m = moment(d);
        return m.format('MM') === '01'
          ? m.format('YYYY')
          : m.format('MMM').toUpperCase();
      }));
      */

    svg.selectAll(`g.${styles.x}.${styles.axis} .tick text`)
      .attr('font-weight', d => (moment(d).format('MM') === '01' ? 'bold' : 'normal'))
      .attr('fill', d => (moment(d).format('MM') === '01' ? 'black' : '#a3a3ad'))
      .attr('font-size', () => 11);


    /*
    svg.append('g')
      .attr('class', `${styles.y} ${styles.axis}`)
      .attr('transform', `translate(${padding.left - 25})`)
      .call(yAxis().tickFormat(d => `${parseInt(d, 10)}`));
      */

    svg.append('g')
      .attr('class', `${styles.x} ${styles.grid}`)
      .attr('transform', `translate(0,${h + padding.top})`)
      .call(xAxis().tickSize(-h, 0, 0).tickFormat(''));

    svg.append('g')
      .attr('class', `${styles.y} ${styles.grid}`)
      .attr('transform', `translate(${padding.left},0)`)
      .call(yAxis().tickSize(-w, 0, 0).tickFormat(''));


    svg.append('path')
      .datum(history)
      .attr('class', styles.line)
      .attr('d', line);

    /*
    function processRatingStripePoint(_y) {
      if (_y < padding.top || Number.isNaN(_y)) {
        return padding.top;
      } if (_y > totalH - padding.bottom) {
        return totalH - padding.bottom;
      }
      return _y;
    }
    */

    function getChallengeLink(challengeId) {
      if (track === 'DEVELOP') {
        return `/challenges/${challengeId}`;
      }
      if (track === 'DATA_SCIENCE') {
        if (subTrack === 'MARATHON_MATCH') {
          return `${config.URL.CHALLENGES_URL}/${challengeId}`;
        }
        if (subTrack === 'SRM') {
          return `${config.URL.COMMUNITY}/stat?c=round_overview&rd=${challengeId}`;
        }
      }
      return null;
    }

    /*
    svg.append('g')
      .selectAll('line')
      .data(RATING_COLORS)
      .enter()
      .append('line')
      .attr('x1', padding.left - 18)
      .attr('x2', padding.left - 18)
      .attr('y1', (d, i) => processRatingStripePoint(y(i === 0 ? 0 : RATING_COLORS[i - 1].limit)))
      .attr('y2', d => processRatingStripePoint(y(d.limit - 1)))
      .attr('stroke', d => d.color)
      .attr('stroke-width', 3);
      */

    const updateTooltipPosition = () => {
      const e = d3.mouse(document.getElementById('history-graph-container'));
      const profileModalContainerEl = document.querySelector('.ProfileModalContainer');
      const profileModalContainerRect = profileModalContainerEl
        ? profileModalContainerEl.getBoundingClientRect() : null;
      const graphEl = document.getElementById('history-graph-container');
      const graphRect = graphEl ? graphEl.getBoundingClientRect() : null;
      const tooltipElement = document.getElementById('chart-tooltip-history-graph');

      let cx = e[0];
      let cy = e[1];
      const defaultWidth = 320;
      const defaultHeight = 115;
      if (tooltipElement) {
        const { clientWidth, clientHeight } = tooltipElement;
        cx -= ((clientWidth || defaultWidth) / 2);
        cy += 15;

        if (graphRect && profileModalContainerRect) {
          const minLeft = profileModalContainerRect.x - graphRect.x;
          const minTop = profileModalContainerRect.y - graphRect.y;
          const maxRight = profileModalContainerRect.width + minLeft;
          const maxBottom = profileModalContainerRect.height + minTop;
          const minXTooltipPosition = minLeft;
          const maxXTooltipPosition = maxRight - (clientWidth || defaultWidth);
          const minYTooltipPosition = minTop;
          const maxYTooltipPosition = maxBottom - (clientHeight || defaultHeight);
          if (cx < minXTooltipPosition) {
            cx = minXTooltipPosition;
          }
          if (cx > maxXTooltipPosition) {
            cx = maxXTooltipPosition;
          }
          if (cy < minYTooltipPosition) {
            cy = minYTooltipPosition;
          }
          if (cy > maxYTooltipPosition) {
            cy = maxYTooltipPosition;
          }
        }
      }

      $scope.setState({
        show: true,
        left: cx,
        top: cy,
      });
    };

    svg.selectAll('circle')
      .data(history)
      .enter()
      .append('circle')
      .attr('cx', d => x(parseDate(d.ratingDate)))
      .attr('cy', d => y(d.newRating))
      .attr('r', 5.5)
      .attr('fill', d => getRatingColor(d.newRating))
      .on('mouseover', (d) => {
        $scope.setState({
          challengeName: d.challengeName,
          challengeData: moment(d.ratingDate).format('MMM DD, YYYY'),
          rating: d.newRating,
          ratingColor: getRatingColor(d.newRating),
          href: getChallengeLink(d.challengeId),
        });

        updateTooltipPosition();
      })
      .on('mousemove', () => {
        updateTooltipPosition();
      })
      .on('mouseout', () => {
        $scope.setState({
          show: false,
        });
      });
  }

  render() {
    return (
      <div id="history-graph-container" styleName="history-graph" ref={this.graphRef}>
        <ChartTooltip id="history-graph" {...this.state} />
      </div>
    );
  }
}

HistoryGraph.defaultProps = {
  history: null,
  track: null,
  subTrack: null,
};

HistoryGraph.propTypes = {
  history: PT.shape(),
  track: PT.string,
  subTrack: PT.string,
};
