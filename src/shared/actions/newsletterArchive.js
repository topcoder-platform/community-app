/**
 * Actions for the Newsletter archive container.
 */

/* global fetch */
import _ from 'lodash';
import { createActions } from 'redux-actions';
import { config } from 'topcoder-react-utils';

// Fetching init
function fetchDataInit(name) {
  return name;
}

// Fetching done
async function fetchDataDone(name) {
  /* NOTE: In the real life in most cases you don't want to use fetch() directly
   * in an action. You want to create a service for your calls and use it here.
   * However, in this example, to keep it a bit more compact, we use fetch()
   * directly here.
   *
   * 1st we fetch all folders to try assicaite an `id` to the folder name
   * 2nd we fetch the campaign details */
  try {
    const PROXY_ENDPOINT = `${config.URL.COMMUNITY_APP}/api/mailchimp`;
    let res = await fetch(`${PROXY_ENDPOINT}/campaign-folders`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error(res.statusText);
    res = await res.json();
    const folder = _.find(res.folders, { name });
    if (!folder) throw new Error(`Folder '${name}' does not exist`);
    let res2 = await fetch(`${PROXY_ENDPOINT}/campaigns?count=10000&sort_field=send_time&sort_dir=DESC&folder_id=${folder.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res2.ok) throw new Error(res2.statusText);
    res2 = await res2.json();

    return {
      name,
      archive: res2,
    };
  } catch (error) {
    return {
      name,
      error,
    };
  }
}

export default createActions({
  NEWSLETTER_ARCHIVE: {
    FETCH_DATA_INIT: fetchDataInit,
    FETCH_DATA_DONE: fetchDataDone,
  },
});
