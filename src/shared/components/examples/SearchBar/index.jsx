import SearchBar from 'components/Contentful/SearchBar/SearchBar';
import React from 'react';

import './style.scss';
import AutoSuggestList from 'assets/mock-data/search-bar-mock-suggestion-list.json';

export default function SearchBarExample() {
  return (
    <div styleName="container">
      <h1>
      SearchBar Preview
      </h1>
      <SearchBar AutoSuggestList={AutoSuggestList} />
    </div>
  );
}

SearchBarExample.propTypes = {
};
