import React from 'react';
import PT from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { useMediaQuery } from 'react-responsive';

import BulletIcon from 'assets/images/timeline/bullet-point.svg';

import { getAccentColor } from 'utils/timeline';

import './styles.scss';
import Card from '../Card';

const Timeline = ({ events, onSelectAsset }) => {
  const desktop = useMediaQuery({ minWidth: 1024 });

  return (
    <VerticalTimeline
      layout={desktop ? '2-columns' : '1-column-left'}
      animate={false}
      className="timeline"
    >
      {
        events.map((event, index) => (
          <VerticalTimelineElement
            key={uuidv4()}
            icon={<BulletIcon style={{ svg: { circle: { fill: getAccentColor(index) } } }} />}
            contentStyle={{ borderTop: `3px solid ${getAccentColor(index)}` }}
          >
            <Card
              event={event}
              onSelectAsset={onSelectAsset}
            />
          </VerticalTimelineElement>
        ))
      }
    </VerticalTimeline>
  );
};

Timeline.defaultProps = {
  events: [],
};

Timeline.propTypes = {
  events: PT.arrayOf(PT.shape()),
  onSelectAsset: PT.func.isRequired,
};

export default Timeline;
