/**
 * Container for NewsletterSignupForMembers component
 */

/* global window */

import React from 'react';
import PT from 'prop-types';
import forge from 'node-forge';
import fetch from 'isomorphic-fetch';
import NewsletterSignupForMembers, { STATE as SIGNUP_NEWSLETTER }
  from 'components/NewsletterSignupForMembers';
import { connect } from 'react-redux';
import { config } from 'topcoder-react-utils';
import _ from 'lodash';

/* Holds the base URL of Community App endpoints that proxy HTTP request to
 * mailchimp APIs. */
const PROXY_ENDPOINT = `${config.URL.COMMUNITY_APP}/api/mailchimp`;

class NewsletterSignupForMembersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.subscribe = this.subscribe.bind(this);
    this.checkSubscription = this.checkSubscription.bind(this);
    this.showSignupConfirmModal = this.showSignupConfirmModal.bind(this);
    this.resetSignupButton = this.resetSignupButton.bind(this);
    this.hideSignupButton = this.hideSignupButton.bind(this);

    this.hasSubscribedFromUrl = false;

    // Get interestIds and interest request object for mailchimp api
    // to use in checkSubscription and subscribe function
    const { interests } = props;
    this.interestsIds = null;
    this.interestsReqObj = {};
    if (interests !== '') {
      this.interestsIds = interests.split(/ *, */);
      this.interestsIds[this.interestsIds.length - 1] = this.interestsIds[this.interestsIds.length - 1].replace(/^\s+|\s+$/g, '');
      _.map(this.interestsIds, (id) => {
        this.interestsReqObj[id] = true;
      });
    }
    this.isSubscribed = false;

    this.state = {
      signupState: SIGNUP_NEWSLETTER.DEFAULT,
      message: '',
    };
  }

  componentDidMount() {
    this.checkSubscription();
  }

  componentDidUpdate(prevProps) {
    const { token } = this.props;
    const { signupState } = this.state;
    if (prevProps.token !== token) this.checkSubscription();
    let subscribeMe = window.location.href.match(/(.*\?)(.*)/);
    subscribeMe = subscribeMe && subscribeMe[2].split('=');
    subscribeMe = subscribeMe && subscribeMe[0] === 'subscribeme';
    if (token && subscribeMe && signupState === SIGNUP_NEWSLETTER.DEFAULT
      && !this.hasSubscribedFromUrl) {
      this.subscribe();
      this.hasSubscribedFromUrl = true;
    }
  }

  async checkSubscription() {
    const {
      listId, user, token,
    } = this.props;
    if (!token) return;
    const md = forge.md.md5.create();
    md.update(user.email);

    this.emailHash = md.digest().toHex();

    await fetch(`${PROXY_ENDPOINT}/${listId}/members/${this.emailHash}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((result) => {
        if (result.status === 400) this.setState({ signupState: SIGNUP_NEWSLETTER.DEFAULT });
        return result.json();
      })
      .then((dataResponse) => {
        if (dataResponse.status === 'subscribed') {
          this.isSubscribed = true;
          const subscribedInterests = dataResponse.interests;
          let interestsSubscribed = false;
          _.map(this.interestsIds, (id) => {
            if (!subscribedInterests[id]) {
              this.setState({ signupState: SIGNUP_NEWSLETTER.DEFAULT });
              interestsSubscribed = true;
            }
          });
          if (!interestsSubscribed) this.setState({ signupState: SIGNUP_NEWSLETTER.HIDDEN });
        } else {
          this.setState({ signupState: SIGNUP_NEWSLETTER.DEFAULT });
        }
      });
  }

  async subscribe() {
    const {
      listId, user,
    } = this.props;

    let fetchUrl = `${PROXY_ENDPOINT}/${listId}/members`;
    let method = 'POST';
    if (this.interestsIds) {
      fetchUrl += `/${this.emailHash}`;
      method = 'PUT';
    }

    let data = {};
    if (!this.isSubscribed) {
      data = {
        email_address: user.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: user.FNAME,
          LNAME: user.LNAME,
        },
      };
    }

    if (this.interestsIds) data.interests = this.interestsReqObj;

    const formData = JSON.stringify(data);
    // use proxy for avoid 'Access-Control-Allow-Origin' bug
    await fetch(fetchUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    }).then(result => result.json()).then((dataResponse) => {
      if (dataResponse.status === 'subscribed') {
        // regist success
        this.setState({ signupState: SIGNUP_NEWSLETTER.SIGNEDUP });
      } else {
        // regist fail
        this.setState({
          signupState: SIGNUP_NEWSLETTER.ERROR,
          message: dataResponse.detail,
        });
      }
    });
  }

  showSignupConfirmModal() {
    this.setState({ signupState: SIGNUP_NEWSLETTER.CONFIRM_SIGNUP });
  }

  resetSignupButton() {
    const { signupState } = this.state;
    this.setState({
      signupState: signupState === SIGNUP_NEWSLETTER.SIGNEDUP
        ? SIGNUP_NEWSLETTER.HIDDEN : SIGNUP_NEWSLETTER.DEFAULT,
    });
  }

  hideSignupButton() {
    this.setState({ signupState: SIGNUP_NEWSLETTER.HIDDEN });
  }

  render() {
    const { signupState, message } = this.state;
    return (
      <NewsletterSignupForMembers
        {...this.props}
        signup={this.subscribe}
        showSignupConfirmModal={this.showSignupConfirmModal}
        state={signupState}
        resetSignupButton={this.resetSignupButton}
        hideSignupButton={this.hideSignupButton}
        customSignupErrorText={
          signupState === SIGNUP_NEWSLETTER.ERROR ? message : null
        }
      />
    );
  }
}

NewsletterSignupForMembersContainer.defaultProps = {
  token: '',
  label: 'Subscribe for Newsletter',
  interests: '',
};

NewsletterSignupForMembersContainer.propTypes = {
  token: PT.string,
  label: PT.string,
  interests: PT.string,
  listId: PT.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  /* We show NewsletterSignup button when a visitor is not authenticated, or when
   * he is authenticated and not subscribed to Newsletter. */
  const { profile, tokenV3 } = state.auth;

  let userData = null;
  if (profile && profile.email) {
    userData = {
      FNAME: profile.firstName,
      LNAME: profile.lastName,
      email: profile.email,
    };
  }

  return {
    label: ownProps.label,
    theme: ownProps.theme,
    token: tokenV3,
    user: userData,
  };
}

export default connect(mapStateToProps)(NewsletterSignupForMembersContainer);
