import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';

import greenRedTheme from './green-red-theme.scss';
import yellowPinkTheme from './yellow-pink-theme.scss';
import style from './style.scss';

export default function LoadingIndicators() {
  return (
    <div styleName="style.page">
      <h1>
Loading Indicators
      </h1>
      <p>
        Demo of loading indicators we have in the code base. At the moment we
        have just one type, but you can flexibly tune its size / coloring using
        SCSS:
      </p>
      <div styleName="style.white-bg">
        <LoadingIndicator
          /* NOTE: Theme is used here just to be able to demo all
           * indicators in the same line. For the real use of default
           * LoadingIndicator, it is fine to use just
           * <LoadingIndicator /> */
          theme={{ container: style.indicatorContainer }}
        />
        <LoadingIndicator theme={greenRedTheme} />
        <LoadingIndicator theme={yellowPinkTheme} />
      </div>
      <div styleName="style.black-bg">
        <LoadingIndicator
          theme={{ container: style.indicatorContainer }}
        />
        <LoadingIndicator theme={greenRedTheme} />
        <LoadingIndicator theme={yellowPinkTheme} />
      </div>
      <div styleName="style.striped-bg">
        <LoadingIndicator
          theme={{ container: style.indicatorContainer }}
        />
        <LoadingIndicator theme={greenRedTheme} />
        <LoadingIndicator theme={yellowPinkTheme} />
      </div>
    </div>
  );
}
