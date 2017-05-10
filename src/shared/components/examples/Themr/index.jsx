/**
 * react-css-themr test/demo.
 */

import React from 'react';
import { ThemeProvider } from 'react-css-themr';
import ThemableComponent from './ThemableComponent';
import contextStyle from './contextStyle.scss';
import style from './style.scss';

const contextTheme = {
  ThemableComponent: contextStyle,
};

export default class Themr extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: 'a',
      style: {},
    };
    this.timerId = setTimeout(() => {
      this.setState({
        key: 'b',
        style: {
          ThemableComponent: contextStyle,
        },
      });
    }, 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  render() {
    return (
      <div>
        <h1>react-css-themr test/demo</h1>
        <h3>Default theme</h3>
        <ThemableComponent />
        <h3>Default theme + Parent-provided styling</h3>
        <ThemableComponent
          theme={style}
        />
        <h3>Default theme + Context styling</h3>
        <ThemeProvider theme={contextTheme}>
          <ThemableComponent />
        </ThemeProvider>
        <h3>
          Default theme + Context styling, inject async with 3 sec delay
        </h3>
        <p>
          When you look into the source code, pay attention to the change of
          key property of ThemeProvider!
        </p>
        {/*
          In the current version of react-css-themr ThemeProvider is a class
          component, which does not handle updates of its properties. Thus, if
          we change theme prop in an async way, the theme injected into children
          won't be updated if we don't force ReactJS to destruct and re-create
          corresponding DOM subtree. We achieve this by changing key property!
        */}
        <ThemeProvider key={this.state.key} theme={this.state.style}>
          <ThemableComponent />
        </ThemeProvider>
      </div>
    );
  }
}
