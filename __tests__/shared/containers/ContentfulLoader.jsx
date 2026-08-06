import { mapDispatchToProps } from 'containers/ContentfulLoader';

jest.mock('actions/contentful', () => {
  const action = type => (...args) => ({ payload: args, type });
  return {
    __esModule: true,
    default: {
      contentful: {
        bookContent: action('BOOK_CONTENT'),
        bookQuery: action('BOOK_QUERY'),
        freeContent: action('FREE_CONTENT'),
        freeQuery: action('FREE_QUERY'),
        getContentDone: action('GET_CONTENT_DONE'),
        getContentInit: action('GET_CONTENT_INIT'),
        queryContentDone: action('QUERY_CONTENT_DONE'),
        queryContentInit: action('QUERY_CONTENT_INIT'),
      },
    },
  };
});
jest.mock('utils/SSR', () => () => Component => Component);

test('returns the Redux middleware promises for asynchronous loads', () => {
  const middlewarePromise = Promise.resolve('dispatched');
  const dispatch = jest.fn(() => middlewarePromise);
  const mapped = mapDispatchToProps(dispatch);

  const getResult = mapped.getContent(
    'entry-id', 'entries', false, 'default', 'master',
  );
  const queryResult = mapped.queryContent(
    'query-id', { content_type: 'route' }, 'entries', false, 'default', 'master',
  );

  expect(getResult).toBe(middlewarePromise);
  expect(queryResult).toBe(middlewarePromise);
  expect(dispatch).toHaveBeenCalledTimes(4);
});
