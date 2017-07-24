import { setText, setTags, setSubtracks, setStartDate } from 'utils/challenge-listing/filter';

describe('utils/challenge-listing/filter', () => {
  let res;
  test('setText', () => {
    res = setText({}, '');
    expect(res).toEqual({});
    res = setText({}, 'text');
    expect(res).toEqual({ text: 'text' });
    res = setText({ text: 'text' });
    expect(res).toEqual({});
  });

  test('setTags', () => {
    res = setTags({});
    expect(res).toEqual({});
    res = setTags({}, 'tags');
    expect(res).toEqual({ tags: 'tags' });
    res = setTags({ tags: 'tags' });
    expect(res).toEqual({});
  });

  test('setSubtracks', () => {
    res = setSubtracks({});
    expect(res).toEqual({});
    res = setSubtracks({}, 'subtracks');
    expect(res).toEqual({ subtracks: 'subtracks' });
    res = setSubtracks({ subtracks: 'subtracks' });
    expect(res).toEqual({});
  });

  test('setStartDate', () => {
    res = setStartDate({});
    expect(res).toEqual({});
    res = setStartDate({}, 'startDate');
    expect(res).toEqual({ startDate: 'startDate' });
    res = setStartDate({ startDate: 'startDate' });
    expect(res).toEqual({});
  });
});
