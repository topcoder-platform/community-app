import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import ScreeningDetails from 'components/SubmissionManagement/ScreeningDetails';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <ScreeningDetails
      screeningObject={{
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ScreeningDetails
      screeningObject={{
        status: 'failed',
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ScreeningDetails
      screeningObject={{
        status: 'failed',
        warnings: [{
          brief: 'Brief #0',
          details: 'Details #0',
        }],
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ScreeningDetails
      screeningObject={{
        status: 'passed',
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ScreeningDetails
      screeningObject={{
        status: 'passed',
        warnings: [{
          brief: 'Brief #0',
          details: 'Details #0',
        }],
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ScreeningDetails
      screeningObject={{
        status: 'pending',
        warnings: [{
          brief: 'Brief #0',
          details: 'Details #0',
        }],
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
