import interpolateProfilePlaceholders from 'utils/profile-template';

describe('profile markdown placeholders', () => {
  it('leaves ordinary markdown unchanged', () => {
    const markdown = '## Find your next gig\n\nBrowse available opportunities.';

    expect(interpolateProfilePlaceholders(markdown, {})).toBe(markdown);
  });

  it('replaces every documented profile property', () => {
    const markdown = [
      '<%= profile.firstName %> <%=profile.lastName%>',
      '(<%= profile.handle %>) #<%= profile.userId %>',
    ].join(' ');
    const profile = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      handle: 'ada',
      userId: 0,
    };

    expect(interpolateProfilePlaceholders(markdown, profile))
      .toBe('Ada Lovelace (ada) #0');
  });

  it('uses an empty string for a missing supported property', () => {
    expect(interpolateProfilePlaceholders(
      'Hello <%= profile.firstName %> <%= profile.lastName %>',
      { firstName: 'Ada' },
    )).toBe('Hello Ada ');
  });

  it('escapes profile values before adding them to markdown', () => {
    expect(interpolateProfilePlaceholders(
      '<%= profile.firstName %>',
      { firstName: '<img src="x"> & \'quoted\'' },
    )).toBe('&lt;img src=&quot;x&quot;&gt; &amp; &#39;quoted&#39;');
  });

  it('keeps unsupported or executable template syntax inert', () => {
    const markdown = [
      '<%= profile.email %>',
      '<% global.compromised = true %>',
      '<%= profile.constructor.constructor("return process")() %>',
    ].join('\n');
    const originalFunction = global.Function;
    let result;

    try {
      global.Function = () => {
        throw new Error('Runtime code generation is blocked by CSP');
      };
      result = interpolateProfilePlaceholders(markdown, {
        email: 'member@example.com',
      });
    } finally {
      global.Function = originalFunction;
    }

    expect(result).toBe(markdown);
  });
});
