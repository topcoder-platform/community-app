import { combineReducers } from 'redux';

import blockchain from './blockchain';
import cognitive from './cognitive';
import veterans from './veterans';

export default combineReducers({
  blockchain,
  cognitive,
  veterans,
});
