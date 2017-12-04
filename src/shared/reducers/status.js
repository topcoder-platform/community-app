/**
 * Redux Reducer for application-wide API/network status handling.
 *
 * Description:
 *   Implements state reducers for application-wide API/network status handling.
 */
import { handleActions } from 'redux-actions';
import actions from 'actions/status';

/**
 * Creates an Errors reducer with the specified initial state.
 * @param {Array} initialState Initial state.
 * @return submission reducer.
 */
function create(initialState) {
  const a = actions.status;

  return handleActions({
    [a.clearAllErrorsStatus]: () => ({ networkErrors: {}, ApiErrors: {} }),
    // setNetworkErrorsStatus only keep latest error message
    [a.setNetworkErrorsStatus]: (state, { payload: { url, message } }) =>
      ({ ...state, networkErrors: { [url]: message } }),
    [a.clearNetworkErrorsStatus]: state => ({ ...state, networkErrors: {} }),
    [a.setApiErrorsStatus]: (state, { payload: { url, message } }) =>
      ({ ...state, ApiErrors: { ...state.ApiErrors, [url]: message } }),
    [a.clearApiErrorsStatus]: (state, { payload }) => {
      if (payload in state.ApiErrors) {
        const newApiErrors = { ...state.ApiErrors };
        delete newApiErrors[payload];
        return { ...state, ApiErrors: newApiErrors };
      }
      return state;
    },

  }, initialState || { networkErrors: {}, ApiErrors: {} });
}

export function factory() {
  return Promise.resolve(create());
}

export default create();
