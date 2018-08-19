/* eslint-env browser */
import d3 from 'd3';
import moment from 'moment';
import React from 'react';
import PT from 'prop-types';
import { getRatingColor, RATING_COLORS } from 'utils/tc';
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
    this.bodyClickHandle = () => this.setState({ show: false, href: '' });
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
    if (window.innerWidth < 400) {
      return 200;
    }
    return 300;
  }

  draw() {
    const $scope = this;
    const { history: wrapper } = this.props;
    if (!wrapper) {
      return;
    }
    let { history } = wrapper;
    history = history.map((_h) => {
      const h = { ..._h };
      if (h.rating) {
        h.newRating = h.rating;
      }
      if (h.date) {
        h.ratingDate = h.date;
      }
      return h;
    });

    history.sort(({ ratingDate: d1 }, { ratingDate: d2 }) => moment(d1) - moment(d2));

    const parseDate = d3.time.format.utc('%Y-%m-%dT%H:%M:%S.%LZ').parse;

    const desktopMeasurements = {
      w: 835,
      h: 400,
      padding: {
        top: 20,
        right: 5,
        bottom: 100,
        left: 60,
      },
    };

    const mobileMeasurements = {
      w: 0,
      h: 200,
      padding: {
        top: 10,
        right: 30,
        bottom: 50,
        left: 60,
      },
    };

    d3.select($scope.graphRef.current).select('svg').remove();
    let { w } = $scope.desktop ? desktopMeasurements : mobileMeasurements;
    const { h, padding } = $scope.desktop ? desktopMeasurements : mobileMeasurements;
    if (!$scope.desktop) {
      w = HistoryGraph.getMobileWidthGrapthMeasurements();
      this.mobileWidth = w;
    }
    const totalH = h + padding.top + padding.bottom;

    const x = d3.time.scale()
      .range([padding.left + 5, (w + padding.left) - 5])
      .domain(d3.extent(history, d => parseDate(d.ratingDate)));

    const y = d3.scale.linear()
      .range([(h + padding.top) - 5, padding.top + 5])
      .domain(d3.extent(history, d => d.newRating));


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


    svg.append('g')
      .attr('class', `${styles.x} ${styles.axis}`)
      .attr('transform', `translate(0,${h + padding.top})`)
      .call(xAxis().tickFormat((d) => {
        const m = moment(d);
        return m.format('MM') === '01'
          ? m.format('YYYY')
          : m.format('MMM').toUpperCase();
      }));

    svg.selectAll(`g.${styles.x}.${styles.axis} .tick text`)
      .attr('font-weight', d => (moment(d).format('MM') === '01' ? 'bold' : 'normal'))
      .attr('fill', d => (moment(d).format('MM') === '01' ? 'black' : '#a3a3ad'))
      .attr('font-size', () => 11);


    svg.append('g')
      .attr('class', `${styles.y} ${styles.axis}`)
      .attr('transform', `translate(${padding.left - 25})`)
      .call(yAxis().tickFormat(d => `${parseInt(d, 10)}`));

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

    function processRatingStripePoint(_y) {
      if (_y < padding.top || Number.isNaN(_y)) {
        return padding.top;
      } if (_y > totalH - padding.bottom) {
        return totalH - padding.bottom;
      }
      return _y;
    }

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

    svg.selectAll('circle')
      .data(history)
      .enter()
      .append('circle')
      .attr('cx', d => x(parseDate(d.ratingDate)))
      .attr('cy', d => y(d.newRating))
      .attr('r', 5.5)
      .attr('fill', d => getRatingColor(d.newRating))
      .on('mouseover', (d) => {
        const e = d3.event;
        $scope.setState({
          show: true,
          left: e.pageX,
          top: e.pageY,
          challengeName: d.challengeName,
          challengeData: moment(d.ratingDate).format('MMM DD, YYYY'),
          rating: d.newRating,
          ratingColor: getRatingColor(d.newRating),
          challengeId: d.challengeId,
        });
      });
  }

  render() {
    return (
      <div styleName="history-graph" ref={this.graphRef}>
        <ChartTooltip {...this.state} />
      </div>
    );
  }
}

HistoryGraph.defaultProps = {
  history: null,
};

HistoryGraph.propTypes = {
  history: PT.shape(),
};
