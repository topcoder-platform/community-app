/**
 * Connects the Redux store to the Settings components.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import { isTokenExpired } from 'tc-accounts';
import { goToLogin } from 'utils/tc';

import { actions } from 'topcoder-react-lib';
import dashActions from 'actions/page/dashboard';
import settingsActions, { TABS } from 'actions/page/settings';
import { PROFILETABS } from 'actions/page/profileSettings';
import { TOOLSTABS } from 'actions/page/toolsSettings';
import { ACCOUNTTABS } from 'actions/page/accountSettings';
import { PREFERENCESTABS } from 'actions/page/preferencesSettings';
import Error404 from 'components/Error404';
import LoadingIndicator from 'components/LoadingIndicator';
import Settings from 'components/Settings';

class SettingsContainer extends React.Component {
  componentDidMount() {
    console.log("SettingContainer Props: ", this.props);
    this.loadPageData(this.props);
    
  }

  componentWillReceiveProps(nextProps) {
    // console.log("Component will receive props", this.props)
    this.loadPageData(nextProps);
  }

  loadPageData(props) {
    const {
      handle,
      profileState,
      settingsTab,
      subTab,
      tokenV3,
      authenticating,
      loadHeaderData,
      loadTabData,
    } = props;
    // console.log("Load Page Data props", props)
    if (authenticating) return;
     // Check auth token, go to login page if invalid
    if (!tokenV3 || isTokenExpired(tokenV3)) {
      goToLogin('community-app-main');
      return;
    }

    const handleChanged = handle !== profileState.profileForHandle;

    // Load header data
    if (handleChanged) {
      loadHeaderData(props);
    }

    // Load tab data
    if (handleChanged || settingsTab !== this.props.settingsTab || subTab!==this.props.subTab) {
      loadTabData(props);
    }
  }

  render() {
    const {
      authenticating,
      loadingError,
      profile,
      subTab,
      settingsTab
    } = this.props;
    function loadingSubTab(subTab, props){
      switch(subTab){
        case 'basicinfo': {
          return props.basicInfo
        }
        case 'language': {
          return props.language
        }
        case 'education': {
          return props.education
        }
        case 'devices': {
          return props.devices
        }
        case 'software': {
          return props.software
        }
        case 'myaccount': {
          return props.myaccount
        }
      }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
    }
    console.log("Sending props", this.props);
    if (loadingError) {
      return <Error404 />;
    }
var loaded= null;
    // Only load the page when authenticated and profile is loaded

    var loaded = !authenticating && profile && ((loadingSubTab(subTab, this.props))||(settingsTab==='account'));

    return loaded ?
      <Settings
        {...this.props}
      />
      : <LoadingIndicator />;
  }
}
function defaultSubtab(mainTab){
  switch (mainTab){
    case 'profile':{
      return PROFILETABS.BASICINFO;
    }
    case 'tools':{
      return TOOLSTABS.DEVICES;
    }
    case 'account': {
      return ACCOUNTTABS.MYACCOUNT;
    }
    case 'preferences':{
      return PREFERENCESTABS.EMAIL;
    }
  }
}
SettingsContainer.defaultProps = {
  settingsTab: TABS.PROFILE,
  subTab: defaultSubtab(TABS.PROFILE),
  handle: '',
  tokenV3: '',
  profile: null,
  basicInfo: null,
  language: null,
  education: null,
  devices: null,
  software: null,
  myaccount: null
};

SettingsContainer.propTypes = {
  xlBadge: PT.string.isRequired,
  loadHeaderData: PT.func.isRequired,
  loadTabData: PT.func.isRequired,
  selectTab: PT.func.isRequired,
  selectSubtab: PT.func.isRequired,
  showXlBadge: PT.func.isRequired,
  uploadPhoto: PT.func.isRequired,
  deletePhoto: PT.func.isRequired,
  updateProfile: PT.func.isRequired,
  updateBasicInfo: PT.func.isRequired,
  updateLanguage: PT.func.isRequired,
  updateEducation: PT.func.isRequired,
  updateDevices: PT.func.isRequired,
  updateSoftware: PT.func.isRequired,
  addSkill: PT.func.isRequired,
  hideSkill: PT.func.isRequired,
  addWebLink: PT.func.isRequired,
  deleteWebLink: PT.func.isRequired,
  linkExternalAccount: PT.func.isRequired,
  unlinkExternalAccount: PT.func.isRequired,
  saveEmailPreferences: PT.func.isRequired,
  updatePassword: PT.func.isRequired,
  settingsTab: PT.string,
  subTab: PT.string,
  authenticating: PT.bool.isRequired,
  handle: PT.string,
  tokenV3: PT.string,
  profile: PT.shape(),
  basicInfo: PT.shape(),
  profileState: PT.shape().isRequired,
  settingsPageState: PT.shape().isRequired,
  lookupData: PT.shape().isRequired,
  loadingError: PT.bool.isRequired,
};

function mapStateToProps(state) {
  console.log("State",state);
  return {
    settingsTab: state.page.settings.settingsTab,
    subTab: state.page.settings.subTab,
    xlBadge: state.page.dashboard.xlBadge,
    settingsPageState: state.page.settings,
    authenticating: state.auth.authenticating,
    handle: _.get(state.auth, 'user.handle'),
    tokenV3: state.auth.tokenV3,
    profile: state.auth.profile,
    basicInfo: state.basicInfo.basicInfo,
    language: state.language.language,
    devices: state.devices.devices,
    software: state.software.software,
    education: state.education.education,
    lookupData: state.lookup,
    profileState: state.profile,
    activeChallengesCount: _.get(state.challenge, 'activeChallengesCount'),
    loadingError: state.profile.loadingError,
  };
}

function mapDispatchToProps(dispatch) {
  const profileActions = actions.profile;
  const basicInfoActions= actions.basicInfo;
  const languageActions= actions.language;
  const educationActions= actions.education;
  const devicesActions= actions.devices;
  const softwareActions= actions.software;
  
  const loadHeaderData = ({ handle, tokenV3 }) => {
    console.log("Entered load header data");
    dispatch(profileActions.loadProfile(handle));
    dispatch(profileActions.getAchievementsInit());
    dispatch(actions.challenge.getActiveChallengesCountInit());
    dispatch(profileActions.getAchievementsDone(handle));
    dispatch(actions.challenge.getActiveChallengesCountDone(handle, tokenV3));
  };

  const loadTabData = ({
    handle,
    profile,
    tokenV3,
    subTab,
    settingsTab
  }) => {
    console.log("Subtab", subTab);
    dispatch(profileActions.loadProfile(handle));
    if (settingsTab === TABS.PROFILE) {
      console.log("Entering profile settings tab");
      // dispatch(settingsActions.page.settings.selectTab('profile/basicinfo'));
      dispatch(profileActions.getSkillsInit());
      dispatch(profileActions.getLinkedAccountsInit());
      dispatch(profileActions.getExternalAccountsInit());
      dispatch(profileActions.getExternalLinksInit());
      dispatch(actions.lookup.getSkillTagsInit());
      dispatch(actions.lookup.getSkillTagsDone());
      dispatch(profileActions.getLinkedAccountsDone(profile, tokenV3));
      dispatch(profileActions.getExternalAccountsDone(handle));
      dispatch(profileActions.getExternalLinksDone(handle));
      dispatch(profileActions.getSkillsDone(handle));
    } else if (settingsTab === TABS.TOOLS) {
      console.log("Entering tools settings tab");
      // dispatch(settingsActions.page.settings.selectTab('tools/devices'));
      dispatch(profileActions.getEmailPreferencesInit());
      dispatch(profileActions.getEmailPreferencesDone(profile, tokenV3));
    } else if (settingsTab === TABS.ACCOUNT) {
      console.log("Entering account settings tab");
      // dispatch(settingsActions.page.settings.selectTab('account'));
      dispatch(profileActions.getCredentialInit());
      dispatch(profileActions.getCredentialDone(profile, tokenV3));
    }
    else if (settingsTab === TABS.PREFERENCES) {
      console.log("Entering preferences settings tab");
      // dispatch(settingsActions.page.settings.selectTab('preferences/email'));
      }
    if(subTab===PROFILETABS.BASICINFO){
      console.log("Entering basic info subtab");
      dispatch(basicInfoActions.getBasicInfoInit());
      dispatch(basicInfoActions.getBasicInfoDone(handle, tokenV3));
    }
    else if(subTab===PROFILETABS.LANGUAGE){
      console.log("Entered language subtab");
      dispatch(languageActions.getLanguageInit());
      dispatch(languageActions.getLanguageDone(handle, tokenV3));
    }
    else if(subTab===PROFILETABS.EDUCATION){
      console.log("Entered education subtab");
      dispatch(educationActions.getEducationInit());
      dispatch(educationActions.getEducationDone(handle, tokenV3));
    }
    else if(subTab===TOOLSTABS.DEVICES){
      console.log("Entered devices subtab");
      dispatch(devicesActions.getDevicesInit());
      dispatch(devicesActions.getDevicesDone(handle, tokenV3));
    }
    else if(subTab===TOOLSTABS.SOFTWARE){
      console.log("Entered software subtab");
      dispatch(softwareActions.getSoftwareInit());
      dispatch(softwareActions.getSoftwareDone(handle, tokenV3));
    }
    else if(subTab===ACCOUNTTABS.MYACCOUNT){
      console.log("Entered software subtab");
      dispatch(softwareActions.getSoftwareInit());
      dispatch(softwareActions.getSoftwareDone(handle, tokenV3));
    }
    console.log("Exiting the loadTabData");
  };

  return {
    loadHeaderData,
    loadTabData,
    showXlBadge: name => dispatch(dashActions.page.dashboard.showXlBadge(name)),
    selectTab: tab => dispatch(settingsActions.page.settings.selectTab(tab)),
    selectSubtab: tab => dispatch(settingsActions.page.settings.selectSubtab(tab)),
    clearIncorrectPassword: () => dispatch(settingsActions.page.settings.clearIncorrectPassword()),
    addWebLink: (handle, tokenV3, webLink) => {
      dispatch(profileActions.addWebLinkInit(x));
      dispatch(profileActions.addWebLinkDone(handle, tokenV3, webLink));
    },
    deleteWebLink: (handle, tokenV3, webLink) => {
      dispatch(profileActions.deleteWebLinkInit(webLink));
      dispatch(profileActions.deleteWebLinkDone(handle, tokenV3, webLink));
    },
    uploadPhoto: (handle, tokenV3, file) => {
      dispatch(profileActions.uploadPhotoInit());
      dispatch(profileActions.uploadPhotoDone(handle, tokenV3, file));
    },
    deletePhoto: (profile, tokenV3) => {
      dispatch(profileActions.deletePhotoInit());
      dispatch(profileActions.deletePhotoDone(profile, tokenV3));
    },
    updateProfile: (profile, tokenV3) => {
      dispatch(profileActions.updateProfileInit());
      dispatch(profileActions.updateProfileDone(profile, tokenV3));
    },
    updateBasicInfo: (basicInfo) => {
      dispatch(basicInfoActions.updateBasicInfoInit());
      console.log("Updated basic info/ settings container: ", basicInfo);
      dispatch(basicInfoActions.updateBasicInfoDone(basicInfo));
    },
    updateLanguage: (language, handle) => {
      dispatch(languageActions.updateLanguageInit());
      // console.log("Updated basic info/ settings container: ", basicInfo);
      dispatch(languageActions.updateLanguageDone(language, handle));
    },
    updateDevices: (device, handle) => {
      dispatch(devicesActions.updateDevicesInit());
      // console.log("Updated basic info/ settings container: ", basicInfo);
      dispatch(devicesActions.updateDevicesDone(device, handle));
    },
    updateSoftware: (software, handle) => {
      dispatch(softwareActions.updateSoftwareInit());
      // console.log("Updated basic info/ settings container: ", basicInfo);
      dispatch(softwareActions.updateSoftwareDone(software, handle));
    },
    updateEducation: (education, handle) => {
      dispatch(educationActions.updateEducationInit());
      // console.log("Updated basic info/ settings container: ", basicInfo);
      dispatch(educationActions.updateEducationDone(education, handle));
    },
    addSkill: (handle, tokenV3, skill) => {
      dispatch(profileActions.addSkillInit());
      dispatch(profileActions.addSkillDone(handle, tokenV3, skill));
    },
    hideSkill: (handle, tokenV3, skill) => {
      dispatch(profileActions.hideSkillInit());
      dispatch(profileActions.hideSkillDone(handle, tokenV3, skill));
    },
    linkExternalAccount: (profile, tokenV3, providerType, callbackUrl) => {
      dispatch(profileActions.linkExternalAccountInit());
      dispatch(profileActions
        .linkExternalAccountDone(profile, tokenV3, providerType, callbackUrl));
    },
    unlinkExternalAccount: (profile, tokenV3, providerType) => {
      dispatch(profileActions.unlinkExternalAccountInit({ providerType }));
      dispatch(profileActions.unlinkExternalAccountDone(profile, tokenV3, providerType));
    },
    saveEmailPreferences: (profile, tokenV3, preferences) => {
      dispatch(profileActions.saveEmailPreferencesInit());
      dispatch(profileActions.saveEmailPreferencesDone(profile, tokenV3, preferences));
    },
    updatePassword: (profile, tokenV3, newPassword, oldPassword) => {
      dispatch(profileActions.updatePasswordInit());
      dispatch(profileActions.updatePasswordDone(profile, tokenV3, newPassword, oldPassword));
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer);

export default Container;
