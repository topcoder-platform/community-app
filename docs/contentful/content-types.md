### Primary Content Types

- **Viewport** &ndash; A generic container for other objects, that renders its
  children into a column. At the moment, the following content types are supported
  as viewport children: **Accordion**, **Banner**, **ContentBlock**. Moving
  forward, the plan is (i) to support nested viewports; (ii) to add different
  layout options for viewport content. This will allow to flexibily construct
  complex layouts out of viewports, thus treat viewports as the main content
  layout and grouping component.

- **ContentBlock** &ndash; The first content type you should consider for your
  content elements inside a viewport. It allows you to insert into the page
  arbitrary text (supporting Markdown and HTML syntax), as well as misc inline
  UI elements, specific to our website (buttons, internal hyper-references, etc.).
  It also supports the *image + text* type of content, for cases when, rather
  than an inline image, you need some special layout of the image with respect
  to the textual content. We also support different styles for content blocks.

- **Banner** &ndash; This content type provides banners: large background image,
  some textual content, positioned above it, and also some extra background just
  under the text, to improve its readability against the main background image.
  We support a few different banner styles. Moving forward, probably, we will
  merge **Banner** type into **ContentBlock** one at some point, as there is
  no much differences between them in term of data they rely on.

- **Accordion** &ndash; The component for FAQ blocks. Each accordion holds
  a list of **AccordionItem** objects, that provide
  *Brief Question &ndash; Not necessarily brief answer* type of content.

- **Quote** - Component for styled quote blocks. Supports themes and author avatar, name, affiliation.

- **Video** - Component to embed external videos via source url. Supports multiple options like `autoplay` and etc.

- **Route** &ndash; It will allow create new pages from within CMS. For each
  page you will be be able to specify the URL where it should be mounted, the
  title, thumbnail, and other SEO meta-data, along with the viewport that page
  should render for visitors. It will be possible to nest pages, to simplify
  the hanlding of routing.
