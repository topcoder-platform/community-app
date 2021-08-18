/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/**
 * Server-side functions necessary for effective integration with gsheets
 */
import config from 'config';

const { GoogleSpreadsheet } = require('google-spreadsheet');

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

/**
 * Auxiliary class that handles communication with mailchimp
 * APIs in the same uniform manner.
 */
export default class GSheetService {
  constructor() {
    this.getSheetAPI = this.getSheetAPI.bind(this);
    this.addToSheetAPI = this.getSheetAPI.bind(this);
    this.addToSheet = this.getSheetAPI.bind(this);
  }

  /**
   * getSheet
   * @param {Object} req the request
   * @param {Object} res the response
   */
  async getSheetAPI(req, res) {
    const { index } = req.query;
    const { id } = req.params;
    const doc = new GoogleSpreadsheet(id);
    doc.useApiKey(config.GSHEETS_API_KEY);
    try {
      await doc.loadInfo();
      // the first sheet if not selected via query
      const sheet = doc.sheetsByIndex[index || 0];
      const rows = await sheet.getRows();
      const rowsJson = JSON.stringify(rows, getCircularReplacer());
      return res.send({
        rows: JSON.parse(rowsJson),
      });
    } catch (e) {
      const status = (e.response && e.response.status) || 500;
      if (status === 429) {
        // rate limit issue - wait 15sec and retry
        await new Promise(resolve => setTimeout(resolve, 15000));
        return this.getSheetAPI(req, res);
      }
      res.status(status);
      return res.send((e.response && e.response.data) || { ...e, message: e.message });
    }
  }

  /**
   * Adds rows to gsheet by ID
   * Needs to be shared with the service account to work
   * This is the controler method with req/res objects
   * @param {Object} req the request
   * @param {Object} res the response
   */
  async addToSheetAPI(req, res) {
    const { index } = req.query;
    const { id } = req.params;
    const doc = new GoogleSpreadsheet(id);
    try {
      // set credentials for working
      await doc.useServiceAccountAuth({
        client_email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: config.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\m/g, '\n'),
      });
      // load doc infos
      await doc.loadInfo();
      // get 1st sheet
      const sheet = doc.sheetsByIndex[index || 0];
      const moreRows = await sheet.addRows(req.body);
      const rowsJson = JSON.stringify(moreRows, getCircularReplacer());
      return res.send({
        rows: JSON.parse(rowsJson),
      });
    } catch (e) {
      const status = (e.response && e.response.status) || 500;
      if (status === 429) {
        // rate limit issue - wait 15sec and retry
        await new Promise(resolve => setTimeout(resolve, 15000));
        return this.addToSheetAPI(req, res);
      }
      res.status(status);
      return res.send((e.response && e.response.data) || { ...e, message: e.message });
    }
  }

  /**
   * Adds rows to gsheet by ID
   * Needs to be shared with the service account to work
   * @param {string} id the doc id
   * @param {Array} paylod the body to send
   * @param {string} index sheet index in the doc. Defaults to 0
   */
  async addToSheet(id, payload, index = 0) {
    const doc = new GoogleSpreadsheet(id);
    try {
      // set credentials for working
      await doc.useServiceAccountAuth({
        client_email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: config.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\m/g, '\n'),
      });
      // load doc infos
      await doc.loadInfo();
      // get 1st sheet
      const sheet = doc.sheetsByIndex[index || 0];
      const moreRows = await sheet.addRows(payload);
      const rowsJson = JSON.stringify(moreRows, getCircularReplacer());
      return rowsJson;
    } catch (e) {
      const status = (e.response && e.response.status) || 500;
      if (status === 429) {
        // rate limit issue - wait 15sec and retry
        await new Promise(resolve => setTimeout(resolve, 15000));
        return this.addToSheet(id, payload, index);
      }
      return e;
    }
  }
}
