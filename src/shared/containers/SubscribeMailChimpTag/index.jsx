/**
 * Genetic subscribe for MailChimp tags component
 */
import React from 'react';
import PT from 'prop-types';
import { isValidEmail } from 'utils/tc';
import { Modal } from 'topcoder-react-ui-kit';
import modalStyle from 'components/NewsletterSignupForMembers/modal.scss';
import defaulTheme from './style.scss';

/* Holds the base URL of Community App endpoints that proxy HTTP request to
 * mailchimp APIs. */
const PROXY_ENDPOINT = '/api/mailchimp';

class SubscribeMailChimpTagContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      subsribed: false,
      disabled: true,
      inputVal: '',
    };
    this.onSubscribeClick = this.onSubscribeClick.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onSubscribeClick() {
    const { inputVal } = this.state;
    const { listId, tags } = this.props;
    const fetchUrl = `${PROXY_ENDPOINT}/${listId}/members/${inputVal}/tags`;
    const data = {
      email_address: inputVal,
      status: 'subscribed',
      tags: tags.map(t => ({ name: t, status: 'active' })),
    };
    const formData = JSON.stringify(data);
    fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    }).then(result => result.json()).then((dataResponse) => {
      if (dataResponse.status === 204) {
        // regist success
        return this.setState({
          subsribed: true,
          error: '',
        });
      }
      if (dataResponse.status === 404) {
        // new email register it for list and add tags
        return fetch(`${PROXY_ENDPOINT}/${listId}/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: inputVal,
            status: 'subscribed',
            tags,
          }),
        })
          .then(result => result.json()).then(() => {
            this.setState({
              subsribed: true,
              error: '',
            });
          });
      }
      return this.setState({
        subsribed: false,
        error: `Error ${dataResponse.status} when assign to tags`,
      });
    })
      .catch((e) => {
        this.setState({
          subsribed: false,
          error: e.message,
        });
      });
  }

  onInputChange(event) {
    this.setState({
      inputVal: event.target.value,
      disabled: !isValidEmail(event.target.value),
    });
  }

  render() {
    const {
      disabled, inputVal, error, subsribed,
    } = this.state;
    return (
      <div className={defaulTheme.wrapper}>
        {
          subsribed || error ? (
            <Modal
              theme={modalStyle}
              onCancel={() => this.setState({
                subsribed: false,
                error: false,
                inputVal: '',
                disabled: true,
              })}
            >
              <div className={modalStyle.modalMsg}>
                <h4>{subsribed ? 'Congratulations!' : 'Ops :('}</h4>
                <p style={{ fontSize: '24px' }}>{error || 'You are now subscribed.'}</p>
              </div>
            </Modal>
          ) : null
        }
        <input type="email" placeholder="Email" value={inputVal} onChange={this.onInputChange} />
        <button type="button" onClick={this.onSubscribeClick} disabled={disabled} className={defaulTheme.button}>Subscribe</button>
      </div>
    );
  }
}

SubscribeMailChimpTagContainer.propTypes = {
  listId: PT.string.isRequired,
  tags: PT.arrayOf(PT.string).isRequired,
};

export default SubscribeMailChimpTagContainer;
