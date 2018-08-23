import { combineReducers } from 'redux';

import cognitive from './cognitive';
import iot from './iot';

export default combineReducers({
  cognitive,
  iot,
});
