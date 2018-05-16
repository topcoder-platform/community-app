/**
 * Connects the Redux store to the Settings components.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import { isTokenExpired } from 'tc-accounts';
import { goToLogin } from 'utils/tc';

import actions from 'actions/profile';
import lookupActions from 'actions/lookup';
import dashActions from 'actions/page/dashboard';
import settingsActions, { TABS } from 'actions/page/settings';

import Error404 from 'components/Error404';
import LoadingIndicator from 'components/LoadingIndicator';
import Settings from 'components/Settings';

class SettingsContainer extends React.Component {
  componentDidMount() {
    this.loadPageData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadPageData(nextProps);
  }

  loadPageData(props) {
    const {
      handle,
      profileState,
      settingsTab,
      tokenV3,
      authenticating,
      loadHeaderData,
      loadTabData,
    } = props;

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
    } = this.props;

    if (loadingError) {
      return <Error404 />;
    }

    // Only load the page when authenticated and profile is loaded
    const loaded = !authenticating && profile;

    return loaded ?
      <Settings
        {...this.props}
      />
      : <LoadingIndicator />;
  }
}

SettingsContainer.defaultProps = {
  settingsTab: TABS.PROFILE,
  handle: '',
  tokenV3: '',
  profile: null,
};

SettingsContainer.propTypes = {
  xlBadge: PT.string.isRequired,
  loadHeaderData: PT.func.isRequired,
  loadTabData: PT.func.isRequired,
  selectTab: PT.func.isRequired,
  showXlBadge: PT.func.isRequired,
  uploadPhoto: PT.func.isRequired,
  deletePhoto: PT.func.isRequired,
  updateProfile: PT.func.isRequired,
  addSkill: PT.func.isRequired,
  hideSkill: PT.func.isRequired,
  addWebLink: PT.func.isRequired,
  deleteWebLink: PT.func.isRequired,
  linkExternalAccount: PT.func.isRequired,
  unlinkExternalAccount: PT.func.isRequired,
  saveEmailPreferences: PT.func.isRequired,
  updatePassword: PT.func.isRequired,
  settingsTab: PT.string,
  authenticating: PT.bool.isRequired,
  handle: PT.string,
  tokenV3: PT.string,
  profile: PT.shape(),
  profileState: PT.shape().isRequired,
  settingsPageState: PT.shape().isRequired,
  lookupData: PT.shape().isRequired,
  loadingError: PT.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    xlBadge: state.page.dashboard.xlBadge,
    settingsTab: state.page.settings.settingsTab,
    settingsPageState: state.page.settings,
    authenticating: state.auth.authenticating,
    handle: _.get(state.auth, 'user.handle'),
    tokenV3: state.auth.tokenV3,
    profile: state.auth.profile,
    lookupData: state.lookup,
    profileState: state.profile,
    loadingError: state.profile.loadingError,
  };
}

function mapDispatchToProps(dispatch) {
  const profileActions = actions.profile;
  const loadHeaderData = ({ handle, tokenV3 }) => {
    dispatch(profileActions.loadProfile(handle));
    dispatch(profileActions.getAchievementsInit());
    dispatch(profileActions.getActiveChallengesCountInit());
    dispatch(profileActions.getAchievementsDone(handle));
    dispatch(profileActions.getActiveChallengesCountDone(handle, tokenV3));
  };

  const loadTabData = ({
    handle,
    profile,
    tokenV3,
    settingsTab,
  }) => {
    dispatch(profileActions.loadProfile(handle));

    if (settingsTab === TABS.PROFILE) {
      dispatch(profileActions.getSkillsInit());
      dispatch(profileActions.getLinkedAccountsInit());
      dispatch(profileActions.getExternalAccountsInit());
      dispatch(profileActions.getExternalLinksInit());
      dispatch(lookupActions.lookup.getApprovedSkills());
      dispatch(profileActions.getLinkedAccountsDone(profile, tokenV3));
      dispatch(profileActions.getExternalAccountsDone(handle));
      dispatch(profileActions.getExternalLinksDone(handle));
      dispatch(profileActions.getSkillsDone(handle));
    } else if (settingsTab === TABS.EMAIL) {
      dispatch(profileActions.getEmailPreferencesInit());
      dispatch(profileActions.getEmailPreferencesDone(profile, tokenV3));
    } else if (settingsTab === TABS.ACCOUNT) {
      dispatch(profileActions.getCredentialInit());
      dispatch(profileActions.getCredentialDone(profile, tokenV3));
    }
  };

  return {
    loadHeaderData,
    loadTabData,
    showXlBadge: name => dispatch(dashActions.page.dashboard.showXlBadge(name)),
    selectTab: tab => dispatch(settingsActions.page.settings.selectTab(tab)),
    clearIncorrectPassword: () => dispatch(settingsActions.page.settings.clearIncorrectPassword()),
    addWebLink: (handle, tokenV3, webLink) => {
      dispatch(profileActions.addWebLinkInit());
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
