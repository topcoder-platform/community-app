# Design of a Good Contentful Component

At the moment, [Contentful Banner](https://github.com/topcoder-platform/community-app/tree/new-develop/src/shared/components/Contentful/Banner)
component should be taken as an example of a good Contentful Component. Please,
design and implement other contentful components in a similar way.

The Banner implements a content block with background image, and a smaller
content area, which is intended to contain some textual content. The actual
design can be very different, compare header banners at the following pages:
- [Blockchain Community](https://community-app.topcoder-dev.com/community/blockchain)
- [TopGear Community](https://community-app.topcoder-dev.com/community/wipro)
- [Veterans Community](https://community-app.topcoder-dev.com/community/veterans)

### Architecture of The Banner
- [`Banner.jsx`](https://github.com/topcoder-platform/community-app/tree/new-develop/src/shared/components/Contentful/Banner)
  is a simple functional component that, given all banner data as props, renders
  corresponding JSX markup.

  Note that:
  - It uses [react-css-super-themr](https://www.npmjs.com/package/react-css-super-themr)
    for the base theme management. In addition, it also takes additional styles
    from `banner` prop and injects them as inline styles. The reasoning behind
    it is: (1) themr themes are responsible for the base theme of a banner,
    which can be selected by a single switch in CMS; (2) additional inline
    styles allow to further customise any style details from CMS, if necessary.
    It might be necessary for banners; for example, position and size of the
    banner content is different at each page of TopGear community.

    Banner themes are located [here](https://github.com/topcoder-platform/community-app/tree/new-develop/src/shared/components/Contentful/Banner/themes).

  - It tries to be as generic as possible. It does not ask for banner title,
    and text as separate props; it just assumes that all content will be
    provided as Markdown code, thus any textual content can be rendered into it.

- [`index.js`](https://github.com/topcoder-platform/community-app/blob/new-develop/src/shared/components/Contentful/Banner/index.jsx)
  takes care about the loading of banner data from Contentful, selection of the
  theme specified in CMS, and then it uses `Banner.jsx` for the actual rendering.

  For data loading you should use [`ContentfulLoader`](ContentfulLoader)
  container. You see that in case of the banner, two nested `ContenfulLoader`
  containers are used: the first one to get most of the banner data, and the
  second one to get data of the background image.

### Design of The Underlying Data Model

There are a few things to pay attention for:

- Banner has a `name` field, which is not used for rendering! It is there to
  help distinguish different content objects within CMS. In some cases, it makes
  sense to use the same field to name a data object, and also to render it as
  a title of the component, but even then it will be convenient to have an
  additional optional field that allows to specify a title different from
  the object name in CMS;

- `text` and `backgroundImage` fields are self-explanatory: they just allow to
  provided textual content of the banner, and the background image;

- `baseTheme` (**Banner Style**) field allows to select the base banner theme.
  This acts as selector of one of valid themr themes for the component. In most
  cases, selecting the theme should be the only style-related setting user need
  to do. If there are some other appearance-related settings that will be set
  for each instance of object, they can be exposed as dedicated fields in CMS.

- `containerStyles`, `contentWrapperStyles`, `contentStyles`: in case of the
  banners, for TopGear community appearance of the banner on different pages
  demands customization (position of content, size and color of its background
  are different on each page). It makes no sence to expose related style settings
  as seprate fields in CMS, as there will be many of them, it will just pollute
  the data model; thus these fields accept JSON objects that allow to apply any
  extra custom styling to each HTML element of the banner, if necessary.

  Once again, it is our last resort, you won't need this for most of the components
  you create.
