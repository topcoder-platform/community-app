/**
 * A block that fetches and renders a job details page
 * driven by recruitCRM
 */

import actions from 'actions/recruitCRM';
import LoadingIndicator from 'components/LoadingIndicator';
import GigDetails from 'components/Gigs/GigDetails';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

class RecruitCRMJobDetailsContainer extends React.Component {
  componentDidMount() {
    const {
      getJob,
      id,
    } = this.props;

    getJob(id);
  }

  render() {
    const {
      loading,
      job,
    } = this.props;

    if (loading) {
      return <LoadingIndicator />;
    }

    return <GigDetails job={job} />;
  }
}

RecruitCRMJobDetailsContainer.defaultProps = {
  job: {},
};

RecruitCRMJobDetailsContainer.propTypes = {
  getJob: PT.func.isRequired,
  loading: PT.bool.isRequired,
  job: PT.shape(),
  id: PT.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  const data = state.recruitCRM[ownProps.id];
  return {
    job: data ? data.job : {},
    loading: data ? data.loading : true,
  };
}

function mapDispatchToActions(dispatch) {
  const a = actions.recruit;
  return {
    getJob: (id) => {
      dispatch(a.getJobInit(id));
      dispatch(a.getJobDone(id));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(RecruitCRMJobDetailsContainer);
