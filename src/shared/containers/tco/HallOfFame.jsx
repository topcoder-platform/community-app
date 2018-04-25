/**
 * Container for HallOfFamePage Component.
 * Connects redux state for TCO Hall of Fame.
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { events } from 'utils/hall-of-fame';

import actions from 'actions/page/hallOfFame';

import HallOfFamePage from 'components/tco/HallOfFamePage';

class HallOfFameContainer extends React.Component {
  constructor(props) {
    super(props);

    // This may be rendered server-side, in which case the reducer will have
    // set the eventId from the url
    if (!props.selectedEvent) {
      props.setSelectedEvent(props.match.params.eventId || events[0].id);
    }
  }

  handleSelectEvent(eventId) {
    this.props.history.push(`/hall-of-fame/tco/${eventId}`);
    this.props.setSelectedEvent(eventId);
  }

  render() {
    return this.props.selectedEvent ? (
      <HallOfFamePage
        eventId={this.props.selectedEvent}
        onSelectEvent={eventId => this.handleSelectEvent(eventId)}
      />
    ) : <div />;
  }
}

HallOfFameContainer.defaultProps = {
  selectedEvent: '',
};

HallOfFameContainer.propTypes = {
  selectedEvent: PT.string,
  setSelectedEvent: PT.func.isRequired,
  match: PT.shape({
    params: PT.shape({
      eventId: PT.string,
    }),
  }).isRequired,
  history: PT.shape().isRequired,
};

const mapStateToProps = state => ({
  selectedEvent: state.page.hallOfFame.selectedEvent,
});

const mapDispatchToProps = dispatch => ({
  setSelectedEvent: eventId => dispatch(actions.page.hallOfFame.setSelectedEvent(eventId)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HallOfFameContainer);

export default withRouter(Container);
