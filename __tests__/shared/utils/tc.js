import _ from 'lodash';
import { processSRM, safeForDownload } from 'utils/tc';

describe('utils/tc', () => {
  test('processSRM', () => {
    const srms = [{
      rounds: [{
        userSRMDetails: {
          rated: true,
        },
        codingStartAt: 1500350400000,
        codingEndAt: 1500350400000,
        registrationStartAt: 1500350400000,
        registrationEndAt: 1500350400000,
      }],
    }, {
      rounds: [{}],
    }];
    _.forEach(srms, s => processSRM(s));
  });
});

describe('safeForDownload', () => {
  test('keeps a DMZ submission pending while virusScan is false', () => {
    expect(safeForDownload({
      url: 'https://s3.amazonaws.com/topcoder-dev-submissions-dmz/submission.zip',
      virusScan: false,
    })).toBe('AV Scan in progress');
  });

  test('identifies a quarantined submission as malware', () => {
    expect(safeForDownload({
      url: 'https://s3.amazonaws.com/topcoder-dev-submissions-quarantine/submission.zip',
      virusScan: false,
    })).toBe('Malware found in submission');
  });

  test('preserves the legacy failed scan fallback outside the DMZ', () => {
    expect(safeForDownload({
      url: 'https://downloads.example.com/submission.zip',
      virusScan: false,
    })).toBe('Malware found in submission');
  });

  test('keeps an unknown scan result pending', () => {
    expect(safeForDownload({
      url: 'https://downloads.example.com/submission.zip',
    })).toBe('AV Scan in progress');
  });

  test('allows a clean submission to be downloaded', () => {
    expect(safeForDownload({
      url: 'https://downloads.example.com/submission.zip',
      virusScan: true,
    })).toBe(true);
  });
});
