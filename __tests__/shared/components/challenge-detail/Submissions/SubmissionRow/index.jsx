import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import SubmissionRow from 'components/challenge-detail/Submissions/SubmissionRow';

/**
 * Locates a rendered table column by the text in its direct header child.
 * Tests use this to inspect one score column without relying on generated CSS class names.
 *
 * @param {React.Node} node Rendered React node to search.
 * @param {String} header Header text identifying the column.
 * @returns {React.Element|null} Matching column element, or null when not found.
 * @throws This function does not throw.
 */
function findColumnByHeader(node, header) {
  if (!React.isValidElement(node)) {
    return null;
  }

  const children = React.Children.toArray(node.props.children);
  const hasHeader = children.some(child => (
    React.isValidElement(child)
    && React.Children.toArray(child.props.children).includes(header)
  ));

  if (hasHeader) {
    return node;
  }

  return children.reduce(
    (column, child) => column || findColumnByHeader(child, header),
    null,
  );
}

/**
 * Collects primitive text and number children from a rendered React node.
 * Tests use the returned values to assert a column's visible label and score.
 *
 * @param {React.Node} node Rendered React node to traverse.
 * @returns {Array<String|Number>} Visible primitive child values in render order.
 * @throws This function does not throw.
 */
function collectText(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return [node];
  }
  if (!React.isValidElement(node)) {
    return [];
  }

  return React.Children.toArray(node.props.children)
    .reduce((text, child) => text.concat(collectText(child)), []);
}

/**
 * Shallow-renders an MM row and returns the selected score column text.
 * Tests use this to compare score display behavior across scorer process states.
 *
 * @param {String} scoreHeader Header for the score column to inspect.
 * @param {String} testProcess Review API test process metadata.
 * @param {String} testStatus Review API test status metadata.
 * @param {Number|null} finalScore Final score supplied by Review API.
 * @returns {Array<String|Number>} Score column label and displayed value.
 * @throws {Error} Propagates errors raised while shallow-rendering SubmissionRow.
 */
function renderScore(scoreHeader, testProcess, testStatus, finalScore = null) {
  const renderer = new Renderer();
  renderer.render(
    <SubmissionRow
      auth={{}}
      challengeStatus="ACTIVE"
      isMM
      isRDM={false}
      member="test-member"
      numWinners={0}
      onShowPopup={jest.fn()}
      openHistory={false}
      showFinalResults
      submissions={[
        {
          finalScore,
          id: 'submission-id',
          provisionalScore: 0,
          reviewSummations: [
            {
              metadata: {
                testProcess,
                testStatus,
              },
            },
          ],
          status: 'completed',
          submissionId: 'submission-id',
          submissionTime: '2026-07-30T00:00:00.000Z',
        },
      ]}
      viewAsTable
    />,
  );

  const column = findColumnByHeader(renderer.getRenderOutput(), scoreHeader);
  return collectText(column);
}

describe('Marathon Match provisional score', () => {
  it('shows N/A while provisional tests are still running', () => {
    expect(renderScore('PROVISIONAL SCORE', 'provisional', 'IN PROGRESS'))
      .toEqual(['PROVISIONAL SCORE', 'N/A']);
  });

  it('keeps a completed zero provisional score visible', () => {
    expect(renderScore('PROVISIONAL SCORE', 'provisional', 'SUCCESS'))
      .toEqual(['PROVISIONAL SCORE', 0]);
  });

  it('keeps the provisional score visible while system tests are running', () => {
    expect(renderScore('PROVISIONAL SCORE', 'system', 'IN PROGRESS'))
      .toEqual(['PROVISIONAL SCORE', 0]);
  });
});

describe('Marathon Match final score', () => {
  it('shows N/A while system tests are still running', () => {
    expect(renderScore('FINAL SCORE', 'system', 'IN PROGRESS', 0))
      .toEqual(['FINAL SCORE', 'N/A']);
  });

  it('keeps a completed zero final score visible', () => {
    expect(renderScore('FINAL SCORE', 'system', 'SUCCESS', 0))
      .toEqual(['FINAL SCORE', 0]);
  });
});
