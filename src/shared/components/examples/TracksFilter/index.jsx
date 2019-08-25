import moment from 'moment';
import TracksFilter from 'components/Contentful/TracksFilter/TracksFilter';
import React, { Component } from 'react';

import './style.scss';


export default class TracksFilterExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFilter: true,
    };
  }

  render() {
    const { isShowFilter } = this.state;
    return (
      <div styleName="container">
        <div styleName="header">
          <h1>
          TracksFilter Preview
          </h1>
          <button
            styleName="show-hide-filter"
            type="button"
            onClick={() => { this.setState({ isShowFilter: !isShowFilter }); }}
          >
            {isShowFilter ? 'Hide filter' : 'Show filter'}
          </button>
        </div>
        {isShowFilter && (
          <TracksFilter
            onClose={() => { this.setState({ isShowFilter: false }); }}
            selectedAuthor="All authors"
            authorList={[
              'All authors',
              'Author 1',
              'Author 2',
              'Author 3',
              'Author 4',
              'Author 5',
              'Author 6',
            ]}
            tags={[
              'tag 1',
              'tag 2',
              'tag 3',
            ]}
            startDate={moment()}
            endDate={moment()}
          />
        )}
      </div>
    );
  }
}

TracksFilterExample.propTypes = {
};
