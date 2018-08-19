# Coding Standards

***Disclaimer:*** *This is the first version of this document. It might contain some mistakes and miss some points. Feedback / questions / suggestions are more than welcome.*

### Content
1.  [Basics](#basics)
    - [JavaSript](#basics-javascript)
    - [Isomorphy](#basics-isomorphy)
    - [SCSS](#basics-scss)
    - [Unit Tests](#basics-unit-tests)
    - [Code Quality](#basics-code-quality)
    - [Documentation](#basics-documentation)
    - [File Names](#basics-file-names)
    - [Banned Dependencies](#banned-dependencies)
2. [React](#react)
3. [Redux](#redux)
4. [Styling](#styling)
5. [Routing](#routing)
6. [Notable Dependencies and Components](#notable-dependencies-and-components)
7. [Advanced](#advanced)

### <a name="basics">Basics</a>

<a name="basics-javascript">**JavaScript:**</a> Prefer ES6 features (we use Babel), follow AirBnB JS style. ESLint is installed and configured (`lint:js` npm script; it is also executed as a part of `lint` and `test` scripts). It is a good idea to install ESLint plugin for your IDE, that will highlight any errors when you write the code. If you really need to violate some ESLint rule: (1) double-check with Google that there is no better way to make the same without violation; (2) disable the rule only for those lines where it is violated; (3) comment, why have you decided to violate it.

Everywhere where it makes sense, sort code elements alphabetically (fields in object definition; functions and class methods, when another order is not enforced by ESlint, etc.). This simplifies navigation around the codebase, thus saves some time during development.

<a name="basics-isomorphy">**Isomorphy:**</a> Community App is an isomorphic ReactJS / Redux application. Most of the code should be located inside [`/src/shared`](https://github.com/topcoder-platform/community-app/tree/develop/src/shared) folder, and it should be compatible both with client-size (browser) and server-side (NodeJS) environments. Where necessary, use `isClientSide()` and `isServerSide()` functions from [`utils/isomorphy`](https://github.com/topcoder-platform/community-app/blob/develop/src/shared/utils/isomorphy.js) to check where the code is being executed. Note that some code, like `onClick` handlers, `componentDidMount()` and `componentWillUnmount()` methods of `React.Component`, is automatically executed at the client-side only, thus does not demand additional checks.

<a name="basics-scss">**SCSS:**</a> We use SCSS for styling. Follow the standard Stylelint rules (they are tested by `lint:scss` npm script; and also as a part of `lint` and `test` scripts). It is a good idea to install Stylelint plugin for your IDE. You'll find [more details on styling below](#styling).

<a name="basics-unit-tests">**Unit Tests:**</a> We use Jest for unit testing. Any updates you want to merge into the codebase should not break the tests (you must properly update the tests affected by your updates). `test` npm script verifies that codebase is free of lint & unit test errors, it should not detect any errors after the merge.

<a name="basics-code-quality">**Code Quality:**</a> In general, you should write a neat and efficient code, covered by adequate amount of comments. Each JS module should have a brief header comment, outlining the content and purpose of that module. Comment all functions / methods, descibing what they do, how they work, what are the types and purposes of their arguments. You may omit such comments for standard React / Redux methods, small functions, etc. You should comment any non-trivial code; or trivial code that appears in strange places. If you note anything that can / should be improved in future, feel free to leave `TODO:` comments, and / or open issue tickets in the repo.

<a name="basics-documentation">**Documentation:**</a> All textual documentation must be in Markdown format, and it should be located inside [`/docs`](https://github.com/topcoder-platform/community-app/tree/develop/docs) or any of its sub-folders. To document REST APIs provided by our server we maintain a Postman collection in the same folder *Does not exist in the develop or master branches yet, but will appear in both soon*.

<a name="basics-file-names">**File Names:**</a> If a JSX file, or a folder containing `index.jsx`, exports a React component as the default export call it using CamelCase, i.g. `MyReactComponent.jsx`, or just `MyReactComponent` for folder. All other files an folders should be named as `yet-another-module.js`.

<a name="banned-dependencies">**Banned Dependencies:**</a> The following npm packages must not be used in the app (if you feel you need any of them, do not hesitate to ask what is the alternative approach we prefer in our code):
- [`classnames`](https://www.npmjs.com/package/classnames);

### <a name="react-redux">React</a>
Split code into components, don't put multiple components into the same file. If a component is styled, put its `index.jsx` and `style.scss` files into a separate folder, named after the component name. You can further put into such folder any related sub-components; but in general use your best judgement to keep a good balance between not too deep folder structure, and not having too much staff on the same level in the same folder. The goal here is to ensure that it is convenient to locate necessary things in our codebase.

Most of your components should be stateless, implemented as function, and located under [`components`](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/components) folder. The state of app (beside some very special exceptions) should be managed by Redux actions / reducers / store; and container components, located inside [`containers`](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/containers) folder, bridge functional components with Redux actions / store. Ideally, a container just provides `mapStateToProps(..)` and `mapDispatchToProps(..)` functions, and connects them to the functional component. If some initialization on mounting / cleanup on unmounting are necessary, then such container becomes a class inherited from `React.Component`; and `componentDidMount(..)` / `componentWillUnmount(..)` methods
are used to implement required functionality.

### <a name="react-redux">Redux</a>

Action modules are located in the [`actions`](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/actions) folder. We use [redux-actions](https://github.com/reduxactions/redux-actions), and, thus, [Flux Standard Actions](https://github.com/acdlite/flux-standard-action).  Note that in `createActions(creators)` method we never list actions at the top level of `creators` object, to ensure that generated actions have verbose names; e.g. for an `actions/sample.js` module we prefer to have `creators` object equal to
```js
{
  SAMPLE: {
    ACTION_1: _.identity,
    ACTION_2: _.noop,
  },
}
```
in this case the names of generated actions will be `SAMPLE/ACTION_1` and `SAMPLE/ACTION_2`, which is convenient during development.

We have [Redux Promise](https://github.com/acdlite/redux-promise) set up to deal with async actions. The most common use case is to fetch some data from a remote service, e.g. Topcoder API. This demands a pair of actions, that should be called like `GET_SOMETHING_INIT` and `GET_SOMETHING_DONE`: the first one is a regular action that saves to Redux store that we have initiated the process, and the second one is the async action that will make it to reducer only when the Promise it has as the payload is resolved or rejected. Typically, you'll want to use as the payload of `GET_SOMETHING_INIT` some ID of the request. So that if this action is dispatched again before the `GET_SOMETHING_DONE` is resolved, it can be handled correctly (typically we'll just store the new ID into Redux state, and we'll silently discard the results of `GET_SOMETHING_DONE` if ID of the request does not match that stored in the state).

Don't put the actual HTTP calls directly into actions. Always implement them as a service inside [`services`](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/services) folder, and use necessary services in the action's payload creator. This simplifies testing / development, as it is easier to mock a stand-alone service module, when necessary. Simple auxiliary functions, that are useful in different places of our code, should be placed inside [`utils`](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/utils) folder.

Redux reducers live in [`reducers`](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/reducers) folder. We use *reducer factories* as our custom solution for async server-side rendering. Details are given in [this document](./why-reducer-factories-and-how-to-use-them.md). Mind that in many cases you should not care much about proper server-side rendering until your code works properly without it.

### <a name="styling">Styling</a>
We use CSS Modules ([`babel-plugin-react-css-modules`](https://github.com/gajus/babel-plugin-react-css-modules)) for simple styling all around. In the cases when some components can be reused in multiple places with somewhat different styling (i.e. you see that for some component the same JS code can be reused, while styles should be different), we use [`react-css-super-themr`](https://github.com/javivelasco/react-css-super-themr).

Generally, there is no need to nest your SCSS code, trying to reproduce nesting of the related HTML markup. During the build, React CSS Modules plugin replaces class names from your stylesheets with specially generated ones, that ensure that there is no clushes between SCSS classes of the same names defined in different SCSS modules. Mind that this replacement is done differently in dev and prod; it is wrong to use generated class names anywhere by taking them from the resulting HTML markup and hard-coding anywhere in the code. The correct way to get class names generated by React CSS Modules plugin is
```js
import style from './style.scss';
const generatedClassName = style['original-class-name-in-style-scss'];
```

We have some global mixins / styles / variables defined in [`styles`](https://github.com/topcoder-platform/community-app/tree/develop/src/styles) folder. When you need to make a component responsive to the window width, you should do it purely by SCSS code, using [these media mixins](https://github.com/topcoder-platform/community-app/blob/develop/src/styles/mixins/_media.scss). All standard Topcoder colors are defined [here](https://github.com/topcoder-platform/community-app/blob/develop/src/styles/_variables.scss) along with some other useful variables. Rather than hardcoding color values directly into your stylesheets, you should just reference corresponding color variables from this file. Spacings between elements and round corners of the elements should be calculated as multiples of `$base-unit` and `$corner-radius`.

Avoid using **transform** rules for components that may have arbitrary children. It makes it not possible to have among children any components opening modal windows.

### <a name="routing">Routing</a>

*TO BE WRITTEN*

### <a name="notable-dependencies-and-components">Notable Dependencies and Components</a>
- [Lodash](https://lodash.com/) for all utility function missing in the standard JS.
- [MomentJS](https://momentjs.com) for advanced date- / time-related functionality.
- We have [money service](https://github.com/topcoder-platform/community-app/blob/develop/src/shared/services/money.js), which allows to make conversions between currencies, using real up-to-date rates from [https://openexchangerates.org](https://openexchangerates.org).
- We have standard [buttons](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/components/buttons) and [tags](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/components/tags) (it is also a good example of react-css-super-themr use). Depending on props these components act either as real buttons, or as button-like links (they are implemented in such way, that switching between these options does not demand any efforts to keep the style).
- [Modal](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/components/Modal) is the base for all modal windows in our app.
- [LoadingIndicator](https://github.com/topcoder-platform/community-app/tree/develop/src/shared/components/LoadingIndicator) says for itself (at the moment it works correctly only against a solid white background);
- Use `topcoder-react-lib/src/utils/errors.js` to deal with errors and error messaging to the website visitors.

### <a name="advanced">Advanced</a>

*TO BE WRITTEN*
