/**
 * Actions for the Newsletter preference container.
 */

/* global fetch */
import _ from 'lodash';
import { createActions } from 'redux-actions';
import { config } from 'topcoder-react-utils';

const PROXY_ENDPOINT = `${config.URL.COMMUNITY_APP}/api/mailchimp`;

// Fetching member's newsletter preferences init
function fetchDataInit(email) {
  return email;
}

// Fetching member's newsletter preferences
async function fetchDataDone(emailHash, listId = config.NEWSLETTER_SIGNUP.DEFAUL_LIST_ID) {
  /* NOTE: In the real life in most cases you don't want to use fetch() directly
   * in an action. You want to create a service for your calls and use it here.
   * However, in this example, to keep it a bit more compact, we use fetch()
   * directly here. */
  try {
    let error = false;
    const subs = await fetch(`${PROXY_ENDPOINT}/${listId}/members/${emailHash}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((result) => {
        if (result.status !== 200) error = true;
        return result.json();
      });

    let preferences = [];
    let status = 'notsubscribed';
    if (!error && subs.status === 'subscribed') {
      status = 'subscribed';
      preferences = subs.interests;
    }

    return {
      email: emailHash,
      preferences,
      status,
      error,
    };
  } catch (error) {
    return {
      email: emailHash,
      error,
    };
  }
}

// Updates member newsletter subscription
async function updateSubscriptionsDone(
  emailHash, groupId, status, listId = config.NEWSLETTER_SIGNUP.DEFAUL_LIST_ID,
) {
  /* NOTE: In the real life in most cases you don't want to use fetch() directly
   * in an action. You want to create a service for your calls and use it here.
   * However, in this example, to keep it a bit more compact, we use fetch()
   * directly here. */
  try {
    let error = false;
    const fetchUrl = `${PROXY_ENDPOINT}/${listId}/members/${emailHash}`;

    const data = {
      interests: { [groupId]: !!status },
    };

    const formData = JSON.stringify(data);
    // use proxy for avoid 'Access-Control-Allow-Origin' bug
    await fetch(fetchUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    })
      .then((result) => {
        if (!result.ok) error = true;
        return result.json();
      });

    return {
      id: groupId,
      checked: status,
      email: emailHash,
      error,
    };
  } catch (error) {
    return {
      id: groupId,
      checked: status,
      email: emailHash,
      error,
    };
  }
}

export default createActions({
  NEWSLETTER_PREFERENCES: {
    FETCH_DATA_INIT: fetchDataInit,
    FETCH_DATA_DONE: fetchDataDone,
    UPDATE_TAG_INIT: _.identity,
    UPDATE_TAG_DONE: updateSubscriptionsDone,
  },
});
