/**
 * Demo container for the Data Fetch example.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import actions from 'actions/examples/data-fetch';
import { connect } from 'react-redux';

class DataFetch extends React.Component {
  componentDidMount() {
    if (!this.props.data && !this.props.loading) this.props.loadData();
  }

  render() {
    if (this.props.data) {
      return <pre>{JSON.stringify(this.props.data, null, 2)}</pre>;
    }
    if (this.props.loading) return <div>Loading...</div>;
    return <div>Initial State: no data, and not loading yet.</div>;
  }
}

export default connect(
  state => state.examples.dataFetch,
  dispatch => ({
    loadData: () => {
      dispatch(actions.examples.dataFetch.fetchDataInit());
      dispatch(actions.examples.dataFetch.fetchDataDone());
    },
  }),
)(DataFetch);

DataFetch.defaultProps = {
  data: null,
  loading: false,
  loadData: _.noop,
};

DataFetch.propTypes = {
  data: PT.arrayOf(PT.shape({})),
  loading: PT.bool,
  loadData: PT.func,
};
