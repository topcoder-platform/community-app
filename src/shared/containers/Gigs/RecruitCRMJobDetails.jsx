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
import { config } from 'topcoder-react-utils';
import fetch from 'isomorphic-fetch';
import RecruitCRMJobApply from './RecruitCRMJobApply';

const PROXY_ENDPOINT = `${config.URL.COMMUNITY_APP}/api`;

class RecruitCRMJobDetailsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReferrSucess: false,
      formErrors: {},
      formData: {
        body: `Hey there!

Topcoder has a freelance gig that I thought you would be interested in. If you get the gig, I could earn cash!
        
Check it out:
${config.URL.BASE}${config.GIGS_PAGES_PATH}/${props.id}`,
      },
    };

    this.onSendClick = this.onSendClick.bind(this);
    this.onReferralDone = this.onReferralDone.bind(this);
  }

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

  /**
   * Send gig referral invite
   */
  async onSendClick(email) {
    const {
      profile, growSurf, tokenV3,
    } = this.props;
    const { formData } = this.state;
    // check if email is already referred?
    const growCheck = await fetch(`${PROXY_ENDPOINT}/growsurf/participant/${email}`);
    if (growCheck.status === 200) {
      const growCheckData = await growCheck.json();
      if (growCheckData.referrer) {
        this.setState({
          isReferrError: {
            message: `${email} has already been referred.`,
            isReferred: true,
          },
        });
        // exit no email sending
        return;
      }
    }
    // email the invite
    const res = await fetch(`${PROXY_ENDPOINT}/mailchimp/email`, {
      method: 'POST',
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email }],
            subject: `${profile.firstName} ${profile.lastName} Thinks This Topcoder Gig Is For You!`,
          },
        ],
        from: { email: 'noreply@topcoder.com', name: `${profile.firstName} ${profile.lastName} via Topcoder Gigwork` },
        content: [{
          type: 'text/plain', value: `${formData.body}?referralId=${growSurf.data.id}`,
        }],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    });
    if (res.status >= 300) {
      this.setState({
        isReferrError: await res.json(),
      });
      // exit no email tracking due to the error
      return;
    }
    // put tracking in growsurf
    // let { emailInvitesLog } = growSurf.data.metadata;
    // if (!emailInvitesLog) emailInvitesLog = [];
    // else emailInvitesLog = JSON.parse(JSON.parse(emailInvitesLog));
    // const updateGrowProfile = await fetch(`${PROXY_ENDPOINT}/growsurf/participant/${growSurf.data}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${tokenV3}`,
    //   },
    //   body: JSON.stringify({
    //     ...growSurf.data,
    //     metadata: {
    //       ...growSurf.data.metadata,
    //       emailInvitesSent: Number(growSurf.data.metadata.emailInvitesSent || 0) + 1,
    //       emailInvitesLog: JSON.stringify(JSON.stringify(emailInvitesLog.concat({
    //         e: email, d: new Date().toISOString(),
    //       }))),
    //     },
    //   }),
    // });
    // finally do:
    this.setState({
      isReferrSucess: true,
    });
  }

  /**
   * Reset the form when referral done
   */
  onReferralDone() {
    const { formData } = this.state;
    delete formData.email;
    this.setState({
      isReferrSucess: false,
      isReferrError: false,
      formData,
    });
  }

  render() {
    const {
      loading,
      job,
      isApply,
      application,
      profile,
      growSurf,
    } = this.props;
    const {
      formErrors,
      formData,
      isReferrSucess,
      isReferrError,
      // referralId,
    } = this.state;

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
          onSendClick={this.onSendClick}
          isReferrSucess={isReferrSucess}
          formErrors={formErrors}
          formData={formData}
          isReferrError={isReferrError}
          onReferralDone={this.onReferralDone}
          growSurf={growSurf}
        />
      );
  }
}

RecruitCRMJobDetailsContainer.defaultProps = {
  job: {},
  application: null,
  profile: {},
  growSurf: {},
  tokenV3: null,
};

RecruitCRMJobDetailsContainer.propTypes = {
  getJob: PT.func.isRequired,
  loading: PT.bool.isRequired,
  job: PT.shape(),
  id: PT.string.isRequired,
  isApply: PT.bool.isRequired,
  application: PT.shape(),
  profile: PT.shape(),
  growSurf: PT.shape(),
  tokenV3: PT.string,
};

function mapStateToProps(state, ownProps) {
  const data = state.recruitCRM[ownProps.id];
  const profile = state.auth && state.auth.profile ? { ...state.auth.profile } : {};
  const { growSurf } = state;
  return {
    job: data ? data.job : {},
    loading: data ? data.loading : true,
    application: data ? data.application : null,
    profile,
    growSurf,
    tokenV3: state.auth ? state.auth.tokenV3 : null,
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
