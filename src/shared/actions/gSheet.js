/**
 * Actions related to gsheets
 */
/* global fetch */
import { redux } from 'topcoder-react-utils';
import Service from 'services/gSheet';

/**
 * Fetch init
 */
function getGsheetInit(id, index) {
  return { id, index };
}

/**
 * Fetch done
 */
async function getGsheetDone(id, index) {
  const ss = new Service();
  const res = await ss.getSheet(id, index);
  return {
    id,
    index,
    data: res,
  };
}

export default redux.createActions({
  GSHEETS: {
    GET_GSHEET_INIT: getGsheetInit,
    GET_GSHEET_DONE: getGsheetDone,
  },
});
