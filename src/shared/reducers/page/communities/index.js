import { combineReducers } from 'redux';

import cognitive from './cognitive';
import veterans from './veterans';
import iot from './iot';

export default combineReducers({
  cognitive,
  veterans,
  iot,
});
