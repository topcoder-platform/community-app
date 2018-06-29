/**
 * Carousel that shows the logos of all the TCO events and allows a user to click
 * through and select one.  Mobile mode renders a scrollable div with all events.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import ArrowNext from 'assets/images/arrow-next.svg';
import ArrowPrev from 'assets/images/arrow-prev.svg';

import './styles.scss';

class EventCarousel extends React.Component {
  constructor(props) {
    super(props);

    // Ensure that a range is selected such that the initial selected event is shown on the carousel
    // and that there are always at least maxAtOnce items shown.
    const eventIndex =
      _.findIndex(this.props.events.list, event => event.versionId === this.props.eventId);
    const firstIndex = (this.props.events.list.length - eventIndex) < props.maxAtOnce ?
      this.props.events.list.length - props.maxAtOnce : eventIndex;

    this.state = {
      firstIndex,
    };
  }

  componentDidMount() {
    // This will scroll the event list to the active event when in mobile.
    // Does nothing in desktop mode.
    const eventIndex =
      _.findIndex(this.props.events.list, event => event.versionId === this.props.eventId);
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
          _.map(this.props.events.list, (event, index) => {
            const { fields, versionId } = event;
            const hidden = index < firstIndex || index >= firstIndex + maxAtOnce;
            // We need to render 'hidden' events to the dom in desktop mode
            // because they all need to be rendered in mobile mode
            // for the scrollable div. If we don't, there will be a
            // mismatch with the server-side rendered dom that will
            // cause issues.
            return (
              <a
                onClick={() => onSelectEvent(this.props.eventType, fields.versionId)}
                onKeyPress={() => onSelectEvent(this.props.eventType, versionId)}
                key={fields.versionId}
                role="link"
                styleName={`logo ${fields.versionId === eventId ? 'active' : ''} ${hidden ? 'hidden' : ''}`}
                tabIndex={0}
              >
                <img
                  src={fields.promo.fields.logo.fields.file.url}
                  alt={`Logo for TCO${fields.versionId}`}
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
            styleName={`arrow ${firstIndex < this.props.events.list.length - maxAtOnce ? 'active' : ''}`}
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
  events: PT.shape().isRequired,
  eventType: PT.string.isRequired,
};

export default EventCarousel;
