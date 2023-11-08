/* eslint-disable jsx-a11y/label-has-for */
/**
 * Dropdown terms component.
 */
import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { Async } from 'react-select';
import './style.scss';

import { config } from 'topcoder-react-utils';

function DropdownSkills({
  terms,
  placeholder,
  label,
  required,
  onChange,
  errorMsg,
  addNewOptionPlaceholder,
  cacheOptions,
  loadOptions,
}) {
  const [internalTerms, setInternalTerms] = useState(terms);
  const selectedOption = _.filter(internalTerms, { selected: true }).map(o => ({
    value: o.label,
    label: o.label,
  }));
  const delayedOnChange = useRef(
    _.debounce((q, cb) => cb(q), config.GUIKIT.DEBOUNCE_ON_CHANGE_TIME),
  ).current;
  const containerRef = useRef(null);
  let inputField;
  useEffect(() => {
    const selectInput = containerRef.current.getElementsByClassName('Select-input');
    if (selectInput && selectInput.length) {
      inputField = selectInput[0].getElementsByTagName('input');
      inputField[0].placeholder = selectedOption.length > 0 ? addNewOptionPlaceholder : '';
      inputField[0].style.border = 'none';
      inputField[0].style.boxShadow = 'none';
      selectInput[0].style.borderTop = 'none';
    }
  }, [selectedOption]);
  useEffect(() => {
    setInternalTerms(terms);
  }, [terms]);

  const CustomReactSelectRow = React.forwardRef(({
    className,
    option,
    children,
    onSelect,
  }, ref) => (children ? (
    <a
      ref={ref}
      role="button"
      className={className}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect(option, event);
      }}
      title={option.title}
      tabIndex={-1}
    >
      {children}
    </a>
  ) : null));

  CustomReactSelectRow.defaultProps = {
    children: null,
    className: '',
    onSelect: () => {},
  };

  CustomReactSelectRow.propTypes = {
    children: PT.node,
    className: PT.string,
    onSelect: PT.func,
    option: PT.object.isRequired,
  };

  return (
    <div
      ref={containerRef}
      className="dropdownContainer"
      styleName={`container ${
        selectedOption && !!selectedOption.length ? 'haveValue' : ''
      } ${errorMsg ? 'haveError' : ''} ${_.every(internalTerms, { selected: true }) ? 'isEmptySelectList' : ''}`}
    >
      <div styleName="relative">
        <Async
          autosize={false}
          optionComponent={CustomReactSelectRow}
          value={selectedOption}
          onChange={(value) => {
            const newValues = value.map(o => ({ selected: true, label: o.label }));
            delayedOnChange(
              _.cloneDeep(newValues),
              onChange,
            );
          }}
          placeholder={`${placeholder}${placeholder && required ? ' *' : ''}`}
          clearable={false}
          backspaceRemoves={false}
          multi
          promptTextCreator={() => null}
          cacheOptions={cacheOptions}
          loadOptions={loadOptions}
        />
      </div>
      {label ? (
        <span styleName="label">
          {label}
          {required ? <span>&nbsp;*</span> : null}
        </span>
      ) : null}
      {errorMsg ? <span styleName="errorMessage">{errorMsg}</span> : null}
    </div>
  );
}

DropdownSkills.defaultProps = {
  placeholder: '',
  label: '',
  required: false,
  cacheOptions: false,
  onChange: () => {},
  errorMsg: '',
  addNewOptionPlaceholder: '',
  loadOptions: undefined,
};

DropdownSkills.propTypes = {
  terms: PT.arrayOf(
    PT.shape({
      label: PT.string.isRequired,
      selected: PT.bool.isRequired,
    }),
  ).isRequired,
  placeholder: PT.string,
  label: PT.string,
  required: PT.bool,
  cacheOptions: PT.bool,
  onChange: PT.func,
  errorMsg: PT.string,
  addNewOptionPlaceholder: PT.string,
  loadOptions: PT.func,
};

export default DropdownSkills;
