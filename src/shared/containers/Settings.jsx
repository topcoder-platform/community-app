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
    console.log("Component will receive props", this.props)
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
    console.log("Load Page Data props", props)
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
    if (handleChanged || settingsTab !== this.props.settingsTab) {
      loadTabData(props);
    }
  }

  render() {
    const {
      authenticating,
      loadingError,
      profile,
      basicInfo,
      // language
    } = this.props;
    console.log("Sending props", this.props);
    if (loadingError) {
      return <Error404 />;
    }

    // Only load the page when authenticated and profile is loaded
    const loaded = !authenticating && profile && basicInfo;

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
    case 'preferences':{
      return PREFERENCESTABS.EMAIL;
    }
  }
}
SettingsContainer.defaultProps = {
  settingsTab: TABS.PROFILE,
  subTab: PROFILETABS.BASICINFO,
  handle: '',
  tokenV3: '',
  profile: null,
  basicInfo: null,
  // language: null
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
  basiInfo: PT.shape(),
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
    // basicInfo: state.language.language,
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
  console.log("actions", actions);
  console.log("profileActions", profileActions);
  console.log("basicInfoActions", basicInfoActions);
  
  const loadHeaderData = ({ handle, tokenV3 }) => {
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
    settingsTab,
    basicInfo,
    // language
  }) => {
    console.log("Subtab", subTab);
    dispatch(profileActions.loadProfile(handle));
    if (settingsTab === TABS.PROFILE) {
      dispatch(settingsActions.page.settings.selectTab('profile/basicinfo'));
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
      dispatch(settingsActions.page.settings.selectTab('tools/devices'));
      dispatch(profileActions.getEmailPreferencesInit());
      dispatch(profileActions.getEmailPreferencesDone(profile, tokenV3));
    } else if (settingsTab === TABS.ACCOUNT) {
      dispatch(settingsActions.page.settings.selectTab('account'));
      dispatch(profileActions.getCredentialInit());
      dispatch(profileActions.getCredentialDone(profile, tokenV3));
    }
    else if (settingsTab === TABS.PREFERENCES) {
      dispatch(settingsActions.page.settings.selectTab('preferences/email'));
      }
    if(subTab===PROFILETABS.BASICINFO){
      console.log("Entering basic info actions");
      dispatch(basicInfoActions.getBasicInfoInit());
      dispatch(basicInfoActions.getBasicInfoDone(handle, tokenV3));
    }
    if(subTab===PROFILETABS.LANGUAGE){
      console.log("Entered language subtab actions");
      dispatch(languageActions.getLanguageInit());
      dispatch(languageActions.getLanguageDone(handle, tokenV3));
    }
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
  mapDispatchToProps,
)(SettingsContainer);

export default Container;
