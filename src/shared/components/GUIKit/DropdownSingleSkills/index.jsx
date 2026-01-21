/* eslint-disable jsx-a11y/label-has-for */
/**
 * Dropdown terms component.
 */
import React, {
  useRef,
  useEffect,
} from 'react';
import PT from 'prop-types';
import { AsyncCreatable } from 'react-select';
import './style.scss';

function DropdownSingleSkills({
  terms,
  placeholder,
  label,
  required,
  onChange,
  errorMsg,
  cacheOptions,
  loadOptions,
  createText,
}) {
  let normalizedTerms = null;
  if (terms && typeof terms === 'object') {
    normalizedTerms = terms;
  } else if (terms) {
    normalizedTerms = { value: terms, label: terms };
  }
  const containerRef = useRef(null);
  useEffect(() => {
    const selectInput = containerRef.current.getElementsByClassName('Select-input');
    if (selectInput && selectInput.length) {
      const inputField = selectInput[0].getElementsByTagName('input');
      inputField[0].style.border = 'none';
      inputField[0].style.boxShadow = 'none';
      selectInput[0].style.borderTop = 'none';
    }
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
        terms ? 'haveValue' : ''
      } ${errorMsg ? 'haveError' : ''}`}
    >
      <div styleName="relative">
        <AsyncCreatable
          autosize={false}
          optionComponent={CustomReactSelectRow}
          value={normalizedTerms}
          onChange={(value) => {
            onChange(value || null);
          }}
          defaultValue={normalizedTerms}
          promptTextCreator={value => `${createText} "${value}"`}
          placeholder={`${placeholder}${placeholder && required ? ' *' : ''}`}
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

DropdownSingleSkills.defaultProps = {
  terms: '',
  placeholder: '',
  label: '',
  required: false,
  cacheOptions: false,
  onChange: () => {},
  errorMsg: '',
  createText: 'Select',
  loadOptions: undefined,
};

DropdownSingleSkills.propTypes = {
  terms: PT.oneOfType([
    PT.string,
    PT.shape({
      label: PT.string,
      value: PT.string,
    }),
  ]),
  placeholder: PT.string,
  label: PT.string,
  required: PT.bool,
  cacheOptions: PT.bool,
  onChange: PT.func,
  errorMsg: PT.string,
  createText: PT.string,
  loadOptions: PT.func,
};

export default DropdownSingleSkills;
