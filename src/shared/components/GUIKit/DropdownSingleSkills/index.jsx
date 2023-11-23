/* eslint-disable jsx-a11y/label-has-for */
/**
 * Dropdown terms component.
 */
import React, {
  useRef,
  useEffect,
  useMemo,
} from 'react';
import _ from 'lodash';
import { getService } from 'services/skills';
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
  createText,
  auth,
}) {
  const fetchSkills = useMemo(() => _.debounce((inputValue, callback) => {
    if (!inputValue) {
      callback(null);
    } else {
      getService(auth.tokenV3).getSkills(inputValue).then(
        (response) => {
          const skills = response || [];
          const suggestedOptions = skills.map(skillItem => ({
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
          value={terms ? {
            value: terms,
            label: terms,
          } : null}
          onChange={(value) => {
            onChange(value ? (value.value || '') : '');
          }}
          defaultValue={terms ? {
            value: terms,
            label: terms,
          } : null}
          promptTextCreator={value => `${createText} "${value}"`}
          placeholder={`${placeholder}${placeholder && required ? ' *' : ''}`}
          cacheOptions={cacheOptions}
          loadOptions={fetchSkills}
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
  auth: {},
};

DropdownSingleSkills.propTypes = {
  terms: PT.string,
  placeholder: PT.string,
  label: PT.string,
  required: PT.bool,
  cacheOptions: PT.bool,
  onChange: PT.func,
  errorMsg: PT.string,
  createText: PT.string,
  auth: PT.object,
};

export default DropdownSingleSkills;
