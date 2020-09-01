/**
 * SearchCombo component.
 */
import React, { useState } from 'react';
import PT from 'prop-types';
import './style.scss';
import IconClearSearch from 'assets/images/icon-clear-search.svg';

function SearchCombo({
  term,
  placeholder,
  btnText,
  onSearch,
}) {
  const [inputVal, setVal] = useState(term);
  const clearSearch = () => {
    setVal('');
    onSearch('');
  };
  const onKeyDown = (e) => {
    if (e.which === 13) {
      onSearch(inputVal);
    }
  };

  return (
    <div styleName="container">
      <div styleName="input-wrap">
        {
          !inputVal ? <span styleName="search-placeholder">{placeholder}</span> : null
        }
        <input type="text" styleName="input" value={inputVal} onChange={event => setVal(event.target.value)} onKeyDown={onKeyDown} />
        {
          inputVal ? <IconClearSearch onClick={clearSearch} styleName="clear-search" /> : null
        }
      </div>
      <button type="button" styleName="primary-green-md" onClick={() => onSearch(inputVal)} disabled={!inputVal}>
        {btnText}
      </button>
    </div>
  );
}

SearchCombo.defaultProps = {
  term: '',
  placeholder: '',
  btnText: 'SEARCH',
};

SearchCombo.propTypes = {
  term: PT.string,
  placeholder: PT.string,
  btnText: PT.string,
  onSearch: PT.func.isRequired,
};

export default SearchCombo;
