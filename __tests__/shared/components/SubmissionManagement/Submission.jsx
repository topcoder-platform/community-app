import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import Submission from 'components/SubmissionManagement/Submission';
import TU from 'react-dom/test-utils';

const mockOnDelete = jest.fn();
const mockOnShowDetails = jest.fn();

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <Submission
      onDelete={mockOnDelete}
      onShowDetails={mockOnShowDetails}
      showScreeningDetails
      type="develop"
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
  rnd.render((
    <Submission
      onDelete={mockOnDelete}
      onShowDetails={mockOnShowDetails}
      submissionObject={{
        submissionId: 12345,
        screening: {},
      }}
      type="design"
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}
  render() {
    return <table><tbody><Submission {...this.props} /></tbody></table>;
  }
}

const page = TU.renderIntoDocument((
  <Wrapper
    onDelete={mockOnDelete}
    onShowDetails={mockOnShowDetails}
    submissionObject={{
      submissionId: 12345,
      screening: {},
    }}
    type="design"
  />
));

describe('User input', () => {
  beforeEach(() => jest.clearAllMocks());

  test.skip('onDelete', () => {
    const icon = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/delete-icon/));
    expect(icon.length).toBe(1);
    TU.Simulate.click(icon[0]);
    expect(mockOnDelete).toHaveBeenCalled();
  });

  test('onShowDetails', () => {
    const icon = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/expand-icon/));
    expect(icon.length).toBe(1);
    TU.Simulate.click(icon[0]);
    expect(mockOnShowDetails).toHaveBeenCalled();
  });
});
