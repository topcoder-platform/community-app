import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import ScreeningStatus from 'components/SubmissionManagement/ScreeningStatus';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <ScreeningStatus
      screeningObject={{
        status: 'failed',
      }}
      submissionId={12345}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ScreeningStatus
      screeningObject={{
        status: 'failed',
        warnings: [],
      }}
      submissionId={12345}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ScreeningStatus
      screeningObject={{
        status: 'passed',
      }}
      submissionId={12345}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ScreeningStatus
      screeningObject={{
        status: 'passed',
        warnings: [],
      }}
      submissionId={12345}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ScreeningStatus
      screeningObject={{
        status: 'pending',
        warnings: [],
      }}
      submissionId={12345}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ScreeningStatus
      screeningObject={{
        status: 'Screening Status',
        warnings: [],
      }}
      submissionId={12345}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
