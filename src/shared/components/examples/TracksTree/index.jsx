import TracksTree from 'components/Contentful/TracksTree/TracksTree';
import React from 'react';

import ListTree from 'assets/mock-data/tracks-tree-mock-tree-list.json';
import './style.scss';

export default function TracksTreeExample() {
  return (
    <div styleName="container">
      <h1>
      Tracks Tree(accordion) Preview
      </h1>
      <TracksTree
        list={ListTree}
        currentItem={17}
      />
    </div>
  );
}

TracksTreeExample.propTypes = {
};
