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
    const { data, loadData, loading } = this.props;
    if (!data && !loading) loadData();
  }

  render() {
    const { data, loading } = this.props;
    if (data) {
      return (
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      );
    }
    if (loading) {
      return (
        <div>
Loading...
        </div>
      );
    }
    return (
      <div>
Initial State: no data, and not loading yet.
      </div>
    );
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
