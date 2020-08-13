/**
 * A block that fetches and renders a job listing page
 * driven by recruitCRM
 */

import actions from 'actions/recruitCRM';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

class RecruitCRMJobsContainer extends React.Component {
  componentDidMount() {
    const {
      getJobs,
      jobs,
    } = this.props;
    // Recruit API query stored in state
    this.state = {
      job_status: 1, // Open jobs
    };

    if (!jobs.data) {
      getJobs(this.state);
    }
  }

  render() {
    const {
      loading,
      jobs,
    } = this.props;

    if (loading) {
      return <LoadingIndicator />;
    }

    return null;
  }
}

RecruitCRMJobsContainer.defaultProps = {
  jobs: {},
};

RecruitCRMJobsContainer.propTypes = {
  getJobs: PT.func.isRequired,
  loading: PT.bool.isRequired,
  jobs: PT.shape(),
};

function mapStateToProps(state) {
  const data = state.recruitCRM;
  return {
    jobs: data ? data.jobs : {},
    loading: data ? data.loading : true,
  };
}

function mapDispatchToActions(dispatch) {
  const a = actions.recruit;
  return {
    getJobs: (ownProps) => {
      dispatch(a.getJobsInit(ownProps));
      dispatch(a.getJobsDone(ownProps));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(RecruitCRMJobsContainer);
