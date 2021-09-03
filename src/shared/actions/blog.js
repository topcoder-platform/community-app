import { redux } from 'topcoder-react-utils';
import Service from 'services/blog';

/**
 * Fetch init
 */
function getCommunityStoriesInit() {
  return {};
}

/**
 * Fetch done
 */
async function getCommunityStoriesDone({ limit }) {
  const ss = new Service();
  return ss.getBlogs(limit, 'Community Stories');
}

export default redux.createActions({
  BLOG: {
    GET_COMMUNITY_STORIES_INIT: getCommunityStoriesInit,
    GET_COMMUNITY_STORIES_DONE: getCommunityStoriesDone,
  },
});
