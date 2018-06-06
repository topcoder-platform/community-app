import { combineReducers } from 'redux';

import blockchain from './blockchain';
import cognitive from './cognitive';
import veterans from './veterans';
import iot from './iot';

export default combineReducers({
  blockchain,
  cognitive,
  veterans,
  iot,
});
