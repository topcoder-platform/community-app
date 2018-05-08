/**
 * Root reducer for `contentful` segment of Redux store. This segment contains
 * two sub-segments, `preview` and `published`; they have exactly the same inner
 * structure, the only difference is:
 *
 *  - `preview` sub-segment holds information fetched from Contentful Preview
 *    API: the latest versions of content, not necessarily published for public.
 *
 *  - `published` sub-segment holds information fetched from Contentful Content
 *    Delivery API, which returns published content, that is visible to general
 *    public. Thus, this content might be behind, or the same, as the version
 *    from `preview`.
 *
 * This reducer just filters out incoming actions related to its segment, and
 * routes them between `preview` and `published` sub-segments, based on the
 * presence of boolean `preview` field in the action payload objects.
 */

import _ from 'lodash';
import actions from 'actions/contentful';

import { fireErrorMessage } from 'utils/errors';

import space from './space';

const validActions = new Set(_.values(actions.contentful).filter(_.isString));

function create(init) {
  return (state, action) => {
    if (!state) {
      const def = {
        preview: space(undefined, action),
        published: space(undefined, action),
      };
      return init ? _.defaults(init, def) : def;
    }

    if (!validActions.has(action.types)) return state;

    const { error, payload } = action;

    if (error) {
      fireErrorMessage('CMS-related error', '');
      return state;
    }

    const key = payload.preview ? 'preview' : 'published';
    return { ...state, [key]: space(state[key], action) };
  };
}

export default create();
