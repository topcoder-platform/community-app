/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * Search bar for the ChallengeFilters component.
 *
 * This component will trigger the callback provided via the 'onSearch'
 * property, if any, each time the user hits enter inside the input field,
 * or clicks on the search icon. It passes the search string into the first
 * callback argument.
 *
 * You may provide the 'placeholder' string property, to show a placeholder in
 * the input field.
 */

import React from 'react';
import PT from 'prop-types';
import './style.scss';
import ZoomIcon from './ui-zoom.svg';

export default function ChallengeSearchBar({
  onSearch,
  placeholder,
  query,
}) {
  return (
    <div styleName="container">
      <div styleName="ChallengeSearchBar" role="search">
        <div htmlFor="search-challenges" styleName="input-container">
          <input
            id="search-challenges"
            onInput={(e) => {
              const s = e.target.value;
              onSearch(s.trim());
            }}
            placeholder={placeholder}
            type="text"
            value={query}
            onChange={() => {}}
          />
          <span styleName="SearchButton">
            <ZoomIcon styleName="zoomIcon" />
          </span>
        </div>
      </div>
    </div>
  );
}

ChallengeSearchBar.defaultProps = {
  placeholder: '',
};

ChallengeSearchBar.propTypes = {
  onSearch: PT.func.isRequired,
  placeholder: PT.string,
  query: PT.string.isRequired,
};
