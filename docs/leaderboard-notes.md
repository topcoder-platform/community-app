
# Submission: Top Coder Community Leaderboard

## Submission overview

- Video available on Youtube: https://www.youtube.com/watch?v=nhfSDt2PHMM&feature=youtu.be

**Overview**

- Replicated the leaderboard page (https://tco17.topcoder.com/development/leaderboard/) with similar styling
- Added responsiveness, with same behavior as in the original page
- No lint error introduced
- Added test for each module that was added, with 100% coverage

** Additional change**

Updated the existing Avatar component to make it reusable, using the react-with-styles lib. 
See related forum thread: https://apps.topcoder.com/forums/?module=Thread&threadID=901317&start=0
See implementation note below for details. 

**Added / updated files (excluding minor changes)**

- shared/actions/leaderboard.js
- shared/components/Avatar/
- shared/components/Leaderboard/
  - LeaderboardTable/
  - Podium/
  - PodiumSpot/
  - avatarStyles.js
- shared/reducers/leaderboard.js
- shared/utils/withStyles.js


## Verification steps

1. Downloading source code, installing, applying patch, running the app

```
git clone https://github.com/topcoder-platform/community-app.git
cd community-app
git am -k ../submission.patch
npm install
```

2. Checking lint errors (run `npm run lint` again)

--> No error

3. Checking test coverage

Open ./community-app/__coverage__/lcov-report/index.html in a browser
Check coverage on files listed above (should be all green)

4. Checking UI (check https://tco17.topcoder.com/development/leaderboard/)
  - Leaderboard page available from Example/Content
  - Comparing UI feature to the provided example page
  - Check responsiveness

4. Code review / Implementation


## Updating the Leaderboard: Switching to a real API

- shared/actions/leaderboard.js
  - Update .fetchLeaderboard()
  - Remove .updateMockData()
  - Remove ESlint comments at the top of the file
- Update user properties, if necessary, in:
  - shared/components/Leaderboard/LeaderboardTable/index.js
  - shared/components/Leaderboard/PodiumSpot/index.js

## Creating reusable components with react-with-styles

The Avatar component was updated so it could be reusable. This was done using the react-with-styles module (https://github.com/airbnb/react-with-styles), which allows creation of themes and the usage of styling objects that can be passed to components though props to customize their appearance. 

The documentation explains in some details how to use the library, but to give a general overview, this is how react-with-styles works: 

- Create a module that exports an object with shared theme information (color palette, fonts, media queries, etc.)
- Registering (initial configuration) in a withStyles.js file:
	- Register your default theme
	- Register your interface (Aphrodite, JSS, Radium, React Native)
- Import your withStyles.js configuration file in a component; you will be able to access theme information and define inline styles with data passed through props

The current implementation is simplest possible in order to be able to pass styling objects through props: 

- The withStyles.js configuration file has been placed under shared/utils/
- No theme was defined, as it wasn't needed; The default theme has been registered with an empty object. 
- Arbitrarily, Aphrodite (https://github.com/khan/aphrodite) as been chosen for the inline styles interface, but other should work as well with the current implementation. 

**Implementation in the Avatar component**

The Avatar component demonstrate the usage of inline styles with react-with-styles. 
The component includes a default styling object, which is used when no custom styling object hasn't been passed though props: 

```
const defaultStyles = {
  height: '32px',
  width: '32px',
  borderRadius: '16px',
};
 ```

This object can be used in JSX to apply styling to an element as follow: 

```
<img alt="Avatar" src={url} {...css(defaultStyles)} />
```

The Avatar can be then used as any other component. It is for instance used that way in the TopcoderHeader component. 

A more interesting use case is in the leaderboard. In it default appearance, the Avatar is just a rounded image with a set height and width. But in the leaderboard, the size of the Avatar varies, both because of its use in different components and responsiveness, and it has a thick border which can be of different colors. 
Different styles have been defined to account for the different appearance the Avatar can have (see shared/components/Leaderboard/avatarStyles.js): 

```
const baseAvatarStyles = {
  height: '100%',
  width: '100%',
  borderRadius: '50%',
  borderWidth: '5px',
  borderStyle: 'solid',
};

const defaultAvatarModifier = {
  borderColor: 'rgba(0, 0, 0, 0.05)',
};

const goldAvatarModifier = {
  borderColor: '#fce217',
};

const silverAvatarModifier = {
  borderColor: '#a9bcd4',
};

const bronzeAvatarModifier = {
  borderColor: '#bd731e',
};

const defaultAvatarStyles = [baseAvatarStyles, defaultAvatarModifier];

const goldAvatarStyles = [baseAvatarStyles, goldAvatarModifier];

const silverAvatarStyles = [baseAvatarStyles, silverAvatarModifier];

const bronzeAvatarStyles = [baseAvatarStyles, bronzeAvatarModifier];

export {
  defaultAvatarStyles,
  goldAvatarStyles,
  silverAvatarStyles,
  bronzeAvatarStyles,
};
```

Note that the width and height is set to 100%. The approach of letting the component be fluid, and having the layout control their size is recommended (see http://stackoverflow.com/questions/26882177/react-js-inline-style-best-practices) as is makes the components more adaptable and reusable. 

The the relevant styling object can be selected and passed to the Avatar by the component. For instance, in the PodiumSpot component, the proper styling object is selected based on the user rank (1, 2 or 3, to select a gold, silver or bronze Avatar): 


```
import { goldAvatarStyles, silverAvatarStyles, bronzeAvatarStyles } from '../avatarStyles';

...

const CUSTOM_STYLES = {
  1: goldAvatarStyles,
  2: silverAvatarStyles,
  3: bronzeAvatarStyles,
};

...

<Avatar url={competitor.avatarUrl} customStyles={CUSTOM_STYLES[competitor.rank]} />
```

**Useful resources**

- https://github.com/airbnb/react-with-styles
- https://github.com/airbnb/javascript/tree/master/css-in-javascript#themes
- http://stackoverflow.com/questions/26882177/react-js-inline-style-best-practices
