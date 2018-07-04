/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import { looseEqual } from 'utils/tc';

import BasicInfo from './BasicInfo';
import Language from './Language';
import Education from './Education';
import Work from './Work';
import Organization from './Organization';
import Skill from './Skill';
import Hobby from './Hobby';

import Tracks from './Tracks';
import Skills from './Skills';
import ExternalLinks from './ExternalLinks';

import Styles from './styles.scss';

import ProfileSubtabs from './ProfileSubtabs';
import { PROFILETABS } from 'actions/page/profileSettings';
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      profileState,
      subTab
    } = this.props;
    const { updatingProfile } = profileState;
    
    const selectTab = (tab) => {
      var sTab= 'profile';
      const tab1= sTab+"/"+tab;
      this.props.selectTab(tab1);
      this.props.history.push(`/settings/profile/${tab}`);
    };


    return (
      <div styleName="edit-profile-container" style= {{padding: "0 50px 30px"}}>
        <div className="settings-section">
          <form autoComplete="off" style= {{width: "100%"}}>
            <input autoComplete="false" name="hidden" type="text" className="hidden" />
            <div styleName= "col-lg-3 col-sm-3 col-xs-3 col-md-3" style= {{padding: "0 10px"}}>
              <div>
                <ProfileSubtabs
                  subTab= {subTab}
                  selectTab= {selectTab}
                  />
              </div>
            </div>
            <div styleName= "col-lg-9 col-sm-9 col-xs-9 col-md-9">
              {
                subTab === PROFILETABS.BASICINFO &&
                <BasicInfo
                  {...this.props}
                />
              }
              {
                subTab === PROFILETABS.LANGUAGE &&
                <Language
                {...this.props}
                />
              }
              {
                subTab === PROFILETABS.EDUCATION &&
                <Education
                />
              }
              {
                subTab === PROFILETABS.WORK &&
                <Work
                />
              }
              {
                subTab === PROFILETABS.ORGANIZATION &&
                <Organization
                />
              }
              {
                subTab === PROFILETABS.SKILL &&
                <Skill
                />
              }
              {
                subTab === PROFILETABS.HOBBY &&
                <Hobby
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

Profile.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  profile: PT.shape().isRequired,
  profileState: PT.shape().isRequired,
  updateProfile: PT.func.isRequired,
  updateBasicInfo: PT.func.isRequired,
  subTab: PT.string.isRequired,
  selectTab: PT.func.isRequired,
  selectSubtab: PT.func.isRequired
};

