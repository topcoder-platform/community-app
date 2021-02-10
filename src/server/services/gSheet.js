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
  /**
   * getSheet
   * @param {Object} req the request
   * @param {Object} res the response
   */
  async getSheet(req, res) {
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
      res.status((e.response && e.response.status) || 500);
      return res.send((e.response && e.response.data) || { ...e, message: e.message });
    }
  }
}
