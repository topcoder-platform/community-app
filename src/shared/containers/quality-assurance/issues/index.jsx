
import _ from 'lodash';
import actions from 'actions/quality-assurance/issues';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import QualityAssuranceIssues from 'components/quality-assurance/issues';

class QualityAssuranceIssuesContainer extends React.Component {
  componentDidMount() {
    const { match } = this.props;
    this.props.loadIssues(match.params.owner, match.params.repo);
  }

  render() {
    if (this.props.data.issues) {
      return (
        <div style={{ width: '100%' }}>
          <QualityAssuranceIssues issues={this.props.data.issues} />
        </div>
      );
    }
    if (this.props.data.loading) return <div>Loading Issues...</div>;
    return <div>Populating Issues...</div>;
  }
}

export default connect(
  state => state.qualityAssuranceIssues,
  dispatch => ({
    loadIssues: (owner, repo) => {
      dispatch(actions.qualityAssuranceIssues.getIssuesInit());
      dispatch(actions.qualityAssuranceIssues.getIssuesDone(owner, repo));
    },
  }),
)(QualityAssuranceIssuesContainer);

QualityAssuranceIssuesContainer.defaultProps = {
  data: {},
  loadIssues: _.noop,
  match: {
    params: {
      owner: null,
      repo: null,
    },
  },
};

QualityAssuranceIssuesContainer.propTypes = {
  data: PT.objectOf(PT.shape),
  loadIssues: PT.func,
  match: PT.shape({
    params: PT.shape({
      owner: PT.node,
      repo: PT.node,
    }).isRequired,
  }).isRequired,
};
