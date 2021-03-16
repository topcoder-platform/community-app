/**
 * Renders the passed markdown into native React components.
 * Supports inlining a subset of JSX Components which can be found in
 * utils/markdown.js
 *
 * Support for additional components can be added to the above file.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import md from 'utils/markdown';

class MarkdownRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: null,
    };
  }

  componentWillMount() {
    const { markdown } = this.props;
    this.renderElements(markdown);
  }

  componentWillReceiveProps(nextProps) {
    const { markdown } = this.props;
    if (markdown !== nextProps.markdown) {
      this.renderElements(nextProps.markdown);
    }
  }

  renderElements(markdown) {
    const {
      preview,
      spaceName,
      environment,
      profile,
    } = this.props;
    if (markdown) {
      const compiled = _.template(markdown, { variable: 'profile' });
      const interpolated = compiled(profile);
      this.setState({
        elements: md(interpolated, { preview, spaceName, environment }),
      });
    }
  }

  render() {
    const { elements } = this.state;

    return (
      // Fragment prevents the Component from rendering an unnecessary div.
      // This is important if the component is rendering within a flexbox
      // for example.
      <Fragment>
        {elements}
      </Fragment>
    );
  }
}

MarkdownRenderer.defaultProps = {
  markdown: '',
  preview: false,
  spaceName: null,
  environment: null,
  profile: {},
};

MarkdownRenderer.propTypes = {
  markdown: PT.string,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
  profile: PT.shape(),
};

function mapStateToProps(state) {
  const profile = state.auth && state.auth.profile ? { ...state.auth.profile } : {};
  return { profile };
}

const MarkdownRendererContainer = connect(
  mapStateToProps,
)(MarkdownRenderer);

export default MarkdownRendererContainer;
