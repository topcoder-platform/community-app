
import _ from 'lodash';
import actions from 'actions/quality-assurance';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import QualityAssuranceListing from 'components/quality-assurance';

class QualityAssuranceContainer extends React.Component {
  componentDidMount() {
    this.props.loadRepositories();
  }

  render() {
    if (this.props.data.repositories) {
      return (
        <div style={{ width: '100%' }}>
          <QualityAssuranceListing repositories={this.props.data.repositories} />
        </div>
      );
    }
    if (this.props.data.loading) return <div>Loading Repositories...</div>;
    return <div>Populating Repositories...</div>;
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
)(QualityAssuranceContainer);

QualityAssuranceContainer.defaultProps = {
  data: {},
  loadRepositories: _.noop,
};

QualityAssuranceContainer.propTypes = {
  data: PT.objectOf(PT.shape),
  loadRepositories: PT.func,
};
