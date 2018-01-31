
import _ from 'lodash';
import logger from 'utils/logger';
import { setErrorIcon, ERROR_ICON_TYPES } from 'utils/errors';
import { getApiV2, getApiV3 } from '../api';
import 'isomorphic-fetch';
import { isClientSide } from 'utils/isomorphy';

const AUTHORIZATION_TOKEN = "a9432c62581dd9ef7383ae302bf061d88f7f0d23";
//const AUTHORIZATION_TOKEN = '3111dccb0dc6affe260c8bd460c65f3eea349e28';


class RepositoryService {

  constructor() {
    
  }

  async listRepositories() {
    let res = await this.fetch(
      `https://api.github.com/orgs/topcoderinc/repos`,{
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': 'token ' + AUTHORIZATION_TOKEN
        }
      }
    );
    if (!res.ok) throw new Error(res.statusText);
    if (res.status !== 200) throw new Error(res.content);
    return res.json();
  }

  fetch(endpoint, options = {}) {
    const headers = options.headers ? _.clone(options.headers) : {};
    return fetch(`${endpoint}`, { ...options,
      headers,
    })
    .catch((e) => {
      setErrorIcon(ERROR_ICON_TYPES.NETWORK, `${endpoint}`, e.message);
      throw e;
    });
  }
}

export function getService() {
  return new RepositoryService();
}

export default undefined;
