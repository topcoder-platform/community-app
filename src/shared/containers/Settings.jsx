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
import settingsActions, { TABS } from 'actions/page/settings';
import settingsUIActions from 'actions/page/ui';

import Error404 from 'components/Error404';
import LoadingIndicator from 'components/LoadingIndicator';
import Settings from 'components/Settings';

class SettingsContainer extends React.PureComponent {
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
      settingsTab: targetSEttingsTab,
      tokenV3,
      authenticating,
      loadTabData,
      loadAllUserTraits,
    } = props;

    const {
      settingsTab,
    } = this.props;

    if (authenticating) return;

    // Check auth token, go to login page if invalid
    if (!tokenV3 || isTokenExpired(tokenV3)) {
      goToLogin('community-app-main');
      return;
    }

    const handleChanged = handle !== profileState.profileForHandle;

    // Load all user traits
    if (handleChanged) {
      loadAllUserTraits(handle, tokenV3);
    }

    // Load tab data
    if (handleChanged || targetSEttingsTab !== settingsTab) {
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

    return loaded
      ? (
        <Settings
          {...this.props}
        />
      )
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
  loadTabData: PT.func.isRequired,
  selectTab: PT.func.isRequired,
  uploadPhoto: PT.func.isRequired,
  deletePhoto: PT.func.isRequired,
  updateProfile: PT.func.isRequired,
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
    settingsTab: state.page.settings.settingsTab,
    settingsPageState: state.page.settings,
    authenticating: state.auth.authenticating,
    handle: _.get(state.auth, 'user.handle'),
    tokenV3: state.auth.tokenV3,
    profile: state.auth.profile,
    lookupData: state.lookup,
    profileState: state.profile,
    activeChallengesCount: _.get(state.challenge, 'activeChallengesCount'),
    loadingError: state.profile.loadingError,
    settingsUI: state.page.ui.settings,
    settings: state.settings,
    userTraits: state.settings.userTraits,
    skills: state.profile.skills,
  };
}

function mapDispatchToProps(dispatch) {
  const profileActions = actions.profile;

  const loadTabData = ({
    handle,
    profile,
    tokenV3,
    settingsTab,
  }) => {
    dispatch(profileActions.loadProfile(handle));
    if (settingsTab === TABS.PROFILE) {
      dispatch(profileActions.getSkillsDone(handle));
    } else if (settingsTab === TABS.PREFERENCES) {
      dispatch(profileActions.getEmailPreferencesDone(profile, tokenV3));
    } else if (settingsTab === TABS.ACCOUNT) {
      dispatch(profileActions.getLinkedAccountsDone(profile, tokenV3));
      dispatch(profileActions.getExternalLinksDone(handle));
      dispatch(profileActions.getCredentialDone(profile, tokenV3));
    }
  };

  return {
    loadTabData,
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
    toggleProfileSideTab: (tab) => {
      dispatch(settingsUIActions.ui.settings.profile.toggleTab(tab));
    },
    toggleToolsSideTab: (tab) => {
      dispatch(settingsUIActions.ui.settings.tools.toggleTab(tab));
    },
    toggleAccountSideTab: (tab) => {
      dispatch(settingsUIActions.ui.settings.account.toggleTab(tab));
    },
    loadAllUserTraits: (handle, tokenV3) => {
      dispatch(actions.settings.getAllUserTraits(handle, tokenV3));
    },
    addUserTrait: (handle, traitId, data, tokenV3) => {
      dispatch(actions.settings.addUserTrait(handle, traitId, data, tokenV3));
    },
    addUserSkill: (handle, skill, tokenV3) => {
      dispatch(actions.profile.addSkillInit());
      dispatch(actions.profile.addSkillDone(handle, tokenV3, _.assign(skill, { tagId: skill.id })));
    },
    updateUserTrait: (handle, traitId, data, tokenV3) => {
      dispatch(actions.settings.updateUserTrait(handle, traitId, data, tokenV3));
    },
    deleteUserTrait: (handle, traitId, tokenV3) => {
      dispatch(actions.settings.deleteUserTrait(handle, traitId, tokenV3));
    },
    deleteUserSkill: (handle, skill, tokenV3) => {
      dispatch(actions.profile.hideSkillInit());
      dispatch(
        actions.profile.hideSkillDone(handle, tokenV3, _.assign(skill, { tagId: skill.id })),
      );
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsContainer);

export default Container;
