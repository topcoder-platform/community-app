/**
 * Join Community component. It includes 'Join Community' button, which is
 * automatically hidden, when a user is already member of community. Button
 * text changes to the loading symbol, when the joining is underway. And a
 * modal is shown on success.
 */
import PT from 'prop-types';
import fetch from 'isomorphic-fetch';
import React from 'react';
import { themr } from 'react-css-super-themr';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import forge from 'node-forge';
// import qs from 'qs';
import _ from 'lodash';
import defaultStyle from './style.scss';

/* Holds the base URL of Community App endpoints that proxy HTTP request to
 * mailchimp APIs. */
const PROXY_ENDPOINT = `${config.URL.COMMUNITY_APP}/api/mailchimp`;

class NewsletterSignup extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.checkSubscription = this.checkSubscription.bind(this);
    this.state = { email: '', message: '', invalidEmail: false };
  }

  async onSubmit() {
    const { listId, interests } = this.props;

    const { email } = this.state;

    if (!this.isEmailValid()) {
      this.setState({ invalidEmail: true });
      return;
    }

    const md = forge.md.md5.create();
    md.update(email);
    const md5Hash = md.digest().toHex();
    this.setState({ invalidEmail: false });

    let data = null;
    const { isSubscribed, subscribedInterests } = await this.checkSubscription(md5Hash);
    const interestsReqObj = {};
    let interestIds = null;

    if (interests !== '') {
      interestIds = interests.split(/ *, */);
      interestIds[interestIds.length - 1] = interestIds[interestIds.length - 1].replace(/^\s+|\s+$/g, '');
      _.map(interestIds, (id) => { interestsReqObj[id] = true; });
    }

    if (isSubscribed) {
      if (interests === '') {
        this.setState({ message: 'Already Subscribed' });
        return;
      }
      let allInterestsSubscribed = true;
      _.map(interestIds, (id) => {
        if (!subscribedInterests[id]) allInterestsSubscribed = false;
      });
      if (allInterestsSubscribed) {
        this.setState({ message: 'Already Subscribed' });
        return;
      }


      data = {
        interests: interestsReqObj,
      };
    } else {
      data = {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          fname: '',
          lname: '',
        },
      };
      if (interests !== '') {
        data.interests = interestsReqObj;
      }
    }

    let fetchUrl = `${PROXY_ENDPOINT}/${listId}/members`;
    let method = 'POST';
    if (isSubscribed) {
      fetchUrl += `/${md5Hash}`;
      method = 'PUT';
    }
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
        this.setState({ message: 'Subcribed successfully' });
      } else {
        // regist fail
        this.setState({ message: dataResponse.title });
      }
    });
  }

  async checkSubscription(emailHash) {
    const { listId } = this.props;

    let isSubscribed = false;
    let subscribedInterests = null;
    await fetch(`${PROXY_ENDPOINT}/${listId}/members/${emailHash}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then((dataResponse) => {
        if (dataResponse.status === 'subscribed') {
          subscribedInterests = dataResponse.interests;
          isSubscribed = true;
        }
      });
    return { isSubscribed, subscribedInterests };
  }

  isEmailValid() {
    const { email } = this.state;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; /* eslint-disable-line no-useless-escape */
    return re.test(String(email).toLowerCase());
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.onSubmit();
    }
  }

  render() {
    const { theme } = this.props;
    const { email, message, invalidEmail } = this.state;
    return (
      <span>
        { message && (
          <Modal onCancel={() => { this.setState({ message: '' }); }}>
            <h2 className={theme.modalTitle}>
              { message }
            </h2>
            <PrimaryButton
              onClick={() => { this.setState({ message: '' }); }}
              theme={{
                button: defaultStyle.returnToCommunityButton,
              }}
            >
              Ok
            </PrimaryButton>
          </Modal>
        )}
        <span className={`${theme.error} ${invalidEmail ? '' : theme.hide}`}>* Invalid email</span>
        <span className={`${theme.form}`}>
          <input className={`${(invalidEmail ? theme.invalid : theme.valid)}`} type="email" placeholder="Email Address" value={email} onChange={this.handleEmailChange} onKeyPress={this.handleKeyPress} />
          <button type="button" onClick={this.onSubmit}>GET UPDATES</button>
        </span>
      </span>
    );
  }
}

NewsletterSignup.defaultProps = {
  interests: '',
  theme: {},
};

NewsletterSignup.propTypes = {
  listId: PT.string.isRequired,
  interests: PT.string,
  theme: PT.shape(),
};

export default themr('Modal', defaultStyle)(NewsletterSignup);
