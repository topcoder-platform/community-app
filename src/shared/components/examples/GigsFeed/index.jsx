import GigsFeed from 'containers/Dashboard/GigsFeed';
import React from 'react';

import './style.scss';
import { PrimaryButton } from 'topcoder-react-ui-kit/src/shared/components/buttons';

export default class GigsFeedExample extends React.Component {
  constructor() {
    super();
    this.state = { theme: 'light' };
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  toggleTheme() {
    const { theme } = this.state;
    this.setState({ theme: theme === 'light' ? 'dark' : 'light' });
  }

  render() {
    const { theme } = this.state;

    return (
      <div styleName={`page ${theme}`}>
        <div styleName="container">
          <h1>
            Gigs Feed Preview
          </h1>
          <div>Theme: {theme}</div>
          <PrimaryButton onClick={this.toggleTheme}>Toggle Theme</PrimaryButton>
          <GigsFeed itemCount={10} theme={theme} />
        </div>
      </div>
    );
  }
}
