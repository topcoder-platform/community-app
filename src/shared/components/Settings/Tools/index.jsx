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

import ToolsSubtabs from './ToolsSubtabs';
import Styles from './styles.scss';

import { TOOLSTABS } from 'actions/page/toolsSettings';
export default class Tools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  
  render() {
    const {
      subTab
    } = this.props;
    console.log("Tools props", this.props);
    const selectTab = (tab) => {
      console.log("Tools tab", tab);
      var sTab= 'tools';
      const tab1= sTab+"/"+tab;
      this.props.selectTab(tab1);
      this.props.history.push(`/settings/tools/${tab}`);
    };
    return (
      <div styleName="edit-profile-container" style= {{padding: "0 50px 30px"}}>
        <div className="settings-section">
          <form autoComplete="off" style= {{width: "100%"}}>
            <input autoComplete="false" name="hidden" type="text" className="hidden" />
            <div styleName= "col-lg-3 col-sm-3 col-xs-3 col-md-3" style= {{padding: "0 10px"}}>
              <div>
                <ToolsSubtabs
                  subTab= {subTab}
                  selectTab= {selectTab}
                  />
              </div>
            </div>
            <div styleName= "col-lg-9 col-sm-9 col-xs-9 col-md-9">
              {
                subTab === TOOLSTABS.DEVICES &&
                <Devices
                />
              }
              {
                subTab === TOOLSTABS.SOFTWARE &&
                <Software
                />
              }
              {
                subTab === TOOLSTABS.SERVICEPROVIDERS &&
                <ServiceProviders
                />
              }
              {
                subTab === TOOLSTABS.SUBSCRIPTIONS &&
                <Subscriptions
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

