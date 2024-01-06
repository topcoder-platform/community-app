/**
 * SearchCombo component.
 */
import React, { useState } from 'react';
import DropdownSingleSkills from 'components/GUIKit/DropdownSingleSkills';
import PT from 'prop-types';
import './style.scss';

function SearchCombo({
  term,
  placeholder,
  onSearch,
  auth,
}) {
  const [skills, setSkills] = useState(term);

  return (
    <div styleName="container">
      <DropdownSingleSkills
        terms={skills}
        placeholder={placeholder}
        onChange={(newSkill) => {
          setSkills(newSkill);
          onSearch(newSkill);
        }}
        cacheOptions
        auth={auth}
        createText="Search"
      />
    </div>
  );
}

SearchCombo.defaultProps = {
  term: '',
  placeholder: '',
  auth: {},
};

SearchCombo.propTypes = {
  term: PT.string,
  placeholder: PT.string,
  onSearch: PT.func.isRequired,
  auth: PT.object,
};

export default SearchCombo;
