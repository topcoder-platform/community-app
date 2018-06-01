/* eslint-env browser */
import d3 from 'd3';
import React from 'react';
import { toPairs } from 'lodash';
import PT from 'prop-types';
import ChartTooltip from '../ChartTooltip';
import './index.scss';

const getRanges = distribution => (
  toPairs(distribution)
    .map(([name, number]) => ({
      name,
      number,
      start: parseInt(name.match(/\d+/)[0], 10),
      end: parseInt(name.match(/To(\d+)/)[1], 10),
    }))
    .sort((a, b) => a.start - b.start)
);

function removeLeadingZeroes(ranges) {
  while (ranges[0].number === 0) {
    ranges.shift();
  }
}

function removeTrailingZeroes(ranges) {
  while (ranges[ranges.length - 1].number === 0) {
    ranges.pop();
  }
}

function ratingToColor(colors, rating) {
  const filteredColors = colors.filter(color => rating >= color.start && rating <= color.end);
  return (filteredColors[0] && filteredColors[0].color) || 'black';
}

export default class DistributionGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.graphRef = React.createRef();
  }

  componentDidMount() {
    const $scope = this;
    $scope.desktop = window.innerWidth >= 900;
    this.draw();
    this.resizeHandle = () => {
      if (window.innerWidth < 900 && $scope.desktop) {
        $scope.desktop = false;
        this.draw();
      } else if (window.innerWidth >= 900 && !$scope.desktop) {
        $scope.desktop = true;
        this.draw();
      }
    };
    window.addEventListener('resize', this.resizeHandle);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.distribution !== this.props.distribution) {
      this.draw();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandle);
  }

  draw() {
    const $scope = this;
    const { distribution: wrapper, rating } = this.props;
    if (!wrapper) {
      return;
    }
    const { distribution } = wrapper;

    const colors = [
      // grey
      {
        color: '#9D9FA0',
        darkerColor: '#9D9FA0',
        start: 0,
        end: 899,
      },
      // green
      {
        color: '#69C329',
        darkerColor: '#69C329',
        start: 900,
        end: 1199,
      },
      // blue
      {
        color: '#616BD5',
        darkerColor: '#616BD5',
        start: 1200,
        end: 1499,
      },
      // yellow
      {
        color: '#FCD617',
        darkerColor: '#FCD617',
        start: 1500,
        end: 2199,
      },
      // red
      {
        color: '#EF3A3A',
        darkerColor: '#EF3A3A',
        start: 2200,
        end: Infinity,
      },
    ];

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
      w: 350,
      h: 200,
      padding: {
        top: 50,
        left: 60,
        bottom: 80,
        right: 50,
      },
    };

    d3.select($scope.graphRef.current).select('svg').remove();
    const { w, h, padding } = $scope.desktop ? desktopMeasurements : mobileMeasurements;
    const totalW = w + padding.left + padding.right;
    const totalH = h + padding.top + padding.bottom;

    const ranges = getRanges(distribution);
    removeLeadingZeroes(ranges);
    removeTrailingZeroes(ranges);
    const xScale = d3.scale.ordinal()
      .domain(d3.range(ranges.length))
      .rangeRoundBands([padding.left, padding.left + w], 0.05);
    const yScale = d3.scale.linear()
      .domain([0, d3.max(ranges, range => range.number) + 1])
      .range([totalH - padding.bottom, padding.top]);
    const xScale2 = d3.scale.linear()
      .domain([ranges[0].start,
        d3.max(ranges, range => range.end)])
      .range([padding.left, totalW - padding.right]);
    const xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .ticks(ranges.length);
    const yAxis = ticks => d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .ticks(ticks);
    const svg = d3.select($scope.graphRef.current)
      .append('svg')
      .attr('width', totalW)
      .attr('height', totalH);

    svg.append('rect')
      .attr('x', padding.left)
      .attr('y', padding.top)
      .attr('width', w)
      .attr('height', h)
      .attr('fill', '#f6f6f6');

    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${padding.left},0)`)
      .call(yAxis(5).tickSize(-totalW, 0, 0).tickFormat(''));

    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${padding.left},0)`)
      .call(yAxis(5));

    svg.append('line')
      .attr('x1', xScale2(rating))
      .attr('y1', totalH - padding.bottom)
      .attr('x2', xScale2(rating))
      .attr('y2', padding.top)
      .attr('class', 'my-rating')
      .attr('stroke-width', 2)
      .attr('stroke', ratingToColor(colors, rating));

    svg.selectAll('rect.bar')
      .data(ranges)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d.number))
      .attr('width', xScale.rangeBand())
      .attr('height', d => totalH - padding.bottom - yScale(d.number))
      .attr('fill', d => ratingToColor(colors, d.start));

    svg.selectAll('rect.hover')
      .data(ranges)
      .enter()
      .append('rect')
      .attr('class', 'hover')
      .attr('fill', 'transparent')
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d.number))
      .attr('width', xScale.rangeBand())
      .attr('height', d => totalH - padding.bottom - yScale(d.number))
      .on('mouseover', (d) => {
        const e = d3.event;
        $scope.setState({
          show: true,
          left: e.pageX,
          top: e.pageY,
          challengeName: `${d.number} Coders`,
          challengeData: `Rating Range: ${d.start} - ${d.start + 99}`,
          rating: d.number,
          ratingColor: ratingToColor(colors, d.start),
        });
      })
      .on('mousemove', () => {
        const e = d3.event;
        $scope.setState({
          show: true,
          left: e.pageX,
          top: e.pageY,
        });
      })
      .on('mouseout', () => {
        $scope.setState({
          show: false,
        });
      });

    svg.selectAll('line.xaxis')
      .data(ranges)
      .enter()
      .append('line')
      .attr('class', 'xaxis')
      .attr('x1', (d, i) => (
        (i === 0) ? padding.left : xScale(i) - 0.5
      ))
      .attr('x2', (d, i) => (
        i === ranges.length - 1
          ? totalW - padding.right
          : xScale(i) + xScale.rangeBand() + 0.5
      ))
      .attr('y1', h + padding.top + 0.5)
      .attr('y2', h + padding.top + 0.5)
      .attr('stroke', d => ratingToColor(colors, d.start));

    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${(h + padding.top)})`)
      .call(xAxis)
      .selectAll('text')
      .attr('x', 9)
      .attr('y', 0)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(90)')
      .style('text-anchor', 'start')
      .text((d, i) => `${ranges[i].start} - ${ranges[i].end}`);
  }

  render() {
    return (
      <div className="distribution-graph" ref={this.graphRef}>
        <ChartTooltip {...this.state} />
      </div>
    );
  }
}

DistributionGraph.defaultProps = {
  distribution: null,
};

DistributionGraph.propTypes = {
  distribution: PT.shape(),
  rating: PT.number.isRequired,
};
