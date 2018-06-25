import _ from 'lodash';
import { handleActions } from 'redux-actions';

import actions from 'actions/page/trackHomePages';

function create(defaultState = {}) {
  const a = actions.page.trackHomePages;
  return handleActions({
    [a.setSelectedTrack]: (state, { payload }) => ({ ...state, selectedTrack: payload }),
  }, _.defaults(defaultState, {
    selectedTrack: '',
  }));
}

export default create();
