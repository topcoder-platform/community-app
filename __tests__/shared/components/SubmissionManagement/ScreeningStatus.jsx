import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
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
        warnings: ['warning', 'warning'],
      }}
      submissionId={12345}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <ScreeningStatus {...this.props} />;
  }
}

const onShowDetails = jest.fn();

const instance = TU.renderIntoDocument((<Wrapper
  onShowDetails={onShowDetails}
  screeningObject={{
    status: 'pending',
    warnings: [],
  }}
  submissionId={12345}
/>));

test('click', () => {
  const button = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
  TU.Simulate.click(button[0]);
  expect(onShowDetails).toHaveBeenCalled();
});
