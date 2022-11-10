/* global document window */

import React from 'react';

import Footer from 'components/TopcoderFooter';
import Header from 'containers/TopcoderHeader';
import TimelineWallContainer from 'containers/timeline-wall';

import './styles.scss';

export default function Router() {
  return (
    <div styleName="container">
      <Header />
      <TimelineWallContainer />
      <Footer />
    </div>
  );
}

Router.propTypes = {
};
