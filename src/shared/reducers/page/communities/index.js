import { combineReducers } from 'redux';

import cognitive from './cognitive';
import veterans from './veterans';

export default combineReducers({
  cognitive,
  veterans,
});
