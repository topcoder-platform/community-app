/**
 * Container for HallOfFamePage Component.
 * Connects redux state for TCO Hall of Fame.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import actions from 'actions/page/hallOfFame';
import LoadingIndicator from 'components/LoadingIndicator';
import Error404 from 'components/Error404';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import HallOfFamePage from 'components/HallOfFamePage';
import ContentfulLoader from './ContentfulLoader';


class HallOfFameContainer extends React.Component {
  handleSelectEvent(eventType, eventId) {
    this.props.history.push(`/hall-of-fame/${eventType}/${eventId}`);
    this.props.setSelectedEvent(eventId);
    this.props.setSelectedEventType(eventType);
  }

  render() {
    if (this.props.selectedEvent === '') {
      if (this.props.match.params.eventId) {
        this.props.setSelectedEvent(this.props.match.params.eventId);
      }
    }
    if (this.props.selectedEventType) {
      this.props.setSelectedEventType(this.props.match.params.type);
    }

    const {
      selectedEventType,
    } = this.props;

    return (
      <ContentfulLoader
        entryQueries={{
          content_type: 'hallOfFame',
          'fields.title': selectedEventType,
          include: 10,
        }}
        render={(data) => {
          if (data.entries.matches[0].total > 0) {
            let hallOfFame = data.entries.matches[0].items[0];
            if (!hallOfFame) return null;
            const result = data.entries.items[hallOfFame];
            hallOfFame = result.fields;
            const verionsIds = _.map(hallOfFame.versions, item => (item.sys.id));
            return (
              <ContentfulLoader
                entryIds={verionsIds}
                preview={data.preview}
                render={(verionResult) => {
                  for (let i = 0; i !== verionsIds.length; i += 1) {
                    hallOfFame.versions[i].fields =
                      verionResult.entries.items[verionsIds[i]].fields;
                  }
                  return (
                    <HallOfFamePage
                      eventId={this.props.selectedEvent === '' ?
                        hallOfFame.versions[0].fields.versionId : this.props.selectedEvent}
                      onSelectEvent={(eventType, eventId) =>
                        this.handleSelectEvent(eventType, eventId)}
                      hallOfFame={hallOfFame}
                    />
                  );
                }}
                renderPlaceholder={LoadingIndicator}
              />
            );
          }
          return (<Error404 />);
        }}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }
}

HallOfFameContainer.defaultProps = {
  selectedEvent: '',
  selectedEventType: '',
};

HallOfFameContainer.propTypes = {
  selectedEvent: PT.string,
  selectedEventType: PT.string,
  setSelectedEvent: PT.func.isRequired,
  setSelectedEventType: PT.func.isRequired,
  match: PT.shape({
    params: PT.shape({
      eventId: PT.string,
      type: PT.string,
    }),
  }).isRequired,
  history: PT.shape().isRequired,
};

const mapStateToProps = state => ({
  selectedEvent: state.page.hallOfFame.selectedEvent,
  selectedEventType: state.page.hallOfFame.selectedEventType,
});

const mapDispatchToProps = dispatch => ({
  setSelectedEvent: eventId =>
    dispatch(actions.page.hallOfFame.setSelectedEvent(eventId)),
  setSelectedEventType: eventType =>
    dispatch(actions.page.hallOfFame.setSelectedEventType(eventType)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HallOfFameContainer);

export default withRouter(Container);
