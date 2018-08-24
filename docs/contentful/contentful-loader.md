# `ContentfulLoader`

The `ContentfulLoader` container is a generic tool for content loading from
[Contentful CMS](https://www.contentful.com/).

- [Oveview](#oveview)
- [Detaled Reference](#detailed-reference)
  - [`ContentfulLoader` properties](#contentfulloader-properties)
    - [`assetIds`](#assertids-string--string)
    - [`assetQueries`](#assetqueries-boolean--object--object)
    - [`entryIds`](#entryids-string--string)
    - [`entryQueries`](#entryqueries-boolean--object--object)
    - [`environment`](#environment-string)
    - [`maxage`](#maxage-number)
    - [`preview`](#preview-boolean)
    - [`refreshMaxage`](#refreshmaxage-number)
    - [`render`](#render-functiondata)
    - [`renderPlaceholder`](#renderplaceholder-function--object)
    - [`spaceName`](#spacename-string)

# Overview

`ContentfulLoader` accepts four optional properties: `assetIds`, `assetQueries`,
`entryIds`, and `entryQueries`, that allow to specify required content either
by [Contentful queries](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters),
or by IDs of specific assets and entries. `ContentfulLoader` will load required
content, and then pass it into the render function provided via `render`
property. Until the content is loaded, the opitonal `renderPlaceholder` property
allows to render a loading indicator.

Mutliple instances of `ContentfulLoader` container, under the hood, rely on a
common segment of Redux store, and reuse loaded content between instances. They
also take care about garbage collection from the store.

To access previews of unpublished content, `ContnentfulLoader` accepts `preview`
boolean property, which redirects all content requests from that loader instance
to the [Content Preview API](https://www.contentful.com/developers/docs/references/content-preview-api/).

The minimal example, loading of all content entries from Content Preview API:
```js
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';

export default function ContentfulLoaderExample() {
  return (
    <ContentfulLoader
      entryQueries
      preview
      render={data => <pre>{JSON.stringify(data, null, '  ')}</pre>}
      renderPlaceholder={LoadingIndicator}
    />
  );
}
```

The structure of stringified data will be similar to:
```json
{
  "assets": {
    "items": {},
    "matches": []
  },
  "entries": {
    "items": {
      "DAQMCwkCBggKCAQABAwECw": {
        "sys": { ... },
        "fields": { ... }
      },
      "AwcLBQgJAAcFBgUGBAkGDg": {
        "sys": { ... },
        "fields": { ... }
      }
    },
    "matches": [{
      "sys": { "type": "Array" },
      "total": 2,
      "skip": 0,
      "limit": 100,
      "items": [
        "DAQMCwkCBggKCAQABAwECw",
        "AwcLBQgJAAcFBgUGBAkGDg"
      ]
    }]
  }
}
```
In this example, the `entryQueries` flag of `ContentfulLoader` is interpreted as
a single query to get all entries from Contentful space. The query result is
stored under `entries.matches[0]` path, it has an array of IDs of the matched
items, and some additional information about the qeury. The matched items
themselves are returned via `entries.items` map.

By default, `ContentfulLoader` uses **master** environment of the **default**
Contentful space (configured in [app config](../../config)). Additional spaces
and environments can be defined in the config, and used by specific loader when
its `spaceName` and `environment` props are explicitly set.

# Detailed Reference

### `ContentfulLoader` properties

- ### **`assetIds: String | String[]`**
  *Optional. Undefined by default.*

  A single asset ID, or an array of asset IDs, to be loaded from Contentful.

- ### **`assetQueries: Boolean | Object | Object[]`**
  *Optional. Undefined by default.*
  
  Asset queries to execute. If `true`, all assets will be queried; otherwise the
  query object, or an array of query objects, is accepted. Each query object may
  have any options described in
  [Contentful reference](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters),
  except of *select* option, which is not properly supported, at the moment.

  For example, to query all assets created prior to specific date, given as an
  ISO timestamp, you can use such query:
  ```json
  {
    "sys.createdAt": { "lt": "2017-01-01T12:00:00Z" }
  }
  ```

- ### **`entryIds: String | String[]`**
  *Optional. Undefined by default.*

  A single entry ID, or an array of entry IDs, to be loaded from
  Contentful.

- ### **`entryQueries: Boolean | Object | Object[]`**
  *Optional. Undefined by default.*
  
  Entry queries to peform. If `true`, all
  entries will be queried; otherwise the query object, or an array of query
  objects, is accepted. Each query object may have any options described in
  [Contentful reference](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters),
  expect of *select* option, which is not properly supported, at the moment.

  For example, to query all entries of some type `"entryType"` with a free-text
  search on a specific field, say `"title"`, you should use such query:
  ```json
  {
    "content_type": "entryType",
    "fields.title": { "match": "a text to search for" }
  }
  ```

- ### **`environment: String `**
  *Optional. Defaults to **master***

  Specifies Contentful environment to use.

- ### **`maxage: Number`**
  *Optional. Milliseconds. Defaults to 5 &times; 60 &times; 1000 (5 mins).*

  Each time you request a `ContentfulLoader` to load some assets / entries, or
  perform some queries, it looks first into the segment of Redux store, where
  the results of previous content loading and querying operations are stored.
  If the content with requested IDs, or results of specified queries are found
  there, and they are not older than `maxage` value, they are passed into the
  render function without waiting for the result of the actual call to
  Contentful APIs, which still may be performed, or not, depending on the age
  of content stored in the Redux store, and the value of `refreshMaxage`
  property.

  Note, when an instance of `ContentfulLoader` is destroyed, the content and
  results of queries requested by that instance are not removed from the Redux
  store immediately. The content garbage collection is performed each time any
  `ContentfulLoader` instance attempts to load or query content. The garbage
  collector drops from the store all content and query results that are older
  than 5 minutes, and are not used by any existing instance of
  `ContentfulLoader`.

- ### **`preview: Boolean`**
  *Optional. Defaults to* `false`.

  When `true`, all requested content and queries will be directed to
  Content Preview API; otherwise they will go to the main Content Delivery API,
  which serves only published content.

- ### **`refreshMaxage: Number`**
  *Optional. Milliseconds. Defaults to 60 &times; 1000 (1 min).*

  Each time you create a new instance of `ContentfulLoader`, or changes
  properties of an existing one, it will check the timestamps of all content and
  content queries it relies on, and it will silently reload any content and
  queries that are older than `refreshMaxage` value. This reload will happen
  silently, i.e. the previous version of the content and query result will be
  used up to the moment when the refreshed data are fetched. The reload will be
  visible only if some of the requested content or queries are older than
  `maxage` value. Typically, you want to have `maxage` significantly larger
  than `refreshMaxage`, so that when user interacts with a page, it does not
  notice data reloads, if they change no data.

- ### **`render: Function(data)`**

  The rendering function. It will be called once all requested content and
  queries are resolved. It should return ReactJS node to display inside the
  loader. The `data` object with the following structure will be passed in as the
  only argument of this function:

  - `data.assets.items: Object`
    
    A map with asset IDs as keys,
    and corresponding asset objects as values. It will contain all assets
    explicitly requested via `assetIds` property, and also any other assets
    matched by `assetQueries`.

  - `data.assets.matches: Object[]`

    An array of matches found
    for `assetQueries`, listed in the same order as the queries. If a single
    query was requested, this still will be an array with a single element.
    Each element will be an object with the following fields:

    - `items: String[]` 
      
      Array of IDs of matched assets.
      The length of this array will be the minimum between `limit` and `total`.
      Mind the pagination! The actual asset object can be found by these IDs
      in `data.assets.items` map (see above);

    - `limit: Number`
    
      The maximal number of assets that API returns for the query;

    - `skip: Number`
    
      The number of skipped assets (pagination);

    - `total: Number`
    
      The total number of assets found by API for that query;

  - `data.entries.items: Object`
  
    A map with entry IDs as keys,
    and corresponding entry objects as values. It will contain all entries
    explicitly requested via `entryIds` property, and also any other entries
    matched by `entryQueries`.

  - `data.entries.matches: Object []`
  
    An array of matches found
    for `entryQueries`, listed in the same order as the queries. If a single
    query was requested, this still will be an array with a single element.
    Each element will be an object with the following fields:

    - `items: String[]`
    
      Array of IDs of matched entries.
      The length of this array will be the minimum between `limit` and `total`.
      Mind the pagination! The actual asset object can be found by these IDs
      in `data.entries.items` map (see above);

    - `limit: Number`
    
      The maximal number of entries that API returns for the query;

    - `skip: Number`
    
      The number of skipped entries (pagination);

    - `total: Number`
    
      The total number of entries found by API for that query;

  - `data.preview: Boolean`

    `true` if data were fetched from Content Preview API; `false` otherwise.

- ### **`renderPlaceholder: Function | Object`**
  *Optional. Undefined by default*

  The component, or ReactJS node, to be rendered inside the container each time
  when any of the requested content or queries is not found in the Redux store
  (or is too old, comparing to `maxage`), and thus is loaded.

- ### **`spaceName: String `**
  *Optional. Defaults to **default***

  Specifies Contentful space to use. The actual space ID and keys should be
  configured in the application config.
