
import _ from 'lodash';
import actions from 'actions/dashboard';
import { handleActions } from 'redux-actions';


function create(initialState) {
  const a = actions.dashboard;
  return handleActions({
    [a.getSubtrackRanksDone]: (state, action) => ({
      ...state,
      subtrackRanks: action.error ? [] : action.payload,
      loadingSubtrackRanks: false,
    }),
    [a.getSubtrackRanksInit]: state => ({
      ...state,
      loadingSubtrackRanks: true,
    }),
    [a.getSrmsInit]: state => ({
      ...state,
      loadingSRMs: true,
    }),
    [a.getSrmsDone]: (state, action) => ({
      ...state,
      srms: action.error ? [] : action.payload,
      loadingSRMs: false,
    }),
    [a.getIosRegistration]: (state, action) => ({
      ...state,
      iosRegistered: action.error ? false : !!action.payload,
    }),
    [a.registerIos]: (state, action) => ({
      ...state,
      iosRegistered: action.error ? false : !!action.payload,
    }),
    [a.getBlogsInit]: state => ({
      ...state,
      loadingBlogs: true,
    }),
    [a.getBlogsDone]: (state, action) => ({
      ...state,
      loadingBlogs: false,
      blogs: action.error ? [] : action.payload,
    }),
    [a.getUserFinancials]: (state, action) => ({
      ...state,
      financials: action.error ? 0 : action.payload,
    }),
  }, _.defaults(_.clone(initialState) || {}, {
    subtrackRanks: [],
    loadingSubtrackRanks: false,
    srms: [],
    loadingSRMs: false,
    iosRegistered: false,
    loadingBlogs: false,
    blogs: [],
    financials: 0,
  }));
}

/**
 * The factory creates the new reducer with initial state tailored to the given
 * ExpressJS HTTP request, if specified (for server-side rendering). If no HTTP
 * request is specified, it creates the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return {Promise} Resolves to the new reducer.
 */
export function factory() {
  /* Server-side rendering is not implemented yet.
    Let's first ensure it all works fine without it. */
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
