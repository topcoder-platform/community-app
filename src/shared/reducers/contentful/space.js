/**
 * This reducer manages segments of Redux store that hold data related to a
 * single Contentful space, visible either in regular, or `preview` mode.
 * It is up to the parent reducers to properly route actions so that this
 * reducer recieves actions only related to the proper space / mode. As this
 * reducer concerns, in a space there are `assets`, and `entries`, and each
 * incoming action requires some manipulations on them. It just routes incoming
 * actions between corresponing `assets` and `entries` sub-segments, depending
 * on the value of `target` field in the action payload objects; and also
 * does some extra processing for query done actions, because in addition to
 * the query results (found content), they also include additional information
 * on the assets/entries linked from the returned content, which should be
 * stored as well.
 */

import _ from 'lodash';
import actions from 'actions/contentful';
import { actions as truActions } from 'topcoder-react-utils';

import content from './content';

/**
 * Adds Contentful content items to the specified content segment of store.
 * @param {Object} segment
 * @param {Array} items
 * @return {Object} New segment.
 */
function addItems(segment, items) {
  const map = _.keyBy(items, item => item.sys.id);
  return content(segment, truActions.collection.addItems(map));
}

function create(init) {
  return (state, action) => {
    if (!state) {
      const def = {
        assets: content(undefined, action),
        entries: content(undefined, action),
      };
      return init ? _.defaults(init, def) : def;
    }

    if (action.type === actions.contentful.cleanState.toString()) {
      return {
        ...state,
        assets: content(state.assets, action),
        entries: content(state.entries, action),
      };
    }

    const { data, target } = action.payload;
    const res = { ...state, [target]: content(state[target], action) };

    if (action.type === actions.contentful.queryContentDone.toString() && data && data.includes) {
      const { Asset, Entry } = data.includes;
      if (Asset && Asset.length) res.assets = addItems(res.assets, Asset);
      if (Entry && Entry.length) res.entries = addItems(res.entries, Entry);
    }

    return res;
  };
}

export default create();
