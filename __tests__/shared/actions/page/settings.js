import actions from 'actions/page/settings';

const payload = 'payload';

describe('page.settings.selectTab', () => {
  const a = actions.page.settings.selectTab(payload);

  test('has expected type', () => {
    expect(a.type).toBe('PAGE/SETTINGS/SELECT_TAB');
  });

  test('Select tab should be returned with identity value', () => expect(a.payload).toBe(payload));
});

describe('page.settings.clearIncorrectPassword', () => {
  const a = actions.page.settings.clearIncorrectPassword(payload);

  test('has expected type', () => {
    expect(a.type).toBe('PAGE/SETTINGS/CLEAR_INCORRECT_PASSWORD');
  });

  test('Clear incorrect password should be returned with identity value', () => expect(a.payload).toBe(payload));
});
