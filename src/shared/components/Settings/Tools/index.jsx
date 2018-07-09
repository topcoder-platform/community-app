/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import { looseEqual } from 'utils/tc';

import Devices from './Devices';
import Software from './Software';
import ServiceProviders from './ServiceProviders';
import Subscriptions from './Subscriptions';

import Navbar from './Navbar';
import Styles from './styles.scss';

import { TOOLSTABS } from 'actions/page/toolsSettings';
export default class Tools extends React.Component {
  constructor(props) {
    super(props);
    console.log("Tools props", props);
    this.state = {
    };
  }

  
  render() {
    const {
      subTab
    } = this.props;
    return (
      <div styleName="edit-profile-container" style= {{padding: "60px 50px 55px"}}>
        <div className="settings-section" style= {{margin: "0"}}>
          <form autoComplete="off" style= {{width: "100%"}}>
            <input autoComplete="false" name="hidden" type="text" className="hidden" />
            <div style= {{width: "23.49%", marginRight: "6.6%", float: "left"}}>
              <div>
              <Navbar
                  subTab= {subTab}
                  {...this.props}
                  />
              </div>
            </div>
            <div style= {{width: "69.9%", float: "left"}}>
              {
                subTab === TOOLSTABS.DEVICES &&
                <Devices
                {...this.props}
                />
              }
              {
                subTab === TOOLSTABS.SOFTWARE &&
                <Software
                {...this.props}
                />
              }
              {
                subTab === TOOLSTABS.SERVICEPROVIDERS &&
                <ServiceProviders
                {...this.props}
                />
              }
              {
                subTab === TOOLSTABS.SUBSCRIPTIONS &&
                <Subscriptions
                {...this.props}
                />
              }
              {/* <Tracks
                tracks={this.state.tracks}
                onUpdateTracks={this.onUpdateTracks}
                {...this.props}
              />
              <div className="save-section">
                <PrimaryButton
                  disabled={!needSave || updatingProfile}
                  onClick={this.onSaveProfile}
                  theme={{ button: Styles['save-button'] }}
                >
                  {
                    !updatingProfile && 'Save'
                  }
                  {
                    updatingProfile && <i className="fa fa-spinner fa-spin" />
                  }
                </PrimaryButton>
              </div>
              <Skills
                {...this.props}
              />
              <ExternalLinks
                {...this.props}
              /> */}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Tools.propTypes = {
  subTab: PT.string.isRequired,
  selectSubtab: PT.func.isRequired,
  selectTab: PT.func.isRequired
};

