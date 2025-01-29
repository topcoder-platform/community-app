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
    const { groups, tags } = props;
    this.groupsIds = null;
    this.tagNames = null;
    if (groups !== '') {
      this.groupsIds = groups.split(/ *, */);
      this.groupsIds[this.groupsIds.length - 1] = this.groupsIds[this.groupsIds.length - 1].replace(/^\s+|\s+$/g, '');
    }
    if (tags) {
      this.tagNames = tags.split(',');
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
    const { token, authenticating } = this.props;
    const { signupState } = this.state;
    if (
      prevProps.token !== token
      || prevProps.authenticating !== authenticating
    ) this.checkSubscription();
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
      listId, user, token, authenticating,
    } = this.props;
    if (!token || authenticating) return;
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
          if (this.groupsIds) {
            const subscribedGroups = _.keys(_.pickBy(dataResponse.interests, v => v));
            if (subscribedGroups.length) {
              if (_.intersection(subscribedGroups, this.groupsIds).length) {
                this.setState({ signupState: SIGNUP_NEWSLETTER.HIDDEN });
              }
            } else {
              this.setState({ signupState: SIGNUP_NEWSLETTER.DEFAULT });
            }
          }
          if (!this.groupsIds && this.tagNames) {
            const subscribedTags = _.map(dataResponse.tags, t => t.name);
            if (subscribedTags.length) {
              if (_.intersection(subscribedTags, this.tagNames).length) {
                this.setState({ signupState: SIGNUP_NEWSLETTER.HIDDEN });
              }
            } else {
              this.setState({ signupState: SIGNUP_NEWSLETTER.DEFAULT });
            }
          }
        } else {
          this.setState({ signupState: SIGNUP_NEWSLETTER.DEFAULT });
        }
      });
  }

  async subscribe() {
    const {
      listId, user,
    } = this.props;
    const isTagsUpdate = !!this.tagNames;
    const fetchUrl = `${PROXY_ENDPOINT}/${listId}/members/${this.emailHash}${isTagsUpdate ? '/tags' : ''}`;

    if (this.groupsIds) {
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
      data.interests = {};
      // eslint-disable-next-line array-callback-return
      this.groupsIds.map((group) => {
        data.interests[group] = true;
      });

      const formData = JSON.stringify(data);
      // use proxy for avoid 'Access-Control-Allow-Origin' bug
      await fetch(fetchUrl, {
        method: 'PUT',
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
    if (!this.groupsIds && this.tagNames) {
      const formData = JSON.stringify({
        tags: this.tagNames.map(tName => ({
          name: tName,
          status: 'active',
        })),
      });
      // use proxy for avoid 'Access-Control-Allow-Origin' bug
      await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formData,
      }).then(result => result.json()).then((dataResponse) => {
        if (dataResponse.status === 204) {
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
  groups: '',
  user: null,
  buttonTheme: 'primary-green-md',
  title: 'Sign up for the Topcoder Newsletter',
  desc: 'Do you want to subscribe to this newsletter?',
  tags: null,
};

NewsletterSignupForMembersContainer.propTypes = {
  authenticating: PT.bool.isRequired,
  token: PT.string,
  label: PT.string,
  groups: PT.string,
  listId: PT.string.isRequired,
  user: PT.shape(),
  buttonTheme: PT.string,
  title: PT.string,
  desc: PT.string,
  tags: PT.string,
};

function mapStateToProps(state, ownProps) {
  /* We show NewsletterSignup button when a visitor is not authenticated, or when
   * he is authenticated and not subscribed to Newsletter. */
  const { profile, tokenV3, authenticating } = state.auth;

  let userData = null;
  if (profile && profile.email) {
    userData = {
      FNAME: profile.firstName,
      LNAME: profile.lastName,
      email: profile.email,
    };
  }

  return {
    authenticating,
    label: ownProps.label,
    theme: ownProps.theme,
    token: tokenV3,
    user: userData,
  };
}

export default connect(mapStateToProps)(NewsletterSignupForMembersContainer);
