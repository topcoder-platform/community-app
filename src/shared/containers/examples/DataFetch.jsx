/**
 * Demo container for the Data Fetch example.
 */

import actions from 'actions/examples/data-fetch';
import DataFetch from 'components/examples/DataFetch/DataFetch';
import { connect } from 'react-redux';

export default connect(
  state => state.examples.dataFetch,
  dispatch => ({
    loadData: () => {
      dispatch(actions.examples.dataFetch.fetchDataInit());
      dispatch(actions.examples.dataFetch.fetchDataDone());
    },
  }),
)(DataFetch);
