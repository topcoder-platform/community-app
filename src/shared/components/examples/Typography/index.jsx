import React from 'react';

import './style.scss';

export default function Typography() {
  return (
    <div styleName="container">
      <h1 styleName="title">Standard Topcoder Typography</h1>
      <p styleName="text">
        Most of Topcoder websites use the same styleguide for the design.
        In particular, all typography is supposed to use the following set of
        styles. For all these styles we have global mixins, which should be used
        whenever possible (but never modified without explicit approval).
      </p>
      <div styleName="panels">
        <div styleName="panel">
          <h3 styleName="panel-title">Labels</h3>
          <p styleName="label-lg">
            Large Label &mdash; <code>@mixin tc-label-lg;</code>
          </p>
          <p styleName="label-md">
            Medium Label &mdash; <code>@mixin tc-label-md;</code>
          </p>
          <p styleName="label-sm">
            Small Label &mdash; <code>@mixin tc-label-sm;</code>
          </p>
          <p styleName="label-xs">
            Extra Small Label &mdash; <code>@mixin tc-label-xs;</code>
          </p>
        </div>
        <div styleName="panel">
          <h3 styleName="panel-title">Regular Text (Body)</h3>
          <p styleName="body-lg">
            Large body text &mdash; <code>@mixin tc-body-lg;</code><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id
            nunc nec risus ullamcorper tristique sed vel dolor. Vestibulum
            justo ligula, finibus eget felis ut, tempor viverra risus. Fusce
            elementum turpis in ex dictum, et rhoncus metus dapibus. Nullam
            libero magna, tincidunt non porttitor in, condimentum eget massa.
            Nullam ut tincidunt urna, et commodo massa. Etiam dignissim nunc
            eget pharetra molestie. Orci varius natoque penatibus et magnis dis
            parturient montes, nascetur ridiculus mus. Morbi molestie, neque
            pretium sagittis lobortis, orci felis eleifend purus, ac accumsan
            augue nulla laoreet erat. Sed accumsan turpis consectetur tortor
            suscipit, sit amet bibendum dolor consequat. Quisque vel sodales
            massa. Donec luctus augue ut facilisis sagittis.
          </p>
          <p styleName="body-md">
            Main body text &mdash; <code>@mixin tc-body-md;</code><br />
            Quisque sodales ipsum ut mauris auctor, in placerat purus
            pellentesque. Etiam ultrices lacus luctus imperdiet luctus. Mauris
            ante dui, hendrerit at erat id, posuere dapibus lorem. Aenean
            rhoncus urna orci, porttitor consequat lectus iaculis id.
            Suspendisse vestibulum dictum risus, non cursus metus maximus ut.
            Integer convallis eros eget ultricies posuere. Duis lorem augue,
            fermentum a quam in, venenatis pulvinar felis. Proin at tristique
            lacus. Quisque tempor gravida turpis.
          </p>
          <p styleName="body-sm">
            Small body text &mdash; <code>@mixin tc-body-sm;</code><br />
            In quis vestibulum ipsum, in ultrices velit. Integer suscipit mi
            non est rutrum pharetra ut quis tellus. Morbi imperdiet rutrum eros
            a varius. Donec placerat nibh ut justo interdum rutrum. Nam luctus
            fermentum elit, quis viverra urna vulputate nec. Pellentesque
            finibus, nisl eget consequat pretium, massa urna ullamcorper arcu,
            ut tincidunt neque est vitae metus. Morbi pretium tincidunt diam,
            at fringilla leo elementum at. Suspendisse suscipit malesuada urna
            et viverra. Nullam quis accumsan urna, eu viverra augue. Nulla
            facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et
            ultrices posuere cubilia Curae; Vestibulum ante ipsum primis in
            faucibus orci luctus et ultrices posuere cubilia Curae;
          </p>
          <p styleName="body-xs">
            Extra small body text &mdash; <code>@mixin tc-body-xs;</code><br />
            In tempor vitae risus nec sodales. Sed tempus diam mi, quis
            fermentum enim fringilla ut. Sed vitae neque accumsan, fermentum
            justo non, pellentesque eros. Pellentesque euismod velit erat, sit
            amet posuere ante eleifend varius. Vestibulum iaculis scelerisque
            ex, sed laoreet dui semper at. Cras id enim leo. In sagittis magna
            id justo egestas, a cursus tortor semper. Maecenas tincidunt orci
            at velit bibendum suscipit. Etiam in pharetra lacus. Aenean tortor
            enim, gravida accumsan metus in, cursus fringilla sapien. Quisque
            suscipit ante vel sollicitudin condimentum. Nulla enim nunc, dictum
            mollis pulvinar non, consequat id ipsum. Nam sodales elit eget mi
            malesuada, sit amet molestie tortor finibus.
          </p>
        </div>
        <div styleName="panel">
          <h3 styleName="panel-title">Headings</h3>
          <h1 styleName="h-xl">
            XL - Heading &mdash; <code>@mixin tc-heading-xl;</code>
          </h1>
          <h2 styleName="h-lg">
            LG - Heading &mdash; <code>@mixin tc-heading-lg;</code>
          </h2>
          <h3 styleName="h-md">
            MD - Heading (level 3) &mdash; <code>@mixin tc-heading-md;</code>
          </h3>
          <h4 styleName="h-sm">
            SM - Heading (level 4) &mdash; <code>@mixin tc-heading-sm;</code>
          </h4>
          <h5 styleName="h-xs">
            XS - Heading (level 5) &mdash; <code>@mixin tc-heading-xs;</code>
          </h5>
        </div>
        <div styleName="panel">
          <h3 styleName="panel-title">Titles</h3>
          <h1 styleName="title">
            XXL - Heading (level 1) &mdash; <code>@mixin tc-title;</code>
          </h1>
        </div>
      </div>
    </div>
  );
}

