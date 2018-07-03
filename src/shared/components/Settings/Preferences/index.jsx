/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import { looseEqual } from 'utils/tc';

import Email from './Email';
import Personalization from './Personalization';
import PreferencesSubtabs from './PreferencesSubtabs';
import Styles from './styles.scss';

import { PREFERENCESTABS } from 'actions/page/preferencesSettings';
export default function Preferences(props) {

    const {
      subTab
    } = props;
    const selectTab = (tab) => {
      var sTab= 'preferences';
      const tab1= sTab+"/"+tab;
      props.selectTab(tab1);

      props.history.push(`/settings/preferences/${tab}`);
    };
    return (
      <div styleName="edit-profile-container" style= {{padding: "0 50px 30px"}}>
        <div className="settings-section">
          <form autoComplete="off" style= {{width: "100%"}}>
            <input autoComplete="false" name="hidden" type="text" className="hidden" />
            <div styleName= "col-lg-3 col-sm-3 col-xs-3 col-md-3" style= {{padding: "0 10px"}}>
              <div>
                <PreferencesSubtabs
                  subTab= {subTab}
                  selectTab= {selectTab}
                  />
              </div>
            </div>
            <div styleName= "col-lg-9 col-sm-9 col-xs-9 col-md-9">
              {
                subTab === PREFERENCESTABS.EMAIL &&
                <Email
                {...props}
                />
              }
              
              {
                subTab === PREFERENCESTABS.PERSONALIZATION &&
                <Personalization
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

Preferences.propTypes = {
  subTab: PT.string.isRequired,
  selectSubtab: PT.func.isRequired,
  selectTab: PT.func.isRequired,
};

