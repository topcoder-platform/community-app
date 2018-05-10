import { mockAction } from 'utils/mock';

const handle = 'tcscoder';
const photoURL = 'http://url';
const skill = { tagId: 123, tagName: 'Node.js' };
const externalLink = { providerType: 'weblink', key: '1111', URL: 'http://www.github.com' };
const webLink = { providerType: 'weblink', key: '2222', URL: 'http://www.google.com' };
const linkedAccount = { providerType: 'github', social: true, userId: '623633' };
const linkedAccount2 = { providerType: 'stackoverlow', social: true, userId: '343523' };

const mockActions = {
  profile: {
    loadProfile: mockAction('LOAD_PROFILE', handle),
    getInfoDone: mockAction('GET_INFO_DONE', { handle }),
    getExternalLinksDone: mockAction('GET_EXTERNAL_LINKS_DONE', [externalLink]),
    getActiveChallengesCountDone: mockAction('GET_ACTIVE_CHALLENGES_COUNT_DONE', 5),
    getLinkedAccountsDone: mockAction('GET_LINKED_ACCOUNTS_DONE', { profiles: [linkedAccount] }),
    getCredentialDone: mockAction('GET_CREDENTIAL_DONE', { credential: { hasPassword: true } }),
    getEmailPreferencesDone: mockAction('GET_EMAIL_PREFERENCES_DONE', { subscriptions: { TOPCODER_NL_DATA: true } }),
    uploadPhotoInit: mockAction('UPLOAD_PHOTO_INIT'),
    uploadPhotoDone: mockAction('UPLOAD_PHOTO_DONE', { handle, photoURL }),
    deletePhotoInit: mockAction('DELETE_PHOTO_INIT'),
    deletePhotoDone: mockAction('DELETE_PHOTO_DONE', { handle }),
    updatePasswordInit: mockAction('UPDATE_PASSWORD_INIT'),
    updatePasswordDone: mockAction('UPDATE_PASSWORD_DONE'),
    updateProfileInit: mockAction('UPDATE_PROFILE_INIT'),
    updateProfileDone: mockAction('UPDATE_PROFILE_DONE', { handle, description: 'bio desc' }),
    addSkillInit: mockAction('ADD_SKILL_INIT'),
    addSkillDone: mockAction('ADD_SKILL_DONE', { handle, skills: [skill] }),
    hideSkillInit: mockAction('HIDE_SKILL_INIT'),
    hideSkillDone: mockAction('HIDE_SKILL_DONE', { handle, skills: [] }),
    addWebLinkInit: mockAction('ADD_WEB_LINK_INIT'),
    addWebLinkDone: mockAction('ADD_WEB_LINK_DONE', { handle, data: webLink }),
    deleteWebLinkInit: mockAction('DELETE_WEB_LINK_INIT'),
    deleteWebLinkDone: mockAction('DELETE_WEB_LINK_DONE', { handle, data: webLink }),
    saveEmailPreferencesInit: mockAction('SAVE_EMAIL_PREFERENCES_INIT'),
    saveEmailPreferencesDone: mockAction('SAVE_EMAIL_PREFERENCES_DONE', { handle, data: { subscriptions: { TOPCODER_NL_DATA: true } } }),
    linkExternalAccountInit: mockAction('LINK_EXTERNAL_ACCOUNT_INIT'),
    linkExternalAccountDone: mockAction('LINK_EXTERNAL_ACCOUNT_DONE', { handle, data: linkedAccount2 }),
    unlinkExternalAccountInit: mockAction('UNLINK_EXTERNAL_ACCOUNT_INIT'),
    unlinkExternalAccountDone: mockAction('UNLINK_EXTERNAL_ACCOUNT_DONE', { handle, providerType: linkedAccount2.providerType }),
  },
};
jest.setMock(require.resolve('actions/profile'), mockActions);

const reducers = require('reducers/profile');

let reducer;

function testReducer(istate) {
  let state;

  test('Initial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual(istate);
  });

  test('Load profile', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.loadProfile());
    expect(state).toEqual({ ...prevState, profileForHandle: handle });
  });

  test('Get member info', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.getInfoDone());
    expect(state).toEqual({ ...prevState, info: { handle } });
  });

  test('Get external links', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.getExternalLinksDone());
    expect(state).toEqual({ ...prevState, externalLinks: [externalLink] });
  });

  test('Get active challenges count', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.getActiveChallengesCountDone());
    expect(state).toEqual({ ...prevState, activeChallengesCount: 5 });
  });

  test('Get linked account', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.getLinkedAccountsDone());
    expect(state).toEqual({ ...prevState, linkedAccounts: [linkedAccount] });
  });

  test('Get credential', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.getCredentialDone());
    expect(state).toEqual({ ...prevState, credential: { hasPassword: true } });
  });

  test('Get email preferences', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.getEmailPreferencesDone());
    expect(state).toEqual({ ...prevState, emailPreferences: { TOPCODER_NL_DATA: true } });
  });

  test('Upload photo init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.uploadPhotoInit());
    expect(state).toEqual({ ...prevState, uploadingPhoto: true });
  });

  test('Upload photo done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.uploadPhotoDone());
    expect(state).toEqual({ ...prevState, info: { handle, photoURL }, uploadingPhoto: false });
  });

  test('Delete photo init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.deletePhotoInit());
    expect(state).toEqual({ ...prevState, deletingPhoto: true });
  });

  test('Delete photo done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.deletePhotoDone());
    expect(state).toEqual({ ...prevState, info: { handle, photoURL: null }, deletingPhoto: false });
  });

  test('Update profile init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.updateProfileInit());
    expect(state).toEqual({ ...prevState, updatingProfile: true });
  });

  test('Update profile done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.updateProfileDone());
    expect(state).toEqual({ ...prevState, info: { handle, photoURL: null, description: 'bio desc' }, updatingProfile: false });
  });

  test('Add skill init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.addSkillInit());
    expect(state).toEqual({ ...prevState, addingSkill: true });
  });

  test('Add skill done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.addSkillDone());
    expect(state).toEqual({ ...prevState, skills: [skill], addingSkill: false });
  });

  test('Hide skill init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.hideSkillInit());
    expect(state).toEqual({ ...prevState, hidingSkill: true });
  });

  test('Hide skill done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.hideSkillDone());
    expect(state).toEqual({ ...prevState, skills: [], hidingSkill: false });
  });

  test('Add web link init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.addWebLinkInit());
    expect(state).toEqual({ ...prevState, addingWebLink: true });
  });

  test('Add web link done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.addWebLinkDone());
    expect(state).toEqual({
      ...prevState,
      externalLinks: [externalLink, webLink],
      addingWebLink: false,
    });
  });

  test('Delete web link init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.deleteWebLinkInit());
    expect(state).toEqual({ ...prevState, deletingWebLink: true });
  });

  test('Delete web link done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.deleteWebLinkDone());
    expect(state).toEqual({ ...prevState, externalLinks: [externalLink], deletingWebLink: false });
  });

  test('Link external account init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.linkExternalAccountInit());
    expect(state).toEqual({ ...prevState, linkingExternalAccount: true });
  });

  test('Link external account done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.linkExternalAccountDone());
    expect(state).toEqual({
      ...prevState,
      linkedAccounts: [linkedAccount, linkedAccount2],
      linkingExternalAccount: false,
    });
  });

  test('Unlink external account init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.unlinkExternalAccountInit());
    expect(state).toEqual({ ...prevState, unlinkingExternalAccount: true });
  });

  test('Unlink external account done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.unlinkExternalAccountDone());
    expect(state).toEqual({
      ...prevState,
      linkedAccounts: [linkedAccount],
      unlinkingExternalAccount: false,
    });
  });

  test('Save email preferences init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.saveEmailPreferencesInit());
    expect(state).toEqual({ ...prevState, savingEmailPreferences: true });
  });

  test('Save email preferences done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.saveEmailPreferencesDone());
    expect(state).toEqual({
      ...prevState,
      emailPreferences: { TOPCODER_NL_DATA: true },
      savingEmailPreferences: false,
    });
  });

  test('Update password init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.updatePasswordInit());
    expect(state).toEqual({ ...prevState, updatingPassword: true });
  });

  test('Update password done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.updatePasswordDone());
    expect(state).toEqual({ ...prevState, updatingPassword: false });
  });
}

const defaultState = {
  achievements: null,
  copilot: false,
  country: '',
  info: null,
  loadingError: false,
  skills: null,
  stats: null,
};

describe('Default reducer', () => {
  reducer = reducers.default;
  testReducer(defaultState);
});

describe('Factory without server side rendering', () => {
  beforeAll((done) => {
    reducers.factory().then((res) => {
      reducer = res;
      done();
    });
  });

  testReducer(defaultState);
});

