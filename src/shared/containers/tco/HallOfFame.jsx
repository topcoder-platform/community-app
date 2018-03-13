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

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.eventId !== nextProps.match.params.eventId) {
      nextProps.setSelectedEvent(nextProps.match.params.eventId);
    }
  }

  handleSelectEvent(eventId) {
    this.context.router.history.push(`/tco-hall-of-fame/${eventId}`);
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

HallOfFameContainer.contextTypes = {
  router: PT.object.isRequired,
};

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
