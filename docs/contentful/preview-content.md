# Preview content
The community app implements examples for almost all Contentful types from [TC core config](https://github.com/topcoder-platform/community-app/blob/develop/config/contentful/tc-core.json). Those examples are accessible under: `/examples/contentful/{COMPONENT_NAME}/{COMPONENT_ID}?spaceName=XXX` route URL. Currently implemented are:

- `/examples/contentful/slider/:id`
- `/examples/contentful/accordion/:id`
- `/examples/contentful/menu/:id`
- `/examples/contentful/banner/:id`
- `/examples/contentful/contentblock/:id`
- `/examples/contentful/blogpost/:id`
- `/examples/contentful/blog/:id/:page`
- `/examples/contentful/quote/:id`
- `/examples/contentful/video/:id`
- `/examples/contentful/route/:id`
- `/examples/contentful/viewport/:id`
- `/examples/contentful/tabs/:id`
- `/examples/contentful/blog-feed/:id`
- `/examples/contentful/modal/:id`

We try to keep those up-to-date to be able to use the preview API to demo content. This could be very useful and used when creating/updating content to preview it.

`?spaceName=XXX` could be used to load content from different Contentful spaces, means other than default.

**For example:**

When creating/updating content click on the "Info" button on the right sidebar and note the `Content type ID` and `Entry ID`. Then you can use the corresponding route to preview it directly in the community app and get feel of how it looks. Say we want to see the `'Mobile Community - Home'` page and we have `56DJ8zVHSgK6AceCqKqmqY` as viewport id then we can use:

`http://local.topcoder-dev.com:3000/examples/contentful/viewport/56DJ8zVHSgK6AceCqKqmqY`

This copy/paste can be made easier with the Contentful's [content preview](https://www.contentful.com/r/knowledgebase/setup-content-preview/) functionality. Just setup it using the links as described above. Then You will be able to just click the "Open preview" button and see the changes.