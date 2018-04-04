/**
 * Carousel that shows the logos of all the TCO events and allows a user to click
 * through and select one.  Mobile mode renders a scrollable div with all events.
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

  componentDidMount() {
    // This will scroll the event list to the active event when in mobile.
    // Does nothing in desktop mode.
    const eventIndex = _.findIndex(events, ({ id: this.props.eventId }));
    this.node.scrollLeft = (88 * (eventIndex - 1)) + 20;
  }

  render() {
    const { eventId, maxAtOnce, onSelectEvent } = this.props;
    const { firstIndex } = this.state;

    return (
      <div styleName="container" ref={(node) => { this.node = node; }}>
        <div styleName="arrow-wrapper">
          <a
            onClick={() => this.setState({ firstIndex: firstIndex - 1 })}
            onKeyPress={() => this.setState({ firstIndex: firstIndex - 1 })}
            role="button"
            styleName={`arrow ${firstIndex > 0 ? 'active' : ''}`}
            tabIndex={0}
          ><ArrowPrev />
          </a>
        </div>
        {
          _.map(events, (event, index) => {
            const { data, id } = event;
            const hidden = index < firstIndex || index >= firstIndex + maxAtOnce;
            // We need to render 'hidden' events to the dom in desktop mode
            // because they all need to be rendered in mobile mode
            // for the scrollable div. If we don't, there will be a
            // mismatch with the server-side rendered dom that will
            // cause issues.
            return (
              <a
                onClick={() => onSelectEvent(id)}
                onKeyPress={() => onSelectEvent(id)}
                key={id}
                role="link"
                styleName={`logo ${id === eventId ? 'active' : ''} ${hidden ? 'hidden' : ''}`}
                tabIndex={0}
              >
                <img
                  src={data.logo}
                  alt={`Logo for TCO${id}`}
                />
              </a>
            );
          })
        }
        <div styleName="arrow-wrapper">
          <a
            onClick={() => this.setState({ firstIndex: firstIndex + 1 })}
            onKeyPress={() => this.setState({ firstIndex: firstIndex + 1 })}
            role="button"
            styleName={`arrow ${firstIndex < events.length - maxAtOnce ? 'active' : ''}`}
            tabIndex={0}
          ><ArrowNext />
          </a>
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
