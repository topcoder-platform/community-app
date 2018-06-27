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


/**
 * Return entries with link data
 * @param {Array} entries contains all events data
 * @param {Object} includes contains all link data (Asset and Entry)
 * @returns {Array}
 */
function findIncludes(entries, includes) {
  const list = [];
  entries.forEach((item) => {
    const entry = _.assign({}, item);
    if (includes.Entry) {
      const result = _.filter(includes.Entry, e => e.sys.id === item.sys.id);
      if (result && result.length > 0) entry.fields = _.assign({}, result[0].fields);
    }

    if (includes.Asset) {
      const result = _.filter(includes.Asset, asset => asset.sys.id === item.sys.id);
      if (result && result.length > 0) entry.asset = _.assign({}, result[0].fields);
    }
    list.push(entry);
  });
  return list;
}

class HallOfFameContainer extends React.Component {
  constructor(props) {
    super(props);
    // This may be rendered server-side, in which case the reducer will have
    // set the eventId from the url
    if (props.selectedEvent === '') {
      if (props.match.params.eventId) {
        props.setSelectedEvent(props.match.params.eventId);
      }
    }
    if (props.match.params.type) {
      props.setSelectedEventType(props.match.params.type);
    }
  }

  handleSelectEvent(eventType, eventId) {
    const {
      history,
      setSelectedEvent,
      setSelectedEventType,
    } = this.props;
    history.push(`/hall-of-fame/${eventType}/${eventId}`);
    setSelectedEvent(eventId);
    setSelectedEventType(eventType);
  }

  render() {
    const {
      selectedEvent,
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
            hallOfFame.versions = findIncludes(hallOfFame.versions, data.includes);
            hallOfFame.includes = data.includes;
            return (
              <ContentfulLoader
                preview={data.preview}
                render={() => (
                  <HallOfFamePage
                    eventId={selectedEvent === ''
                      ? hallOfFame.versions[0].fields.versionId : selectedEvent}
                    onSelectEvent={
                      (eventType, eventId) => this.handleSelectEvent(eventType, eventId)}
                    hallOfFame={hallOfFame}
                  />
                )}
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
  setSelectedEvent: eventId => dispatch(actions.page.hallOfFame.setSelectedEvent(eventId)),
  setSelectedEventType:
    eventType => dispatch(actions.page.hallOfFame.setSelectedEventType(eventType)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HallOfFameContainer);

export default withRouter(Container);
