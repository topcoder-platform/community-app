# TOPCODER COMMUNITIES - FIRST ASSEMBLY

## VIDEO
Video on YouTube available by [link](https://youtu.be/oD3sO11hERM) only

## DEPLOYMENT
To run the project clone git repository https://github.com/topcoder-platform/community-app/tree/develop from the `develop` branch, commit #`d0e27b10143b48711ada642bd9982196ab68d09c`, and apply the patch from the submission archive.

Deployment of the project hasn't been changed, just refer to the project's readme for details.

Basically it's `npm i`, `npm run dev` and open http://local.topcoder-dev.com:3000/ which supposed to point the `127.0.0.1` inside the system's hosts file.

### NOTES
- There could be warnings about 6 lines add whitespace errors during git patch applying. But all these lines are inside snapshot files, so this code is being generated automatically.
- ~~Project has to run using domain `http://local.topcoder-dev.com:3000/`. It's because we use server not only to serve frontend but also for demo API.
  Though for API we have to define absolute paths to work properly on the server side.~~
- For reviewing purpose it's preferable to run `npm run dev` because in dev mode there are more errors can be seen in browser console, in particular server-rendering warnings.

## VERIFICATION

### Linting and tests
All tests for altered components was adjusted.
- To check lint errors, run `npm run lint`
- To perform tests, run `npm run jest`

### Functionality
1. Content page http://local.topcoder-dev.com:3000/ has links to all the pages of the introduced Wipro community: [Home](http://local.topcoder-dev.com:3000/community/wipro/home), [Learning & Certification](http://local.topcoder-dev.com:3000/community/wipro/about), [Challenges](http://local.topcoder-dev.com:3000/community/wipro/challenges) and [Leaderboard](http://local.topcoder-dev.com:3000/community/wipro/leaderboard). There are also examples of [non-existent community page](http://local.topcoder-dev.com:3000/community/wipro/404) and [non-existent community](http://local.topcoder-dev.com:3000/community/404/home).
2. All of the examples can be opened by a direct link to check that server-rendering is correct. Leaderborad page uses Avatar component which breaks server-rendering though by itself this component doesn't introduce any server-rendering issues when using inside community.

#### ~~Leaderboard page server rendering~~
~~To avoid appearing server-rendering error the easiest way is to slightly modify Avatar component so it doesn't use themr. We just need to provide constant strings to className properties instead of themr object variables, like this:~~
```jsx
function Avatar({ theme, url }) {
  return url
    ? <img alt="Avatar" src={url} className="theme.avatar" />
    : <DefaultAvatar className="theme.avatar" />;
}
```
~~After that we can re-run `npm run dev` and check that [Leaderboard](http://local.topcoder-dev.com:3000/community/wipro/leaderboard) page doesn't have server-rendering errors anymore. For sure visual styles of avatar will be broken this time.~~

### Additionally
- fix leaderboard server-rendering (before there was another small issue in this component not related to Avatar, `failed` property in store got undefined value, which wasn't rendered to the store on the server)
- fix `ChallengeListingExample` component (before each time it was created, keyword list and subtracks list was populated with entities again, which lead to duplicates)
