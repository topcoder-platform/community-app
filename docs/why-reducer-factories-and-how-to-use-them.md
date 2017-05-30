# Why Reducer Factories and How to Use Them?

Just following documentation of [Redux](http://redux.js.org) and [redux-actions](https://github.com/acdlite/redux-actions) you would use `handleAction(type, reducer|reducerMap, defaultState)` or `handleActions(reducerMap, defaultState)` to define separate reducers for FSA ([Flux Standard Actions](https://github.com/acdlite/flux-standard-action)), and `combineReducers(reducers)` to combine them into the single reducer for your Redux store. These reducers define both the inial state of Redux store, and all possible mutations of the state in response to dispatched Redux actions.

Now we want to support server-side rendering, i.e. in response to user's request for a page we want to generate entire page at the server-side and serve it to the user as one piece, rather then serving the basic template of the page and then making user to wait until the client-side loads all necessary data from the server. Reducer factories is one of alternative ways to make it work.

The idea is simple: we wrap reducer definitions inside factory functions, which take the HTTP request object as an optional argument, and return a promise which resolves to the reducer. When the optional argument is provided, the factory assumes server-side rendering, and using any relevant data from the HTTP request, it takes care about generation of the initial state most appropriate for that request. When the argument is not provided, the factory assumes client-side rendering and uses the default initial state. This way we can conveniently blend-in any async operations into generation of the reducer for Redux store, and, in the case of server-side rendering, to optionally make the initial state of the store dependent on any data from the HTTP request. Also, there is no problem to use reducer factories along with simple reducers.

A basic example of this idea can be found at the `/examples/data-fetch` route of the App located in this repo. In this example we just make a remote call to a public endpoint of Topcoder API to get the list of active challenges. There are two related actions, defined in [`/src/shared/actions/examples/data-fetch.js`](../src/shared/actions/examples/data-fetch.js):
-   `examples.dataFetch.fetchDataInit` just signals to the reducer that we start loading the data, thus we should drop any previously loaded data, and set the loading flag, which will tell React to show the loading indicator. This action does not assume any payload;
-   `examples.dataFetch.fetchDataDone` has as the payload the promise, which resolves to the fetched data. That promise is created with help of [fetch()](https://github.com/matthew-andrews/isomorphic-fetch). As we use [redux-promise](https://github.com/acdlite/redux-promise) middleware, when you dispatch this action, it does not arrive to the Redux store immediately, instead it is automatically delayed until the promise in its payload is resolved or rejected. Once it happens, the payload is automatically replaced with the result or error, the error flag of the action is set, and only after that the resulting FSA actually arrives to the store to be handled by reducers.

The relevant reducer is defined inside [`/src/shared/reducers/examples/data-fetch.js`](../src/shared/reducers/examples/data-fetch.js). First of all, we have this code, which defines the reducer:

```
/**
 * Handles examples.dataFetch.fetchDataDone action.
 * @param {Object} state Previous state.
 * @param {Object} action Action.
 */
function onDone(state, action) {
  return {
    ...state,
    data: action.error ? null : action.payload,
    failed: action.error,
    loading: false,
  };
}

/**
 * Creates a new dataFetch reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return dataFetch reducer.
 */
function create(initialState) {
  return handleActions({
    [actions.examples.dataFetch.fetchDataInit](state) {
      return {
        ...state,
        data: null,
        failed: false,
        loading: true,
      };
    },
    [actions.examples.dataFetch.fetchDataDone]: onDone,
  }, initialState || {});
}
```

The default export from the module is just a simple reducer with the empty (`{}`) initial state:
```
/* Default reducer with empty initial state. */
export default create();
```

The reducer factory is exported separately, and it is quite short and simple as it maximally re-uses existing code:
```
/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for efficient server-side rendering).
 * If HTTP request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory(req) {
  if (req && req.url.endsWith('/examples/data-fetch/server')) {
    return toFSA(actions.examples.dataFetch.fetchDataDone())
      .then(res => create(onDone({}, res)));
  }
  return Promise.resolve(create());
}
```

Let's see how it works line by line.

1.  We check whether the factory is called during server-side rendering, and whether we are rendering the route relevant to the section of Redux store's state, managed by this reducer:
    ```
    if (req && req.url.endsWith('/examples/data-fetch/server')) {
    ```
    if it is not the case, we just return the promise resolved to the reducer with empty initial state:
    ```
    return Promise.resolve(create());
    ```

2.  To fetch relevant data we just use the action we already have:
    ```
    toFSA(actions.examples.dataFetch.fetchDataDone())
    ```
    `actions.examples.dataFetch.fetchDataDone()` triggers the API call and returns the action object with the API call promise as the payload. `toFSA(..)`, from our small helper library [`/src/shared/utils/redux.js`](../src/shared/utils/redux.js), transforms that action the same way as `redux-promise` middleware would do. Note that we don't dispatch this action, the Redux store is not even created at this point! The reason for this transform is that this way we can re-use the code from `onDone(..)` handler to easily create the intial state, and the resulting reducer as simple as:
    ```
    .then(res => create(onDone({}, res)));
    ```
    
    Sure, we don't have to re-use action handling code from reducer, when it does not makes sense. For example, the piece of code in this section can also be written as:
    ```
    actions.examples.dataFetch.fetchDataDone().payload
    .then(res => res.json(), () => { failed: true })
    .then(res => create({
      data: res.data || null,
      failed: Boolean(res.failed),
    }));
    ```

Now, to combine reducers wrapped inside factories together with each other, and probably with simple reducers, we do something like this [`/src/shared/reducers/examples/index.js`](../src/shared/reducers/examples/index.js):
```
import { combineReducers } from 'redux';
import { resolveReducers } from 'utils/redux';
import { factory as dataFetchFactory } from './data-fetch';
import { factory as anotherReducerFactory } from './another-reducer';
import simpleReducer from './simpleReducer';

export function factory(req) {
  return resolveReducers({
    dataFetch: dataFetchFactory(req),
    anotherReducer: anotherReducerFactory(req),
  }).then(reducers => combineReducers({
    ...reducers,
    simpleReducer,
  }));
}
```

### ... and what about the ReactJS side?

Have a look into [`/src/shared/containers/examples/DataFetch/index.jsx`](../src/shared/containers/examples/DataFetch/index.jsx). ReactJS containers are still responsible for client-side loading of data in the case when user actions inside the running App change the current route. Related code looks like this:
```
componentDidMount() {
  if (!this.props.data && !this.props.loading) this.props.loadData();
}
```
We check that data necessary for this component are not in the state already, nor are being loaded currently, and if both true, we trigger the loading process. The way this container is connected to the Redux store's dispatch, `loadData()` automatically dispatches the pair of necessary actions:
```
loadData: () => {
  dispatch(actions.examples.dataFetch.fetchDataInit());
  dispatch(actions.examples.dataFetch.fetchDataDone());
},
```
Placing the first piece of code inside `componentDidMount()` ensures that this code is executed only client-side, and it will work properly no matter whether the server-sider data loading is working properly or not.

### Final note

It may look that due to reducer factories we have dublicate data loading code both inside the component and inside the factory. A closer look reveal, however, that the code inside component and inside reducer factories is working differently. During client-side data loading we always should:

1.  Test that data have not been loaded already, nor are being loaded now;
2.  Write data-loading flag into the state, so that ReactJS can show loading indicator (1-st update of the UI);
3.  Load the data and write them into the state, thus triggering 2-nd update of UI.

With our implementation of server-side loading we do just what we need in this case:
1.  Check HTTP request, to decide whether we need to load data for this page;
2.  We load the data and write them into the initial state;
3.  Then we create the store with the necessary intial state and render the page.
