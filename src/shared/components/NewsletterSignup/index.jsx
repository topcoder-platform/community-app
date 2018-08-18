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
import Modal from 'components/Modal';
import { PrimaryButton } from 'topcoder-react-ui-kit';
// import qs from 'qs';
import defaultStyle from './style.scss';

/* Holds the base URL of Community App endpoints that proxy HTTP request to
 * mailchimp APIs. */
const PROXY_ENDPOINT = '/api/mailchimp';

class NewsletterSignup extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.state = { email: '', message: '', invalidEmail: false };
  }

  async onSubmit() {
    const { apiKey, listId } = this.props;
    const { email } = this.state;

    if (!this.isEmailValid()) {
      this.setState({ invalidEmail: true });
      return;
    }
    this.setState({ invalidEmail: false });
    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: '',
        LNAME: '',
      },
    };
    const formData = JSON.stringify(data);
    const authorization = `Basic ${Buffer.from(`apikey:${apiKey}`).toString('base64')}`;
    // use proxy for avoid 'Access-Control-Allow-Origin' bug
    await fetch(`${PROXY_ENDPOINT}/${listId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
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
          </Modal>)}
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
  apiKey: null,
  listId: '',
  theme: {},
};

NewsletterSignup.propTypes = {
  apiKey: PT.string,
  listId: PT.string,
  theme: PT.shape(),
};

export default themr('Modal', defaultStyle)(NewsletterSignup);
