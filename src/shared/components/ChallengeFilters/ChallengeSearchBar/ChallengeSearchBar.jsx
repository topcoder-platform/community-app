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
import './ChallengeSearchBar.scss';
import ZoomIcon from './ui-zoom.svg';

class ChallengeSearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    if (this.props.query) {
      this.state.value = this.props.query;
      this.onSearch();
    }
  }

  onKeyPress(event) {
    switch (event.key) {
      case 'Enter':
        return this.onSearch();
      default:
        return null;
    }
  }

  onSearch() {
    if (this.props.onSearch) this.props.onSearch(this.state.value);
  }

  render() {
    return (
      <div styleName="ChallengeSearchBar">
        <input
          onChange={event => this.setState({ value: event.target.value })}
          onKeyPress={event => this.onKeyPress(event)}
          placeholder={this.props.placeholder}
          type="text"
          value={this.state.value}
        />
        <span
          styleName={`SearchButton ${this.state.value ? 'active' : ''}`}
          onClick={() => this.onSearch()}
        >
          <ZoomIcon styleName="zoomIcon" />
        </span>
      </div>
    );
  }
}

ChallengeSearchBar.defaultProps = {
  onSearch: () => true,
  placeholder: '',
  query: '',
};

ChallengeSearchBar.propTypes = {
  onSearch: PT.func,
  placeholder: PT.string,
  query: PT.string,
};

export default ChallengeSearchBar;
