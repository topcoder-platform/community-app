import _ from 'lodash';
import { actions, mock } from 'topcoder-react-lib';

const { mockAction } = mock;
const handle = 'tcscoder';
const photoURL = 'http://url';
const tab = 'profile';
const webLink = 'http://www.google.com';
const linkToConfirmDelete = { key: '1111', provider: 'weblink', URL: webLink };
const providerType = 'github';
const skill1 = { tagId: 123, tagName: 'Node.js' };
const skill2 = { tagId: 124, tagName: 'Angular.js' };

const mockActions = {
  TABS: {
    PROFILE: 'profile',
  },
  page: {
    settings: {
      selectTab: mockAction('SELECT_TAB', tab),
      clearIncorrectPassword: mockAction('CLEAR_INCORRECT_PASSWORD'),
    },
  },
  profile: {
    uploadPhotoDone: mockAction('PROFILE/UPLOAD_PHOTO_DONE', { handle, photoURL }),
    deletePhotoDone: mockAction('PROFILE/DELETE_PHOTO_DONE', { handle }),
    updateProfileDone: mockAction('PROFILE/UPDATE_PROFILE_DONE', { handle, description: 'bio desc' }),
    updatePasswordDone: mockAction('PROFILE/UPDATE_PASSWORD_DONE'),
    updatePasswordError: mockAction('PROFILE/UPDATE_PASSWORD_DONE', null, 'Unknown error'),
    saveEmailPreferencesDone: mockAction('PROFILE/SAVE_EMAIL_PREFERENCES_DONE'),
    linkExternalAccountDone: mockAction('PROFILE/LINK_EXTERNAL_ACCOUNT_DONE', { data: { providerType } }),
    unlinkExternalAccountInit: mockAction('PROFILE/UNLINK_EXTERNAL_ACCOUNT_INIT', { providerType }),
    unlinkExternalAccountDone: mockAction('PROFILE/UNLINK_EXTERNAL_ACCOUNT_DONE', { providerType }),
    addWebLinkDone: mockAction('PROFILE/ADD_WEB_LINK_DONE'),
    deleteWebLinkInit: mockAction('PROFILE/DELETE_WEB_LINK_INIT', linkToConfirmDelete),
    deleteWebLinkDone: mockAction('PROFILE/DELETE_WEB_LINK_DONE', { handle, data: linkToConfirmDelete }),
    getSkillsDone: mockAction('PROFILE/GET_SKILLS_DONE', { skills: { [skill1.tagId]: skill1 } }),
    addSkillDone: mockAction('PROFILE/ADD_SKILL_DONE', { skill: skill2, skills: { [skill1.tagId]: skill1, [skill2.tagId]: skill2 } }),
    hideSkillDone: mockAction('PROFILE/HIDE_SKILL_DONE', { skill: skill2, skills: { [skill1.tagId]: skill1 } }),
  },
};
jest.setMock(require.resolve('actions/page/settings'), mockActions);
_.merge(actions.profile, mockActions.profile);

const mockToast = {
  toastr: {
    success: jest.fn(),
  },
};
jest.setMock('react-redux-toastr', mockToast);

const reducers = require('reducers/page/settings');

let reducer;

function testReducer(istate) {
  let state;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Initial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual(istate);
  });

  test('Select tab', () => {
    const prevState = state;
    state = reducer(state, mockActions.page.settings.selectTab());
    expect(state).toEqual({ ...prevState, settingsTab: tab });
  });

  test('Clear incorrect password', () => {
    const prevState = state;
    state = reducer(state, mockActions.page.settings.clearIncorrectPassword());
    expect(state).toEqual({ ...prevState, incorrectPassword: false });
  });

  test('Get skills', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.getSkillsDone());
    expect(state).toEqual({ ...prevState, skills: { [skill1.tagId]: { ...skill1, isNew: 0 } } });
  });

  test('Add skill', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.addSkillDone());

    expect(state).toEqual({
      ...prevState,
      skills: { [skill1.tagId]: { ...skill1, isNew: 0 }, [skill2.tagId]: { ...skill2, isNew: 1 } },
    });
  });

  test('Hide skill', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.hideSkillDone());

    expect(state).toEqual({
      ...prevState,
      skills: {
        [skill1.tagId]: {
          ...skill1,
          isNew: 0,
        },
        [skill2.tagId]: {
          ...skill2,
          isNew: 1,
          hidden: true,
        },
      },
    });
  });

  test('Update profile', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.updateProfileDone());
    expect(state).toEqual(prevState);
  });

  test('Update password error', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.updatePasswordError());
    expect(state).toEqual({ ...prevState, incorrectPassword: true });
  });

  test('Update password', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.updatePasswordDone());
    expect(state).toEqual({ ...prevState, incorrectPassword: false });
  });

  test('Upload photo', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.uploadPhotoDone());
    expect(state).toEqual(prevState);
  });

  test('Delete photo', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.deletePhotoDone());
    expect(state).toEqual(prevState);
  });

  test('Save email preferences', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.saveEmailPreferencesDone());
    expect(state).toEqual(prevState);
  });

  test('Link external account', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.linkExternalAccountDone());
    expect(state).toEqual(prevState);
  });

  test('Unlink external account init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.unlinkExternalAccountInit());
    expect(state).toEqual({ ...prevState, deletingLinks: [{ providerType }] });
  });

  test('Unlink external account done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.unlinkExternalAccountDone());
    expect(state).toEqual({ ...prevState, deletingLinks: [] });
  });

  test('Add web link', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.addWebLinkDone());
    expect(state).toEqual(prevState);
  });

  test('Delete web link init', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.deleteWebLinkInit());
    expect(state).toEqual({ ...prevState, deletingLinks: [linkToConfirmDelete] });
  });

  test('Delete web link done', () => {
    const prevState = state;
    state = reducer(state, mockActions.profile.deleteWebLinkDone());
    expect(state).toEqual({ ...prevState, deletingLinks: [] });
  });
}

const defaultState = {
  settingsTab: 'profile',
  deletingLinks: [],
};

describe('Default reducer', () => {
  reducer = reducers.default;
  testReducer(defaultState);
});

describe('Factory with server side rendering', () => {
  beforeAll((done) => {
    reducers.factory({ url: '/settings/account/?aa=bb' }).then((res) => {
      reducer = res;
      done();
    });
  });

  testReducer({
    settingsTab: 'account',
    deletingLinks: [],
  });
});

