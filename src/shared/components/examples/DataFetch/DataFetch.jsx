/**
 * This component shows results of the Data Fetch example, both on the
 * routes supporting server-side data fetching and not.
 */

import _ from 'lodash';
import React, { PropTypes as PT } from 'react';

export default class DataFetch extends React.Component {
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
