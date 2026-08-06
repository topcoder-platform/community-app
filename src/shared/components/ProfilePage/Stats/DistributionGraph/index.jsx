/* eslint-env browser */
import d3 from 'd3';
import React from 'react';
import { toPairs } from 'lodash';
import PT from 'prop-types';
import { getRatingColor } from 'utils/tc';
import ChartTooltip from '../ChartTooltip';
// import styles from './index.scss';
import './index.scss';

const getRanges = distribution => (
  toPairs(distribution)
    .map(([name, number]) => {
      const [start, end] = name.match(/ratingRange(\d+)To(\d+)/).slice(1).map(rating => parseInt(rating, 10));
      return {
        name,
        number,
        start,
        end,
      };
    })
    .sort((a, b) => a.start - b.start)
);

const getNonZeroRanges = (ranges) => {
  let st = 0;
  while (ranges[st].number === 0) {
    st += 1;
  }
  let end = ranges.length - 1;
  while (end > st && ranges[end].number === 0) {
    end -= 1;
  }
  return ranges.slice(st, end + 1);
};

export default class DistributionGraph extends React.Component {
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
        || (this.mobileWidth !== DistributionGraph.getMobileWidthGrapthMeasurements()))) {
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
    const { distribution } = this.props;
    if (prevProps.distribution !== distribution) {
      this.draw();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandle);
  }

  static getMobileWidthGrapthMeasurements() {
    return window.innerWidth - 32;
  }

  draw() {
    const $scope = this;
    const { distribution: wrapper, rating, subTrack } = this.props;
    if (!wrapper) {
      return;
    }
    const { distribution } = wrapper;

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
        left: 0,
        bottom: 24,
        right: 0,
      },
    };

    d3.select($scope.graphRef.current).select('svg').remove();
    let { w, h } = $scope.desktop ? desktopMeasurements : mobileMeasurements;
    const { padding } = $scope.desktop ? desktopMeasurements : mobileMeasurements;
    if (!$scope.desktop) {
      w = DistributionGraph.getMobileWidthGrapthMeasurements();
      h = w * 240 / 288.0;
      this.mobileWidth = w;
    }
    const totalW = w + padding.left + padding.right;
    const totalH = h + padding.top + padding.bottom;

    const ranges = getNonZeroRanges(getRanges(distribution));

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
    /*
    const xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .ticks(ranges.length);
    const yAxis = ticks => d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .ticks(ticks);
    */
    const svg = d3.select($scope.graphRef.current)
      .append('svg')
      .attr('width', totalW)
      .attr('height', totalH);

    svg.append('rect')
      .attr('x', padding.left)
      .attr('y', padding.top)
      .attr('width', w)
      .attr('height', h)
      .attr('fill', '#ffffff');

    /*
    svg.append('g')
      .attr('class', styles.grid)
      .attr('transform', `translate(${padding.left},0)`)
      .call(yAxis(5).tickSize(-totalW, 0, 0).tickFormat(''));
      */

    /*
    svg.append('g')
      .attr('class', styles.axis)
      .attr('transform', `translate(${padding.left},0)`)
      .call(yAxis(5));
      */

    svg.append('line')
      .attr('x1', xScale2(rating))
      .attr('y1', totalH - padding.bottom)
      .attr('x2', xScale2(rating))
      .attr('y2', padding.top)
      .attr('stroke-width', 2)
      .attr('stroke', getRatingColor(rating));

    svg.selectAll('rect.bar')
      .data(ranges)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d.number))
      .attr('width', xScale.rangeBand())
      .attr('height', d => totalH - padding.bottom - yScale(d.number))
      .attr('fill', d => getRatingColor(d.start));

    const updateTooltipPosition = () => {
      const e = d3.mouse(document.getElementById('distribution-graph-container'));
      const profileModalContainerEl = document.querySelector('.ProfileModalContainer');
      const profileModalContainerRect = profileModalContainerEl
        ? profileModalContainerEl.getBoundingClientRect() : null;
      const graphEl = document.getElementById('distribution-graph-container');
      const graphRect = graphEl ? graphEl.getBoundingClientRect() : null;
      const tooltipElement = document.getElementById('chart-tooltip-distribution-graph');

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
        $scope.setState({
          challengeName: `${d.number} Coders`,
          challengeData: `Rating Range: ${d.start} - ${d.start + 99}`,
          rating: d.number,
          ratingColor: getRatingColor(d.start),
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
      .attr('stroke', d => getRatingColor(d.start));

    /*
    svg.append('g')
      .attr('class', styles.axis)
      .attr('transform', `translate(0,${(h + padding.top)})`)
      .call(xAxis)
      .selectAll('text')
      .attr('x', 9)
      .attr('y', 0)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(90)')
      .style('text-anchor', 'start')
      .text((d, i) => `${ranges[i].start} - ${ranges[i].end}`);
      */
  }

  render() {
    return (
      <div id="distribution-graph-container" styleName="distribution-graph" ref={this.graphRef}>
        <ChartTooltip id="distribution-graph" {...this.state} />
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
  subTrack: PT.string.isRequired,
};
