import React from 'react';
import './styles.scss';

export default function DataFetch() {
  return (
    <div styleName="DataFetch">
      <h1>Data Fetch</h1>
      <p>
        This is a simple example of how to fetch data from a remote API into
        the Redux store, using actions and reducers. Two pages available via
        the links below are implemented with the same code / components, the
        only difference is that on one route the data are fetched at server
        side and injected into the page during server-side rendering, thus
        enhancing page loading time and hence the user experience. At the
        other route the data are not fetched at the server, thus the code
        falls back to fetching them at the client-side. Which works fine,
        but slower.
      </p>
      <p>
        {/* NOTE: In the real life you are not supposed to use <a> tag for
          * navigation within the App, use the <Link> component provided by
          * react-router instead. We use <a> here because for demo purposes
          * we want to restart the App at the target URL. */}
        <a href="./data-fetch/server">
          Server-side data fetch.
        </a>
      </p>
      <p>
        <a href="./data-fetch/client">
          Client-side data fetch.
        </a>
      </p>
    </div>
  );
}
