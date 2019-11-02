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
  setQuery,
  label,
}) {
  return (
    <div styleName="ChallengeSearchBar" role="search">
      <label htmlFor="search-challenges">{label}
        <input
          id="search-challenges"
          onChange={event => setQuery(event.target.value)}
          onKeyPress={event => (event.key === 'Enter' ? onSearch(query.trim()) : null)}
          placeholder={placeholder}
          type="text"
          value={query}
        />
        <span
          styleName={`SearchButton ${query ? 'active' : ''}`}
          onClick={() => onSearch(query.trim())}
          onKeyPress={() => onSearch(query.trim())}
          tabIndex="0"
          role="button"
        >
          <ZoomIcon styleName="zoomIcon" />
        </span>
      </label>
    </div>
  );
}

ChallengeSearchBar.defaultProps = {
  placeholder: '',
  label: 'Search: ',
};

ChallengeSearchBar.propTypes = {
  onSearch: PT.func.isRequired,
  label: PT.string,
  placeholder: PT.string,
  query: PT.string.isRequired,
  setQuery: PT.func.isRequired,
};
