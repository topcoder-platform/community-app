import React from 'react';

import './styles.scss';

import Challenges from 'components/Dashboard/Challenges';
import Switch from 'components/Switch';

class ChallengesFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: false,
    };
  }

  render() {
    const { isDarkMode } = this.state;
    return (
      <div styleName={`container ${isDarkMode ? 'dark' : ''}`}>
        <div styleName="header">
          <h1>Challenges Feed Preview</h1>
          <div>
            <span>Dark Mode</span>
            <Switch
              enabled={isDarkMode}
              onSwitch={() => this.setState(state => ({
                isDarkMode: !state.isDarkMode,
              }))}
            />
          </div>
        </div>
        <Challenges theme={isDarkMode ? 'dark' : 'light'} />
      </div>
    );
  }
}

export default ChallengesFeed;
