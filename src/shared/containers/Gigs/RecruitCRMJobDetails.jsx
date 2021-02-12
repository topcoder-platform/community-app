/**
 * A block that fetches and renders a job details page
 * driven by recruitCRM
 */

import { isEmpty, trim } from 'lodash';
import actions from 'actions/recruitCRM';
import LoadingIndicator from 'components/LoadingIndicator';
import GigDetails from 'components/Gigs/GigDetails';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getQuery } from 'utils/url';
import { isValidEmail } from 'utils/tc';
import { config } from 'topcoder-react-utils';
import fetch from 'isomorphic-fetch';
import RecruitCRMJobApply from './RecruitCRMJobApply';

const cookies = require('browser-cookies');

const PROXY_ENDPOINT = `${config.URL.COMMUNITY_APP}/api`;

class RecruitCRMJobDetailsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReferrSucess: false,
      formErrors: {},
      formData: {
        body: `Hey there!

Topcoder has a freelance gig that I thought you would be interested in. If you get the gig and complete it successfully we both get an extra $500.
        
Check it out:
https://www.topcoder.com/gigs/${props.id}`,
      },
    };

    this.onSendClick = this.onSendClick.bind(this);
    this.onFormInputChange = this.onFormInputChange.bind(this);
    this.getReferralId = this.getReferralId.bind(this);
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
    const query = getQuery();
    if (query.referralId) {
      cookies.set(config.GROWSURF_COOKIE, JSON.stringify({
        referralId: query.referralId,
        gigId: id,
      }), config.GROWSURF_COOKIE_SETTINGS);
    }
  }

  /**
   * Form state setter
   * @param {*} key key
   * @param {*} update value
   */
  onFormInputChange(key, update) {
    this.setState((state) => {
      const { formData, formErrors } = state;
      if (key === 'email') {
        if (trim(update)) {
          if (!(isValidEmail(update))) formErrors.email = 'Invalid email';
          else {
            delete formErrors.email;
            formData.email = update;
          }
        } else formErrors.email = 'Email is required field';
      }
      return {
        formData,
        formErrors,
      };
    });
  }

  /**
   * Send gig referral invite
   */
  async onSendClick() {
    const { profile } = this.props;
    const { formData, formErrors } = this.state;
    if (!formData.email) {
      formErrors.email = 'Email is required field';
      this.setState({
        formErrors,
      });
      return;
    }
    // email the invite
    const res = await fetch(`${PROXY_ENDPOINT}/mailchimp/email`, {
      method: 'POST',
      body: JSON.stringify({
        from: `${profile.firstName} ${profile.lastName} via Topcoder Gigwork <noreply@topcoder.com>`,
        to: formData.email,
        replyTo: 'noreply@topcoder.com',
        subject: `${profile.firstName} ${profile.lastName} Thinks This Topcoder Gig Is For You!`,
        text: formData.body,
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
    } else {
      this.setState({
        isReferrSucess: true,
      });
    }
  }

  /**
   * Reset the form when referral done
   */
  onReferralDone() {
    const { formData } = this.state;
    delete formData.email;
    this.setState({
      isReferrSucess: false,
      formData,
    });
  }

  /**
   * Get referral id for the logged user
   */
  async getReferralId() {
    const { profile } = this.props;
    const { referralId, formData } = this.state;
    if (!referralId && profile.email) {
      const res = await fetch(`${PROXY_ENDPOINT}/growsurf/participants?participantId=${profile.email}`, {
        method: 'POST',
        body: JSON.stringify({
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status >= 300) {
        this.setState({
          isReferrError: { message: 'Failed to get your referralId.' },
        });
      } else {
        const data = await res.json();
        formData.body += `?referralId=${data.id}`;
        this.setState({
          referralId: data.id,
          formData: {
            ...formData,
            body: formData.body,
          },
        });
      }
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
    const {
      formErrors,
      formData,
      isReferrSucess,
      isReferrError,
      referralId,
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
          onFormInputChange={this.onFormInputChange}
          isReferrError={isReferrError}
          getReferralId={this.getReferralId}
          referralId={referralId}
          onReferralDone={this.onReferralDone}
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
