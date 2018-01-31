
import 'isomorphic-fetch';
import _ from 'lodash';
import { setErrorIcon, ERROR_ICON_TYPES } from 'utils/errors';

const AUTHORIZATION_TOKEN = 'token a9432c62581dd9ef7383ae302bf061d88f7f0d23';

class RepositoryService {

  async listRepositories() {
    const res = await this.fetch(
      'https://api.github.com/orgs/topcoderinc/repos', {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: AUTHORIZATION_TOKEN,
        },
      },
    );
    if (!res.ok) throw new Error(res.statusText);
    if (res.status !== 200) throw new Error(res.content);
    return res.json();
  }

  fetch(endpoint, options = {}) {
    const headers = options.headers ? _.clone(options.headers) : {};
    return this.fetch(`${endpoint}`, { ...options,
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
