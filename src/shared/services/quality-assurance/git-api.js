
import _ from 'lodash';
import 'isomorphic-fetch'; /* global fetch */
import { setErrorIcon, ERROR_ICON_TYPES } from 'utils/errors';

const AUTHORIZATION_TOKEN = 'token df9bc4b055c592200daaec7bae53b67580e183a1';

export default class GitApi {
  constructor(base, token) {
    this.private = {
      base,
      token,
    };
  }

  fetch(endpoint, options = {}) {
    const { base, token } = this.private;
    const headers = options.headers ? _.clone(options.headers) : {};
    if (token) headers.Authorization = AUTHORIZATION_TOKEN;
    return fetch(`${base}${endpoint}`, { ...options,
      headers,
    })
      .catch((e) => {
        setErrorIcon(ERROR_ICON_TYPES.NETWORK, `${base}${endpoint}`, e.message);
        throw e;
      });
  }

  get(endpoint, options) {
    return this.fetch(endpoint, options);
  }

  post(endpoint, body) {
    return this.fetch(endpoint, {
      body,
      method: 'POST',
    });
  }
}
