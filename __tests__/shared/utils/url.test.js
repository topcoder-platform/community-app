import {
  getMemberProfileUrl,
  getMenuWithDirectProfileLink,
  updateLegacyProfileLinks,
} from 'utils/url';

describe('member profile URLs', () => {
  it('uses the configured profile application URL', () => {
    expect(getMemberProfileUrl('tourist'))
      .toBe('https://profiles.topcoder-dev.com/tourist');
  });

  it('normalizes the profile entry in a navigation menu', () => {
    const menu = [{
      id: 'community',
      secondaryMenu: [{ id: 'myprofile', href: '/members/placeholder' }],
    }];

    expect(getMenuWithDirectProfileLink(menu, 'tourist')[0].secondaryMenu[0])
      .toEqual({
        id: 'profile',
        href: 'https://profiles.topcoder-dev.com/tourist',
      });
  });

  it('updates only an exact legacy profile anchor rendered by navigation', () => {
    const root = document.createElement('nav');
    root.innerHTML = [
      '<a href="/members/tourist">Profile</a>',
      '<a href="/members/tourist/badges">Badges</a>',
    ].join('');

    updateLegacyProfileLinks(root, 'tourist');

    expect(root.querySelector('a').getAttribute('href'))
      .toBe('https://profiles.topcoder-dev.com/tourist');
    expect(root.querySelectorAll('a')[1].getAttribute('href'))
      .toBe('/members/tourist/badges');
  });
});
