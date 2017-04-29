import _ from 'lodash';
import React, { Component } from 'react';
import PT from 'prop-types';
import Dropdown from 'react-dropdown';
import './SortingSelectBar.scss';

class SortingSelectBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSortingOption: props.value,
      optionsVisible: false,
    };
  }

  onViewOptions() {
    this.setState({ optionsVisible: true });
  }

  onSelectOption(optionName) {
    this.props.onSortingSelect(optionName);
    this.setState({ selectedSortingOption: optionName });
  }

  render() {
    const { filterName, sortingOptions } = this.props;
    const { selectedSortingOption, optionsVisible } = this.state;
    let options;

    if (optionsVisible) {
      options = (
        <div className="view-options">
          {
            sortingOptions.map(optionName => (
              <button
                className="view-option"
                key={`${filterName.replace(/\s+/g, '-').toLowerCase()}-${optionName}-sorting-bar`}
                onClick={() => this.onSelectOption(optionName)}
              >
                {optionName}
              </button>
            ))
          }
        </div>
      );
    }

    return (
      <div styleName="sortingBar">
        <h1 styleName="title">{filterName}</h1>
        <div styleName="view-options-toggle-container">
          <p styleName="view-options-toggle-container-label">
            Sort by:
          </p>
          <Dropdown
            options={sortingOptions}
            onChange={optionName => this.onSelectOption(optionName.value)}
            value={{
              label: selectedSortingOption,
              value: selectedSortingOption,
            }}
            placeholder="Select an option"
          />
        </div>
        {options}
      </div>
    );
  }
}

SortingSelectBar.defaultProps = {
  onSortingSelect: _.noop,
  value: '',
  sortingOptions: [],
  filterName: '',
};

SortingSelectBar.propTypes = {
  filterName: PT.string,
  sortingOptions: PT.arrayOf(PT.string),
  onSortingSelect: PT.func,
  value: PT.string,
};

export default SortingSelectBar;
