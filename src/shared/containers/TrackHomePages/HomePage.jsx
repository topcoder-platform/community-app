/**
 * Container for HomePage Component.
 * Connects redux state for Home Page of Track.
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import actions from 'actions/page/trackHomePages';
import HomePage from 'components/TrackHomePages/HomePage';
import LoadingIndicator from 'components/LoadingIndicator';
import Error404 from 'components/Error404';
import ContentfulLoader from '../ContentfulLoader';


class HomePageContainer extends React.Component {
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
          content_type: 'trackHomepage',
          'fields.track': selectedTrack,
          include: 10,
        }}
        render={(data) => {
          if (data.entries.matches[0].total > 0) {
            let homePage = data.entries.matches[0].items[0];
            if (!homePage) return null;
            const result = data.entries.items[homePage];
            homePage = result.fields;
            homePage.includes = data.includes;
            return (
              <ContentfulLoader
                preview={data.preview}
                render={() => (
                  <HomePage
                    homePage={homePage}
                    auth={this.props.auth}
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

HomePageContainer.defaultProps = {
  selectedTrack: '',
};

HomePageContainer.propTypes = {
  auth: PT.shape({
    profile: PT.shape(),
    tokenV3: PT.string,
    user: PT.shape(),
  }).isRequired,
  selectedTrack: PT.string,
  setSelectedTrack: PT.func.isRequired,
  match: PT.shape({
    params: PT.shape({
      track: PT.string,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  selectedTrack: state.page.trackHomePages.selectedTrack,
});

const mapDispatchToProps = dispatch => ({
  setSelectedTrack: track =>
    dispatch(actions.page.trackHomePages.setSelectedTrack(track)),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);

export default withRouter(Container);
