import actions from 'actions/challenge-listing';
import reducer from 'reducers/challenge-listing';

describe('challenge listing review-opportunity cache', () => {
  test('drops caller-specific review opportunities without changing other buckets', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const allChallenges = [{ id: 'public-challenge' }];
    const populatedState = {
      ...initialState,
      allChallenges,
      allReviewOpportunitiesLoaded: true,
      lastRequestedPageOfReviewOpportunities: 3,
      loadingReviewOpportunitiesUUID: 'old-request',
      reviewOpportunities: [{ id: 'restricted-opportunity' }],
    };

    const nextState = reducer(
      populatedState,
      actions.challengeListing.dropReviewOpportunities(),
    );

    expect(nextState).toEqual(expect.objectContaining({
      allReviewOpportunitiesLoaded: false,
      lastRequestedPageOfReviewOpportunities: -1,
      loadingReviewOpportunitiesUUID: '',
      reviewOpportunities: [],
    }));
    expect(nextState.allChallenges).toBe(allChallenges);
  });
});
