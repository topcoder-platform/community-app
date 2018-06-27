/**
 * Container for HowToCompletePage Component.
 * Connects redux state for How to Complete Page of Track.
 */

import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import actions from 'actions/page/trackHomePages';
import HowToCompletePage from 'components/TrackHomePages/HowToCompletePage';
import LoadingIndicator from 'components/LoadingIndicator';
import Error404 from 'components/Error404';
import ContentfulLoader from '../ContentfulLoader';

class HowToCompletePageContainer extends React.Component {
  constructor(props) {
    super(props);

    if (props.match.params.track) {
      props.setSelectedTrack(props.match.params.track);
    }
  }

  render() {
    const { selectedTrack } = this.props;
    return (
      <ContentfulLoader
        entryQueries={{
          content_type: 'trackHowToCompete',
          'fields.track': selectedTrack,
          include: 10,
        }}
        render={(data) => {
          if (data.entries.matches[0].total > 0) {
            let howToComplete = data.entries.matches[0].items[0];
            if (!howToComplete) return null;
            const result = data.entries.items[howToComplete];
            howToComplete = result.fields;
            howToComplete.includes = data.includes;
            return (
              <ContentfulLoader
                preview={data.preview}
                render={() => (
                  <HowToCompletePage
                    howToComplete={howToComplete}
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

HowToCompletePageContainer.defaultProps = {
  selectedTrack: '',
};

HowToCompletePageContainer.propTypes = {
  selectedTrack: PT.string,
  setSelectedTrack: PT.func.isRequired,
  match: PT.shape({
    params: PT.shape({
      track: PT.string,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
  selectedTrack: state.page.trackHomePages.selectedTrack,
});

const mapDispatchToProps = dispatch => ({
  setSelectedTrack: track => dispatch(actions.page.trackHomePages.setSelectedTrack(track)),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(HowToCompletePageContainer);

export default withRouter(Container);
