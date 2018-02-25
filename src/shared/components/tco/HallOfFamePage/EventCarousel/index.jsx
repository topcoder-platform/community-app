/**
 * Carousel that shows the logos of all the TCO events and allows a user to scroll
 * through and select one.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { events } from 'utils/hall-of-fame';

import ArrowNext from 'assets/images/arrow-next.svg';
import ArrowPrev from 'assets/images/arrow-prev.svg';

import './styles.scss';

class EventCarousel extends React.Component {
  constructor(props) {
    super(props);

    // Ensure that a range is selected such that the initial selected event is shown on the carousel
    // and that there are always at least maxAtOnce items shown.
    const eventIndex = _.findIndex(events, ({ id: props.eventId }));
    const firstIndex = (events.length - eventIndex) < props.maxAtOnce ?
      events.length - props.maxAtOnce : eventIndex;

    this.state = {
      firstIndex,
    };
  }

  render() {
    const { eventId, maxAtOnce, onSelectEvent } = this.props;
    const { firstIndex } = this.state;

    return (
      <div styleName="container">
        <div styleName="arrow-wrapper">
          <a
            onClick={() => this.setState({ firstIndex: firstIndex - 1 })}
            role="button"
            styleName={`arrow ${firstIndex > 0 ? 'active' : ''}`}
            tabIndex={0}
          ><ArrowPrev /></a>
        </div>
        {
          _.map(events.slice(firstIndex, firstIndex + maxAtOnce), ({ data, id }) => (
            <a
              onClick={() => onSelectEvent(id)}
              key={id}
              role="link"
              styleName={`logo ${id === eventId ? 'active' : ''}`}
              tabIndex={0}
            >
              <img
                src={data.logo}
                alt={`Logo for TCO${id}`}
              />
            </a>
          ))
        }
        <div styleName="arrow-wrapper">
          <a
            onClick={() => this.setState({ firstIndex: firstIndex + 1 })}
            role="button"
            styleName={`arrow ${firstIndex < events.length - maxAtOnce ? 'active' : ''}`}
            tabIndex={0}
          ><ArrowNext /></a>
        </div>
      </div>
    );
  }
}

EventCarousel.defaultProps = {
  maxAtOnce: 6,
  onSelectEvent: _.noop,
};

EventCarousel.propTypes = {
  eventId: PT.string.isRequired,
  maxAtOnce: PT.number,
  onSelectEvent: PT.func,
};

export default EventCarousel;
