import * as ChallengesService from 'services/challenges';
import * as MembersService from 'services/members';
import * as UserService from 'services/user';

import actions from 'actions/profile';

const handle = 'tcscoder';
const tokenV3 = 'tokenV3';
const profile = { userId: 12345, handle };
const skill = { tagId: 123, tagName: 'Node.js' };
const weblink = 'https://www.google.com';
const linkedAccounts = [{
  providerType: 'github',
  social: true,
  userId: '623633',
}];

// Mock services
const mockChanllengesService = {
  getUserChallenges: jest.fn().mockReturnValue(Promise.resolve({ totalCount: 3 })),
  getUserMarathonMatches: jest.fn().mockReturnValue(Promise.resolve({ totalCount: 5 })),
};
ChallengesService.getService = jest.fn().mockReturnValue(mockChanllengesService);

const mockMembersService = {
  getPresignedUrl: jest.fn().mockReturnValue(Promise.resolve()),
  uploadFileToS3: jest.fn().mockReturnValue(Promise.resolve()),
  updateMemberPhoto: jest.fn().mockReturnValue(Promise.resolve('url-of-photo')),
  updateMemberProfile: jest.fn().mockReturnValue(Promise.resolve(profile)),
  addSkill: jest.fn().mockReturnValue(Promise.resolve({ skills: [skill] })),
  hideSkill: jest.fn().mockReturnValue(Promise.resolve({ skills: [] })),
  addWebLink: jest.fn().mockReturnValue(Promise.resolve(weblink)),
  deleteWebLink: jest.fn().mockReturnValue(Promise.resolve(weblink)),
};
MembersService.getService = jest.fn().mockReturnValue(mockMembersService);

const mockUserService = {
  linkExternalAccount: jest.fn().mockReturnValue(Promise.resolve(linkedAccounts[0])),
  unlinkExternalAccount: jest.fn().mockReturnValue(Promise.resolve('unlinked')),
  getLinkedAccounts: jest.fn().mockReturnValue(Promise.resolve({ profiles: linkedAccounts })),
  getCredential: jest.fn().mockReturnValue(Promise.resolve({ credential: { hasPassword: true } })),
  getEmailPreferences:
    jest.fn().mockReturnValue(Promise.resolve({ subscriptions: { TOPCODER_NL_DATA: true } })),
  saveEmailPreferences:
    jest.fn().mockReturnValue(Promise.resolve({ subscriptions: { TOPCODER_NL_DATA: true } })),
  updatePassword: jest.fn().mockReturnValue(Promise.resolve({ update: true })),
};
UserService.getService = jest.fn().mockReturnValue(mockUserService);


describe('profile.getActiveChallengesCountDone', () => {
  const a = actions.profile.getActiveChallengesCountDone(handle, tokenV3);

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/GET_ACTIVE_CHALLENGES_COUNT_DONE');
  });

  test('Sum of challenges and marathon matches should be returned', () =>
    a.payload.then((res) => {
      expect(res).toBe(8);
      expect(mockChanllengesService.getUserChallenges).toBeCalled();
      expect(mockChanllengesService.getUserMarathonMatches).toBeCalled();
    }));
});

describe('profile.uploadPhotoDone', () => {
  const a = actions.profile.uploadPhotoDone(handle, tokenV3);

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/UPLOAD_PHOTO_DONE');
  });

  test('Photo URL should be returned', () =>
    a.payload.then((res) => {
      expect(res).toEqual({
        handle,
        photoURL: 'url-of-photo',
      });
      expect(mockMembersService.getPresignedUrl).toBeCalled();
      expect(mockMembersService.uploadFileToS3).toBeCalled();
      expect(mockMembersService.updateMemberPhoto).toBeCalled();
    }));
});

describe('profile.updateProfileDone', () => {
  const a = actions.profile.updateProfileDone(profile, tokenV3);

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/UPDATE_PROFILE_DONE');
  });

  test('Profile should be updated', () =>
    a.payload.then((res) => {
      expect(res).toEqual(profile);
      expect(mockMembersService.updateMemberProfile).toBeCalled();
    }));
});

describe('profile.addSkillDone', () => {
  const a = actions.profile.addSkillDone(handle, tokenV3, skill);

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/ADD_SKILL_DONE');
  });

  test('Skill should be added', () =>
    a.payload.then((res) => {
      expect(res).toEqual({ skills: [skill], handle, skill });
      expect(mockMembersService.addSkill).toBeCalled();
    }));
});

describe('profile.hideSkillDone', () => {
  const a = actions.profile.hideSkillDone(handle, tokenV3, skill);

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/HIDE_SKILL_DONE');
  });

  test('Skill should be removed', () =>
    a.payload.then((res) => {
      expect(res).toEqual({ skills: [], handle, skill });
      expect(mockMembersService.hideSkill).toBeCalled();
    }));
});

describe('profile.addWebLinkDone', () => {
  const a = actions.profile.addWebLinkDone(handle, tokenV3, weblink);

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/ADD_WEB_LINK_DONE');
  });

  test('Web link should be added', () =>
    a.payload.then((res) => {
      expect(res).toEqual({ data: weblink, handle });
      expect(mockMembersService.addWebLink).toBeCalled();
    }));
});

describe('profile.deleteWebLinkDone', () => {
  const a = actions.profile.deleteWebLinkDone(handle, tokenV3, weblink);

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/DELETE_WEB_LINK_DONE');
  });

  test('Web link should be deleted', () =>
    a.payload.then((res) => {
      expect(res).toEqual({ data: weblink, handle });
      expect(mockMembersService.deleteWebLink).toBeCalled();
    }));
});

describe('profile.linkExternalAccountDone', () => {
  const a = actions.profile.linkExternalAccountDone(profile, tokenV3, 'github');

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/LINK_EXTERNAL_ACCOUNT_DONE');
  });

  test('External account should be linked', () =>
    a.payload.then((res) => {
      expect(res).toEqual({ data: linkedAccounts[0], handle });
      expect(mockUserService.linkExternalAccount).toBeCalled();
    }));
});

describe('profile.unlinkExternalAccountDone', () => {
  const a = actions.profile.unlinkExternalAccountDone(profile, tokenV3, 'github');

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/UNLINK_EXTERNAL_ACCOUNT_DONE');
  });

  test('External account should be unlinked', () =>
    a.payload.then((res) => {
      expect(res).toEqual({ handle, providerType: 'github' });
      expect(mockUserService.unlinkExternalAccount).toBeCalled();
    }));
});

describe('profile.getLinkedAccountsDone', () => {
  const a = actions.profile.getLinkedAccountsDone(profile, tokenV3);

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/GET_LINKED_ACCOUNTS_DONE');
  });

  test('Linked account should be returned', () =>
    a.payload.then((res) => {
      expect(res).toEqual({ profiles: linkedAccounts });
      expect(mockUserService.getLinkedAccounts).toBeCalled();
    }));
});

describe('profile.getCredentialDone', () => {
  const a = actions.profile.getCredentialDone(profile, tokenV3);

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/GET_CREDENTIAL_DONE');
  });

  test('Credential should be returned', () =>
    a.payload.then((res) => {
      expect(res).toEqual({ credential: { hasPassword: true } });
      expect(mockUserService.getCredential).toBeCalled();
    }));
});

describe('profile.getEmailPreferencesDone', () => {
  const a = actions.profile.getEmailPreferencesDone(profile, tokenV3);

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/GET_EMAIL_PREFERENCES_DONE');
  });

  test('Email preferences should be returned', () =>
    a.payload.then((res) => {
      expect(res).toEqual({ subscriptions: { TOPCODER_NL_DATA: true } });
      expect(mockUserService.getEmailPreferences).toBeCalled();
    }));
});

describe('profile.saveEmailPreferencesDone', () => {
  const a = actions.profile.saveEmailPreferencesDone(profile, tokenV3, {});

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/SAVE_EMAIL_PREFERENCES_DONE');
  });

  test('Email preferences should be updated', () =>
    a.payload.then((res) => {
      expect(res).toEqual({ handle, data: { subscriptions: { TOPCODER_NL_DATA: true } } });
      expect(mockUserService.saveEmailPreferences).toBeCalled();
    }));
});

describe('profile.updatePasswordDone', () => {
  const a = actions.profile.updatePasswordDone(profile, tokenV3, 'newPassword', 'oldPassword');

  test('has expected type', () => {
    expect(a.type).toBe('PROFILE/UPDATE_PASSWORD_DONE');
  });

  test('User password should be updated', () =>
    a.payload.then((res) => {
      expect(res).toEqual({ handle, data: { update: true } });
      expect(mockUserService.updatePassword).toBeCalled();
    }));
});

