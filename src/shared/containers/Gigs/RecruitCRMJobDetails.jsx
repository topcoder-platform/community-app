/**
 * A block that fetches and renders a job details page
 * driven by recruitCRM
 */

import { isEmpty } from 'lodash';
import actions from 'actions/recruitCRM';
import LoadingIndicator from 'components/LoadingIndicator';
import GigDetails from 'components/Gigs/GigDetails';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import RecruitCRMJobApply from './RecruitCRMJobApply';

class RecruitCRMJobDetailsContainer extends React.Component {
  componentDidMount() {
    const {
      getJob,
      id,
      job,
    } = this.props;

    if (isEmpty(job)) {
      getJob(id);
    }
  }

  render() {
    const {
      loading,
      job,
      isApply,
      application,
      profile,
    } = this.props;

    if (loading) {
      return <LoadingIndicator />;
    }

    return isApply
      ? <RecruitCRMJobApply job={job} />
      : (
        <GigDetails
          job={job}
          application={application}
          profile={profile}
        />
      );
  }
}

RecruitCRMJobDetailsContainer.defaultProps = {
  job: {},
  application: null,
  profile: {},
};

RecruitCRMJobDetailsContainer.propTypes = {
  getJob: PT.func.isRequired,
  loading: PT.bool.isRequired,
  job: PT.shape(),
  id: PT.string.isRequired,
  isApply: PT.bool.isRequired,
  application: PT.shape(),
  profile: PT.shape(),
};

function mapStateToProps(state, ownProps) {
  const data = state.recruitCRM[ownProps.id];
  const profile = state.auth && state.auth.profile ? { ...state.auth.profile } : {};
  return {
    job: data ? data.job : {},
    loading: data ? data.loading : true,
    application: data ? data.application : null,
    profile,
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
