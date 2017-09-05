# How To Deep-Link (Correct Use of URL Query Params Within The App)

### Problem
For some page you want to expose its state (or part of the state) via URL query params so that:
- When state is updated, the URL is updated accordingly to desribe (probably partially) the page state;
- When that URL is used to access the app, the page is opened with the state described by the URL query params.

### Solution
The key idea is simple: internally, you still use Redux actions / reducers / store to describe and modify entire state of the page. Inside reducer's action handlers, related to that parts of the state, that you want to expose via URL query, you add the code to properly update URL each time reducer re-evaluates related pieces of the state. Inside that reducer's factory you, in case of server-side rendering, check query parameters of HTTP request and create proper intial state of Redux store. To navigate around the app / change the page state from within the app, you just dispatch related actions, URL will be automatically updated by reducers. **In the cases when you programmatically change the route inside the app, using react-router, related actions should be dispatched after transition, as explained below**.

### Examples
At the moment of writing this instruction, this approach is used inside challenge listings to expose challenge filters and selected buckets via URL query; and also within challenge details page to expose different detail tabs. The implementation notes below will refer to the second usage.

### Implementation

- In case of challenge details page, selection of the details tabs, is controlled by `CHALLENGE/SELECT_TAB` action in [Challenge Actions Module](https://github.com/topcoder-platform/community-app/blob/develop/src/shared/actions/challenge.js), and it is handled by `onSelectTab(..)` handler in [Challenge Reducer Module](https://github.com/topcoder-platform/community-app/blob/develop/src/shared/reducers/challenge.js). This action and its handler are trivial: the action's payload is just a string key of the tab to be selected; and the handler just writes that key into `selectedTab` field of the related state segment. To write the tab into URL query param as well, we change the handler to become:
  ```js
  function onSelectTab(state, { payload }) {
    updateQuery({ tab: payload });
    return { ...state, selectedTab: payload };
  }
  ```
  `updateQuery(..)` is an auxiliary function from [`utils/url` module](https://github.com/topcoder-platform/community-app/blob/develop/src/shared/utils/url.js). It does nothing at the server-side; and at the client-side it writes provided options into URL query params. The argument of this function is a JS object, which keys are names of URL query params to set / update / remove, and values are the values of those params to set (`undefined` values will remove corresponding params from the URL, if they are present there). Query params present inside URL, but not mentioned inside `updateQuery(..)`'s argument will conserve their values. `updateQuery(..)` also takes care about proper URL-encoding of your values.

- Inside the factory of challenge reducer you will find the code like
  ```js
  export function factory(req) {
    if (req && req.url.match(/^\/challenges\/d+/)) {
      /* Some code */
      let state = { /* Predefined initial state. */ };
      if (req.query.tab) {
        state = onSelectTab(state, { payload: req.query.tab });
      }
      /* More state evaluations. */
    }
    /* Some more code for server-side rendering of other routes. */
    /* Client-rendering code. */
  }
  ```
  When user comes to the relevant page using an URL with `tab` query param present, this server-side rendering code simply re-uses `onSelectTab(..)` action handler to modify intial Redux state accordingly, thus when the page is rendered it will be rendered in the proper state (selected details tab open).

- To select tabs within the page you simply dispatch `CHALLENGE/SELECT_TAB` action. The URL will be automatically updated by action's handle - no need to worry about it.

- To make a transition to the page, from another route within the app, and select the desired tab you:
  - As usually use `<Link>` component from `react-router` to make transition (in our codebase we have an auxiliary wrapper around it in [`utils/router` module](https://github.com/topcoder-platform/community-app/blob/develop/src/shared/utils/router/index.jsx), also the standard [buttons](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/components/buttons) and [tags](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/components/tags) are rendered as `react-router` `<Link>`s when appropriate; the idea stay the same if you use it);
  - In `to` prop you pass the target endpoint without query params (specifying query params within this prop makes no sense: it will update the URL, but won't update Redux state properly).
  - Inside `onClick` prop you dispatch necessary action(s), wrapped inside `setImmediate(..)` method. For example, to move from the challenge listing to the challenge details page of a challenge with ID 12345, and with winners tab open (provided that the challenge is completed and thus it is appopriate to link to that tab) you do something like this:
  ```jsx
  <Link
    onClick={() =>
      setImmediate(() => selectTab('winners'))
    }
    to="/challenges/12345"
  >Winners</Link>
  ```
  where `selectTab(..)` function is mapped to the corresponding action within page (component) container.
  
  `setImmediate(..)` is necessary here to delay update Redux store after the endpoint transition is handled by `react-redux`; because of `to="/challenges/12345"` `react-redux` will remove any query params from URL. The `onClick` callback, when wrapped inside `setImmediate(..)` will be triggered right after the transition, it will properly update Redux state, and set the correct URL query. From visitor's point of view it happens with no pause in beween (i.e. when the page is loaded he already will see the target tab).

### Caveats
- When you read url query params at the server side, any array with 20 and more elements will be parsed as an object with keys equal to array element indices. Under the hood it is done by [qs](https://www.npmjs.com/package/qs) module on purpose. Don't try to reconfigure `qs`, just remember that you can get an object when you expect an array, and handle that situation correctly.

  **P.S.:** Say you re-configure `qs` to parse arrays with 1000 elements as arrays, not objects. In this case, for an an URL like `/endpoint?q1[999]=x` ExpressJS will have to create inside HTTP request's query object a field `q1` equal to array with 1000 elements (999 undefined, and the last one equal `x` string). It will open a straightfoward way to DDOS the server with such requests.
