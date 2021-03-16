/**
 * Genetic subscribe for MailChimp tags component
 */
import React from 'react';
import PT from 'prop-types';
import { isValidEmail } from 'utils/tc';
import TextInput from 'components/GUIKit/TextInput';
import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import { Link } from 'topcoder-react-utils';
import defaulTheme from './style.scss';

/* Holds the base URL of Community App endpoints that proxy HTTP request to
 * mailchimp APIs. */
const PROXY_ENDPOINT = '/api/mailchimp';

class SubscribeMailChimpTagContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formErrors: {},
      formData: {},
    };
    this.onSubscribeClick = this.onSubscribeClick.bind(this);
    this.onFormInputChange = this.onFormInputChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  onSubscribeClick() {
    this.validateForm();
    // eslint-disable-next-line consistent-return
    this.setState((state) => {
      const { formData, formErrors } = state;
      if (_.isEmpty(formErrors)) {
        const { listId, interests } = this.props;
        const fetchUrl = `${PROXY_ENDPOINT}/${listId}/members/${formData.email}`;
        const data = {
          status: 'subscribed',
          interests,
        };
        fetch(fetchUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }).then(result => result.json()).then((dataResponse) => {
          if (dataResponse.status === 'subscribed') {
            // regist success
            return this.setState({
              subscribing: false,
              subsribed: true,
              error: '',
            });
          }
          if (dataResponse.status === 400) {
            // new email register it for list and add tags
            return fetch(`${PROXY_ENDPOINT}/${listId}/members`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...data,
                email_address: formData.email,
                merge_fields: {
                  FNAME: formData.fname,
                  LNAME: formData.lname,
                },
              }),
            })
              .then(result => result.json()).then((rsp) => {
                this.setState({
                  subscribing: false,
                  subsribed: !rsp.detail,
                  error: rsp.detail ? rsp.title : '',
                });
              });
          }
          return this.setState({
            subscribing: false,
            subsribed: false,
            error: `Error ${dataResponse.status} when subscribing ${formData.email}`,
          });
        })
          .catch((e) => {
            this.setState({
              subscribing: false,
              subsribed: false,
              error: e.message,
            });
          });
        return { subscribing: true };
      }
    });
  }

  onFormInputChange(key, val) {
    this.setState((state) => {
      const { formData } = state;
      formData[key] = val;
      return {
        ...state,
        formData,
      };
    });
    this.validateForm(key);
  }

  validateForm(key) {
    this.setState((state) => {
      const { formData, formErrors } = state;
      if (key) {
        // validate only the key
        if (!formData[key] || !_.trim(formData[key])) formErrors[key] = 'Required field';
        else if (key === 'email' && !(isValidEmail(formData.email))) formErrors.email = 'Invalid email';
        else delete formErrors[key];
      } else {
        _.each(['fname', 'lname', 'email'], (rkey) => {
          if (!formData[rkey] || !_.trim(formData[rkey])) formErrors[rkey] = 'Required field';
          else if (rkey === 'email' && !(isValidEmail(formData.email))) formErrors.email = 'Invalid email';
          else delete formErrors[key];
        });
      }
      // updated state
      return {
        ...state,
        formErrors,
      };
    });
  }

  render() {
    const {
      formData, formErrors, subscribing, subsribed, error,
    } = this.state;
    const {
      btnText, title, successTitle, successText, successLink, successLinkText,
    } = this.props;
    return (
      <div className={defaulTheme.wrapper}>
        {
          subscribing ? (
            <div className={defaulTheme.loadingWrap}>
              <LoadingIndicator />
              <p className={defaulTheme.loadingText}>
                Processing your subscription...
              </p>
            </div>
          ) : null
        }
        {
          subsribed || error ? (
            <div className={defaulTheme.subscribedWrap}>
              <h4>{error ? 'OOPS!' : successTitle}</h4>
              <p className={error ? defaulTheme.errorMsg : null}>{error || successText}</p>
              {
                error
                  ? <button type="button" onClick={() => { window.location.reload(); }} className={defaulTheme.button}>TRY AGAIN</button>
                  : <Link to={successLink} className={defaulTheme.button}>{successLinkText}</Link>
              }
            </div>
          ) : null
        }
        {
          !subscribing && !subsribed && !error ? (
            <React.Fragment>
              <h6>{title}</h6>
              <TextInput
                placeholder="First Name"
                label="First Name"
                onChange={val => this.onFormInputChange('fname', val)}
                errorMsg={formErrors.fname}
                value={formData.fname}
                required
              />
              <TextInput
                placeholder="Last Name"
                label="Last Name"
                onChange={val => this.onFormInputChange('lname', val)}
                errorMsg={formErrors.lname}
                value={formData.lname}
                required
              />
              <TextInput
                placeholder="Email Address"
                label="Email Address"
                onChange={val => this.onFormInputChange('email', val)}
                errorMsg={formErrors.email}
                value={formData.email}
                required
              />
              <button type="button" onClick={this.onSubscribeClick} disabled={!_.isEmpty(formErrors) || subscribing} className={defaulTheme.button}>{btnText}</button>
            </React.Fragment>
          ) : null
        }
      </div>
    );
  }
}

SubscribeMailChimpTagContainer.defaultProps = {
  title: '',
  btnText: '',
  successTitle: 'Success!',
  successText: '',
  successLink: '',
  successLinkText: '',
};

SubscribeMailChimpTagContainer.propTypes = {
  listId: PT.string.isRequired,
  interests: PT.shape().isRequired,
  title: PT.string,
  btnText: PT.string,
  successTitle: PT.string,
  successText: PT.string,
  successLink: PT.string,
  successLinkText: PT.string,
};

export default SubscribeMailChimpTagContainer;
