import React from 'react';
// import ReactDOM from 'react-dom';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import SubmissionHistoryRow from 'components/challenge-detail/Submissions/SubmissionRow/SubmissionHistoryRow';

const mockData = {
  isMM: true,
  submission: 1,
  finalScore: 80,
  provisionalScore: 80,
  submissionTime: '2017-11-06T15:49:35.000Z',
  isReviewPhaseComplete: false,
  status: 'completed',
  numWinners: 1,
  challengeStatus: 'Completed',
  auth: {
    tokenV3: 'tokenV3',
  },
  submissionId: '1',
  isLoggedIn: true,
};

describe('Matches shallow shapshot', () => {
  test.skip('shapshot 1', () => {
    const renderer = new Renderer();

    renderer.render((
      <SubmissionHistoryRow {...mockData} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <SubmissionHistoryRow {...this.props} />;
  }
}

describe('render properly', () => {
  test('click', () => {
    const instance = TU.renderIntoDocument((<Wrapper {...mockData} />));
    const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
    expect(matches).toHaveLength(1);
    TU.Simulate.click(matches[0]);
  });
});
