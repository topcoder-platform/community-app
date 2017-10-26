import { combineReducers } from 'redux';

import editor from './editor';
import listing from './listing';

export default combineReducers({
  editor,
  listing,
});
