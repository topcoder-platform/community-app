import fetch from 'isomorphic-fetch';
import { logger } from 'topcoder-react-lib';

const PROXY_ENDPOINT = '/api/gsheets';

export default class Service {
  baseUrl = PROXY_ENDPOINT;

  /**
   * Get gsheet by id
   * @param {string} id The sheet id
   * @param {number} index sheet index
   */
  async getSheet(id, index) {
    const res = await fetch(`${this.baseUrl}/${id}${index !== undefined ? `?index=${index}` : ''}`);
    if (!res.ok) {
      const error = new Error(`Failed to get gsheet ${id}`);
      logger.error(error, res);
    }
    return res.json();
  }
}
