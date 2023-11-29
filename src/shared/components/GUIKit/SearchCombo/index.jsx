/**
 * SearchCombo component.
 */
import React, { useState, useMemo } from 'react';
import DropdownSingleSkills from 'components/GUIKit/DropdownSingleSkills';
import PT from 'prop-types';
import _ from 'lodash';
import './style.scss';
import { getService } from 'services/skills';

function SearchCombo({
  term,
  placeholder,
  onSearch,
  auth,
}) {
  const [skills, setSkills] = useState(term);

  const fetchSkills = useMemo(() => _.debounce((inputValue, callback) => {
    if (!inputValue) {
      callback(null);
    } else {
      getService(auth.tokenV3).getSkills(inputValue).then(
        (response) => {
          const suggestedOptions = (response || []).map(skillItem => ({
            label: skillItem.name,
            value: skillItem.name,
          }));
          return callback(null, {
            options: suggestedOptions,
          });
        },
      ).catch(() => callback(null));
    }
  }, 150), [auth.tokenV3]);

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
        loadOptions={fetchSkills}
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
