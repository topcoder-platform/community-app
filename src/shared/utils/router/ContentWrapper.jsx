/**
 * A helper class for SplitRoute. It just renders the specified content (wrapped
 * into <div> to better match corresponding pre-rendered DOM), and calls reset()
 * method of the parent SplitRoute when unmounted. This allows to reset
 * SplitRoute to the initial state, which is necessary for its proper
 * functioning.
 */

import PT from 'prop-types';
import React from 'react';

export default class ContentWrapper extends React.Component {
  componentWillUnmount() {
    this.props.parent.reset();
  }

  render() {
    return this.props.content;
  }
}

ContentWrapper.propTypes = {
  content: PT.element.isRequired,
  parent: PT.shape({
    reset: PT.func.isRequired,
  }).isRequired,
};
