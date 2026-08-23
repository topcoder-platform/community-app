import { ListingContainer } from 'containers/challenge-listing/Listing';
import { BUCKETS } from 'utils/challenge-listing/buckets';

/**
 * Creates a challenge-listing container configured for an auth-change test.
 * The returned instance is used to invoke the lifecycle method directly,
 * without mounting the full connected challenge-listing tree.
 *
 * @param {String|null} tokenV3 Current Topcoder v3 token.
 * @param {String} activeBucket Currently selected challenge-listing bucket.
 * @returns {Object} Container instance and its mocked props.
 */
function createListing(tokenV3, activeBucket) {
  const props = {
    activeBucket,
    auth: {
      tokenV3,
      user: { userId: 123, handle: 'member' },
    },
    communitiesList: { data: [] },
    communityId: null,
    dropReviewOpportunities: jest.fn(),
    filter: {},
    filterState: { recommended: false },
    getCommunitiesList: jest.fn(),
    getReviewOpportunities: jest.fn(),
    loading: false,
    selectBucketDone: jest.fn(),
    setFilter: jest.fn(),
    sorts: {},
  };
  const instance = new ListingContainer(props);
  instance.getBackendFilter = jest.fn(() => ({ back: {}, front: {} }));
  instance.reloadChallenges = jest.fn();
  return { instance, props };
}

describe('challenge listing review opportunities authentication', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('reloads the first review-opportunity page when authentication arrives', () => {
    const { instance, props } = createListing(
      'member-token',
      BUCKETS.REVIEW_OPPORTUNITIES,
    );

    instance.componentDidUpdate({
      ...props,
      auth: { ...props.auth, tokenV3: null },
    });

    expect(props.dropReviewOpportunities).toHaveBeenCalledTimes(1);
    expect(props.getReviewOpportunities).toHaveBeenCalledWith(0, 'member-token');
  });

  test('reloads anonymously after logout so restricted rows cannot remain cached', () => {
    const { instance, props } = createListing(
      null,
      BUCKETS.REVIEW_OPPORTUNITIES,
    );

    instance.componentDidUpdate({
      ...props,
      auth: { ...props.auth, tokenV3: 'member-token' },
    });

    expect(props.dropReviewOpportunities).toHaveBeenCalledTimes(1);
    expect(props.getReviewOpportunities).toHaveBeenCalledWith(0, null);
  });

  test('clears cached opportunities without preloading an inactive bucket', () => {
    const { instance, props } = createListing('member-token', BUCKETS.ALL);

    instance.componentDidUpdate({
      ...props,
      auth: { ...props.auth, tokenV3: null },
    });

    expect(props.dropReviewOpportunities).toHaveBeenCalledTimes(1);
    expect(props.getReviewOpportunities).not.toHaveBeenCalled();
  });
});
