/**
 * High order component that apply front-side password protection
 * before loading a Contentful Viewport. It uses sessionStorage for working.
 */
import PT from 'prop-types';
import React from 'react';
import Viewport from 'components/Contentful/Viewport';
import TextInput from 'components/GUIKit/TextInput';

import './style.scss';

export default class PasswordScreen extends React.Component {
  state = {};

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onPasswordInput = this.onPasswordInput.bind(this);
  }

  onSubmit() {
    const { password } = this.props;
    this.setState((state) => {
      const { inputVal } = state;
      return {
        authorized: password === inputVal,
        errorMsg: password === inputVal ? '' : 'Password incorrect',
      };
    });
  }

  onPasswordInput(inputVal) {
    const update = {
      inputVal,
    };
    if (!inputVal) update.errorMsg = '';
    this.setState(update);
  }

  render() {
    const {
      authorized, errorMsg, inputVal,
    } = this.state;
    const {
      viewPortId, preview, spaceName, environment, baseUrl, title, btnText, content,
    } = this.props;
    return authorized ? (
      <Viewport
        id={viewPortId}
        preview={preview}
        spaceName={spaceName}
        environment={environment}
        baseUrl={baseUrl}
      />
    ) : (
      <div styleName="wrapper">
        <div styleName="container">
          <h4>{title || 'GET ACCESS WITH PASSWORD'}</h4>
          <p styleName="hint">Please enter the password you were provided</p>
          <TextInput
            placeholder="Password"
            label="Password"
            onChange={val => this.onPasswordInput(val)}
            errorMsg={errorMsg}
            required
            type="password"
            onEnterKey={this.onSubmit}
          />
          <div styleName="cta">
            <button type="button" styleName="submit" onClick={this.onSubmit} disabled={!inputVal}>{btnText}</button>
          </div>
        </div>
        {
          content ? (
            <Viewport
              id={content.sys.id}
              preview={preview}
              spaceName={spaceName}
              environment={environment}
              baseUrl={baseUrl}
            />
          ) : null
        }
      </div>
    );
  }
}

PasswordScreen.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
  baseUrl: '',
  title: 'GET ACCESS WITH PASSWORD',
  btnText: 'SUBMIT',
  content: null,
};

PasswordScreen.propTypes = {
  password: PT.string.isRequired,
  viewPortId: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
  baseUrl: PT.string,
  title: PT.string,
  btnText: PT.string,
  content: PT.shape(),
};
