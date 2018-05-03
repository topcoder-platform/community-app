# How to Add a New Topcoder Community?
*NOTE: Related code is not quite stable yet, be aware that this document might be out of sync with the actual behavior. Current version of this instruction corresponds to the code commit `ec6730c9fc02ee8a4bece061cae5a3eb9d2ce779`*

To add a new community with the name **demo**, we should follow the following protocol:

1.  All community-specific assets should be added to the
    `/src/assets/themes/demo`, or `/src/assets/images/communities/demo` folder
    (prefer the later for new communities).

2.  Community meta-data file should be created under the path `/src/server/tc-communities/demo/metadata.json`:
    ```json
    {
      "authorizedGroupIds": ["12345"],
      "challengeFilter": {
        "groupIds": ["12345"]
      },
      "challengeListing": {},
      "communityId": "demo",
      "groupIds": ["12345"],
      "leaderboardApiUrl": "https://api.topcoder.com/v4/looks/0/run/json/",
      "logos": [
        "/themes/demo/logo_topcoder_with_name.svg"
      ],
      "additionalLogos": [
        "/themes/demo/logo_topcoder_with_name.svg"
      ],
      "hideSearch": true,
      "chevronOverAvatar": true,
      "menuItems": [
        {
          "title": "Home",
          "url": "."
        }, {
          "title": "Learn",
          "url": "learn"
        }, {
          "title": "Challenges",
          "url": "challenges"
        }, {
          "title": "Leaderboard",
          "url": "leaderboard"
        }
      ],
      "newsFeed": "http://www.topcoder.com/feed",
      "subdomains": ["demo"],
      "description": "A berief description which will be displayed in dashboard",
      "image": "1.jpg",
      "terms": [21153]
    }
    ```
    Its fields serve the following purposes:

    > Note that we have three places where user groups can be mentioned in this config: `authorizedGroupIds` (Optional) controls authorizations necessary to access community; `groupIds` controls who is considered to be a member of community; and `groupIds` (Optional) inside `challengeFilter` allows to filter challenges included into community by their user group affinity.
    >
    > Technically, when application server serves configuration object for a specified community, it extends each of these arrays by descendant groups (it helps to significantly simply a lot of related code).

    -   `authorizedGroupIds` - *String Array* - Optional. Array of group IDs. If specified, access to the community will be restricted only to authenticated visitors, included into any of these groups, or any of their descendant groups. If undefined, community will be accessible to any visitors (including non-authenticated ones).
    -   `challengeFilter` - *Object* - Challenge filter matching challenges related to the community. This object can include any options known to the `topcoder-react-lib/src/utils/challenge-listing/filter.js` module, though in many cases you want to use just one of these:
        ```js
        /* Matches challenges belonging to any of the groups listed by ID. */
        {
          "groupIds": ["12345"]
        }

        /* Matches challenges tagged with at least one of the tags. */
        {
          "tags": ["JavaScript"]
        }

        /* Matches challenges belonging to any of the groups AND tagged with
         * at least one of the tags. */
        {
          "groupIds": ["12345"],
          "tags": ["JavaScript"]
        }
        ```
    -   `challengeListing` - *Object* - Optional. When provided, it holds configuration for the challenge listing shown inside the community. This config object may have the following fields:
        - `ignoreCommunityFilterByDefault` - *Boolean* - Optional. When set, the community challenge filter won't be selected by default when the user enters community challenge listing page. Defaults to `false` (the filter will be automatically selected when a visitor enters the listing).
        - `openChallengesInNewTabs` - *Boolean* - Optional. When set, challenge listing opens challenge details pages in new tabs. Defaults to `true`.
        - `prizeMode` - *String* - Optional. Modifies the way the prizes are shown in challenge cards. Valid values are:
            - `hidden` - Prize components are just hidden;
            - `money-eur` - Prizes are converted to EUR;
            - `money-inr` - Prizes are converted to INR;
            - `money-usd` - Prizes are shown in USD (no actual conversion needed);
            - `points` - Points are shown rather than the prizes. The points are taken from `drPoints` field of challenge objects. There is no prizes tooltip in this case.
    -   `communityId` - *String* - Unique ID of this community.
    -   `groupIds` - *String Array* - Community user groups. All members of these groups, or their descendants, will be treated as members of the community. ***Join Community functionality, where available, adds user to the first group from this array. Most probably, this behavior will be updated soon.***
    -   `hidden` - *Boolean* - Optional. If set to `true`, the community won't be visible in community selection dropdowns in the challenge listing and communities header navigation. Still will be accessible via a direct link.
    -   `leaderboardApiUrl` - *String* - Endpoint from where the leaderboard data should be loaded.
    -   `logos` - *String Array | Object Array* - Array of image URLs to insert as logos into the left corner of community's header, alternatively the array may contain JS objects of shape
        ```
        {
          "img": "<SOME-IMAGE-URL>",
          "url": "https://www.topcoder.com"
        }
        ```
        For such elements `img` will be used as the image source, and `url` will be the redirection URL triggered by a click on the logo.
    -   `additionalLogos` - *String Array* - Array of image URLs to insert as logos into the right corner of community's header.
    -   `hideSearch` - *Boolean* - Hide/Show the search icon.
    -   `chevronOverAvatar` - *Boolean* - Render a *chevron-down* instead of the user avatar.
    -   `menuItems` - *Object Array* - Specifies options for the community navigation menu (both in the header and footer). Each object MUST HAVE `title` and `url` fields. For now, `url` field should be a relative link inside the community, within the same path segment.
    -   `newsFeed` - *String* - Optional. URL of an XML blog feed to be used to render news section at a custom page. To actually render the news section, you should include it into the page code like (also see as example `/src/shared/components/tc-communities/communities/wipro/Home/index.jsx`):
        ``` js
        /* This goes inside the import section in the beginning of the file. */
        import NewsSection from 'components/tc-communities/NewsSection';

        /* This goes into appropriate place of the render function. */
        <NewsSection news={props.news} />
        ```
        The `<NewsSection />` component does not render anything, if its `news` property is *null* or an empty array, thus it can be kept inside the page code even when there is no news feed configured for a community.
    - `subdomains`: Optional. Array of sub-domains where this sub-community should be served. If provided, the first sub-domain in the array will be considered as the main one, i.e. when we need to land a visitor to the community we'll redirect him to that sub-domain.
    - `description`: A berief description which will be displayed in dashboard.
    - `image`: A image that located at `/assets/images/tc-communities/background` will be displayed in dashboard
    - `terms` - *Array of Numbers* - Optional. If provided, it should hold an array of Topcoder term of use IDs; agreement to all these terms will be necessary to self-join the community. Beside this, it has no other effects at the moment.

3.  Custom pages of the community (anything beside `Challenges` and `Leaderboard`) should be created inside `/src/shared/components/tc-communities/communities/demo`. At the moment all communities have two custom pages: `Home` and `Learn`, you may just copy these from an existing community, and then customize to your particular needs.

4.  The routing inside community, and code splitting of the related code, should be set up inside `/src/shared/routes/Communities`:
    - Copy/paste one of the existing community folders and rename it into `/src/shared/routes/Communities/Demo`;
    - Inside `/src/shared/routes/Communities/Demo/index.jsx` you should change the name of code chunk in two places it is present (as value of `chunkName` prop, and inside `webpackChunkName` "magic comment");
    - Inside `/src/shared/routes/Communities/Demo/Routes.jsx` you define necesary routing, as with usual `react-router` routing code;
    - Finally, you link this routing code into `/src/shared/routes/Communities/Routes.jsx`.

5.  At this point **demo** community is ready and accessible at the `/community/demo` route of the App (i.e., if we deploy dev version of the App to `community-west.topcoder-dev.com`, community will be accessible as `community-west.topcoder-dev.com/community/demo`).

    To make **demo** community accessible via a dedicated sub-domain, e.g. like `demo.topcoder-dev.com`, you should use the `subdomains` property of community configuration. Beside it you should:
    -   Ensure that the web-server where the App is deployed allows access to the subdomain `demo.topcoder-dev`, and redirects incoming requests to the App.
    -   Ensure that Topcoder `accounts-app` allows to authenticate from the new subdomain address.
