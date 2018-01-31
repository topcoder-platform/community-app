
import actions from 'actions/quality-assurance';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';


class TrackerListingContainer extends React.Component {
  componentDidMount() {
    this.props.loadRepositories();
  }

  render() {
    if (this.props.data.repositories) {
      return <div>Here :: {JSON.stringify(this.props.data.repositories, null, 2)}</div>;
    }
    if (this.props.data.loading) return <div>Loading...</div>;
    return <div>Initial State: no repositories, and not loading yet.</div>;
  }
}

export default connect(
  state => state.qualityAssurance,
  dispatch => ({
    loadRepositories: () => {
      dispatch(actions.qualityAssurance.getRepositoriesInit());
      dispatch(actions.qualityAssurance.getRepositoriesDone());
    },
  }),
)(TrackerListingContainer);

TrackerListingContainer.defaultProps = {
  data: null,
  loadRepositories: _.noop,
};

TrackerListingContainer.propTypes = {
  data: PT.object,
  loadRepositories: PT.func,
};