/**
 * Carousel that shows the logos of all the TCO events and allows a user to click
 * through and select one.  Mobile mode renders a scrollable div with all events.
 */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import React from 'react';
import PT from 'prop-types';
import { Link } from 'topcoder-react-utils';

import ArrowNext from 'assets/images/arrow-next.svg';
import ArrowPrev from 'assets/images/arrow-prev.svg';

import './styles.scss';

class EventCarousel extends React.Component {
  constructor(props) {
    super(props);

    // Ensure that a range is selected such that the initial selected event is shown on the carousel
    // and that there are always at least maxAtOnce items shown.
    const eventIndex = _.findIndex(props.events.list, event => event.versionId === props.eventId);
    const firstIndex = (props.events.list.length - eventIndex) < props.maxAtOnce
      ? props.events.list.length - props.maxAtOnce : eventIndex;

    this.state = {
      firstIndex,
    };
  }

  componentDidMount() {
    const {
      eventId,
      events,
    } = this.props;
    // This will scroll the event list to the active event when in mobile.
    // Does nothing in desktop mode.
    const eventIndex = _.findIndex(events.list, event => event.versionId === eventId);
    this.node.scrollLeft = (88 * (eventIndex - 1)) + 20;
  }

  render() {
    const {
      eventId,
      eventType,
      events,
      maxAtOnce,
    } = this.props;
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
          >
            <ArrowPrev />
          </a>
        </div>
        {
          _.map(events.list, (event, index) => {
            const { fields } = event;
            const hidden = index < firstIndex || index >= firstIndex + maxAtOnce;
            const logoId = fields.promo.fields.logo.sys.id;
            // We need to render 'hidden' events to the dom in desktop mode
            // because they all need to be rendered in mobile mode
            // for the scrollable div. If we don't, there will be a
            // mismatch with the server-side rendered dom that will
            // cause issues.
            return (
              <Link
                to={`/community/hall-of-fame/${eventType}/${fields.versionId}`}
                key={fields.versionId}
                styleName={`logo ${fields.versionId === eventId ? 'active' : ''} ${hidden ? 'hidden' : ''}`}
              >
                {
                  /*
                    TODO: This is sub-optimal to use separate ContentfulLoader
                    for each logo. Entire list of logos should be figured out
                    higher in the components tree and loaded with a single
                    ContentfulLoader. However, the way code is structured now
                    makes such update difficult, thus just a hot fix for now.
                  */
                }
                <ContentfulLoader
                  assetIds={logoId}
                  render={(data) => {
                    const logo = data.assets.items[logoId];
                    const { url } = logo.fields.file;
                    return (
                      <img
                        src={url}
                        alt={`Logo for TCO${fields.versionId}`}
                      />
                    );
                  }}
                />
              </Link>
            );
          })
        }
        <div styleName="arrow-wrapper">
          <a
            onClick={() => this.setState({ firstIndex: firstIndex + 1 })}
            onKeyPress={() => this.setState({ firstIndex: firstIndex + 1 })}
            role="button"
            styleName={`arrow ${firstIndex < events.list.length - maxAtOnce ? 'active' : ''}`}
            tabIndex={0}
          >
            <ArrowNext />
          </a>
        </div>
      </div>
    );
  }
}

EventCarousel.defaultProps = {
  maxAtOnce: 6,
};

EventCarousel.propTypes = {
  eventId: PT.string.isRequired,
  maxAtOnce: PT.number,
  events: PT.shape().isRequired,
  eventType: PT.string.isRequired,
};

export default EventCarousel;
