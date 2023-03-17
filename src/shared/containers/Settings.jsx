/**
 * Connects the Redux store to the Settings components.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import { isTokenExpired } from '@topcoder-platform/tc-auth-lib';
import { goToLogin } from 'utils/tc';

import { actions } from 'topcoder-react-lib';
import settingsActions, { TABS } from 'actions/page/settings';
import settingsUIActions from 'actions/page/ui';
import mfaActions from 'actions/mfa';
import identityActions from 'actions/identity';

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
  updateProfileV5: PT.func.isRequired,
  addWebLink: PT.func.isRequired,
  deleteWebLink: PT.func.isRequired,
  linkExternalAccount: PT.func.isRequired,
  unlinkExternalAccount: PT.func.isRequired,
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
  updateEmailConflict: PT.func.isRequired,
};

function mapStateToProps(state) {
  return {
    settingsTab: state.page.settings.settingsTab,
    settingsPageState: state.page.settings,
    authenticating: state.auth.authenticating,
    handle: _.get(state.auth, 'user.handle'),
    emailAddress: _.defaults(_.get(state.auth, 'user.email'), _.get(state.auth, 'profile.email')),
    tokenV3: state.auth.tokenV3,
    profile: state.auth.profile,
    user: state.auth.user,
    lookupData: state.lookup,
    profileState: state.profile,
    loadingError: state.profile.loadingError,
    settingsUI: state.page.ui.settings,
    settings: state.settings,
    traitRequestCount: state.settings.traitRequestCount,
    userTraits: state.settings.userTraits,
    skills: state.profile.skills,
    usermfa: state.usermfa,
  };
}

function mapDispatchToProps(dispatch) {
  const profileActions = actions.profile;
  const lookupActions = actions.lookup;

  const loadTabData = ({
    handle,
    profile,
    tokenV3,
    settingsTab,
    user,
  }) => {
    dispatch(profileActions.loadProfile(handle));
    if (settingsTab === TABS.PROFILE) {
      dispatch(profileActions.getSkillsDone(handle));
      dispatch(lookupActions.getSkillTagsInit());
      dispatch(lookupActions.getSkillTagsDone());
      dispatch(lookupActions.getCountriesInit());
      dispatch(lookupActions.getCountriesDone());
    } else if (settingsTab === TABS.PREFERENCES) {
      // Deprecated. Leaving it here as reminder to update topcoder-react-lib as well
      // dispatch(profileActions.getEmailPreferencesDone(profile, tokenV3));
    } else if (settingsTab === TABS.ACCOUNT) {
      if (profile.userId) {
        dispatch(profileActions.getLinkedAccountsDone(profile, tokenV3));
      } else if (user.userId) {
        dispatch(profileActions.getLinkedAccountsDone(user, tokenV3));
      }
      dispatch(profileActions.getExternalLinksDone(handle));
      if (profile.userId) {
        dispatch(profileActions.getCredentialDone(profile, tokenV3));
      } else if (user.userId) {
        dispatch(profileActions.getCredentialDone(user, tokenV3));
      }
      if (profile.userId) {
        dispatch(mfaActions.usermfa.getUser2faDone(profile.userId, tokenV3));
      } else if (user.userId) {
        dispatch(mfaActions.usermfa.getUser2faDone(user.userId, tokenV3));
      }
    } else if (settingsTab === TABS.TOOLS) {
      dispatch(lookupActions.getTypesInit());
      dispatch(lookupActions.getTypesDone());
    }
  };

  return {
    loadTabData,
    selectTab: tab => dispatch(settingsActions.page.settings.selectTab(tab)),
    clearIncorrectPassword: () => dispatch(settingsActions.page.settings.clearIncorrectPassword()),
    clearToastrNotification:
      (() => dispatch(settingsActions.page.settings.clearToastrNotification())),
    addWebLink: (handle, tokenV3, webLink) => {
      dispatch(profileActions.addWebLinkInit());
      dispatch(profileActions.addWebLinkDone(handle, tokenV3, webLink));
    },
    getDeviceTypes: () => {
      dispatch(lookupActions.getTypesInit());
      dispatch(lookupActions.getTypesDone());
    },
    clearDeviceState: () => {
      // reset manufacturers, models, oses
      dispatch(lookupActions.getManufacturersInit());
    },
    getManufacturers: (type) => {
      dispatch(lookupActions.getManufacturersInit());
      dispatch(lookupActions.getManufacturersDone(type));
    },
    getModels: (page, type, manufacturer) => {
      dispatch(lookupActions.getModelsInit(page));
      dispatch(lookupActions.getModelsDone(page, type, manufacturer));
    },
    getMoreModels: (page, type, manufacturer) => {
      dispatch(lookupActions.getModelsInit(page));
      dispatch(lookupActions.getModelsDone(page, type, manufacturer));
    },
    getOses: (page, type, manufacturer, model) => {
      dispatch(lookupActions.getOsesInit(page));
      dispatch(lookupActions.getOsesDone(page, type, manufacturer, model));
    },
    getMoreOses: (page, type, manufacturer, model) => {
      dispatch(lookupActions.getOsesInit(page));
      dispatch(lookupActions.getOsesDone(page, type, manufacturer, model));
    },
    deleteWebLink: (handle, tokenV3, webLink) => {
      dispatch(profileActions.deleteWebLinkInit(webLink));
      dispatch(profileActions.deleteWebLinkDone(handle, tokenV3, webLink));
    },
    uploadPhotoInit: () => {
      dispatch(profileActions.uploadPhotoInit());
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
    updateProfileV5: (profile, handle, tokenV5) => {
      dispatch(profileActions.updateProfileInitV5());
      dispatch(profileActions.updateProfileDoneV5(profile, handle, tokenV5));
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
      dispatch(actions.settings.modifyUserTraitInit());
      return dispatch(actions.settings.addUserTrait(handle, traitId, data, tokenV3));
    },
    addUserSkill: (handle, skill, tokenV3) => {
      dispatch(actions.profile.addSkillInit());
      dispatch(actions.profile.addSkillDone(handle, tokenV3, _.assign(skill, { tagId: skill.id })));
    },
    updateUserTrait: (handle, traitId, data, tokenV3) => {
      dispatch(actions.settings.modifyUserTraitInit());
      return dispatch(actions.settings.updateUserTrait(handle, traitId, data, tokenV3));
    },
    deleteUserTrait: (handle, traitId, tokenV3) => {
      dispatch(actions.settings.modifyUserTraitInit());
      dispatch(actions.settings.deleteUserTrait(handle, traitId, tokenV3));
    },
    deleteUserSkill: (handle, skill, tokenV3) => {
      dispatch(actions.profile.hideSkillInit());
      dispatch(
        actions.profile.hideSkillDone(handle, tokenV3, _.assign(skill, { tagId: skill.id })),
      );
    },
    updateEmailConflict: (state) => {
      dispatch(actions.profile.updateEmailConflict(state));
    },
    getUser2fa: (userId, tokenV3) => {
      dispatch(mfaActions.usermfa.getUser2faDone(userId, tokenV3));
    },
    updateUser2fa: (userId, mfaEnabled, tokenV3) => {
      dispatch(mfaActions.usermfa.updateUser2faInit());
      dispatch(mfaActions.usermfa.updateUser2faDone(userId, mfaEnabled, tokenV3));
    },
    updateUserDice: (userId, diceEnabled, tokenV3) => {
      dispatch(mfaActions.usermfa.updateUserDiceDone(userId, diceEnabled, tokenV3));
    },
    getNewDiceConnection: (userId, tokenV3) => {
      dispatch(mfaActions.usermfa.getNewDiceConnectionInit());
      dispatch(mfaActions.usermfa.getNewDiceConnectionDone(userId, tokenV3));
    },
    getDiceConnection: (userId, connectionId, tokenV3) => {
      dispatch(mfaActions.usermfa.getDiceConnectionInit());
      dispatch(mfaActions.usermfa.getDiceConnectionDone(userId, connectionId, tokenV3));
    },
    updatePrimaryRole: (role, tokenV3) => {
      dispatch(identityActions.identity.updatePrimaryRoleInit());
      dispatch(identityActions.identity.updatePrimaryRoleDone(role, tokenV3));
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsContainer);

export default Container;
