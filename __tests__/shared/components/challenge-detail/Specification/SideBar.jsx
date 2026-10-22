import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import SideBar from 'components/challenge-detail/Specification/SideBar';

/**
 * Shallow-renders the development challenge sidebar and returns its serialized output.
 *
 * @param {Object} props SideBar props overriding the development defaults.
 * @return {String} JSON of the rendered element tree.
 */
function renderSideBar(props = {}) {
  const renderer = new Renderer();
  renderer.render((
    <SideBar
      challengesUrl="/challenges"
      forumLink=""
      isDevelop
      {...props}
    />
  ));

  return JSON.stringify(renderer.getRenderOutput());
}

describe('Challenge detail sidebar review style', () => {
  test('shows the manual review scorecard link for the final review', () => {
    const renderedText = renderSideBar({
      manualReviewScorecardUrl: 'https://review.topcoder-dev.com/scorecard/hFU73Ve2XlYCK-',
    });

    expect(renderedText).toContain('Manual:');
    expect(renderedText).toContain('Scorecard Link');
    expect(renderedText).toContain('"href":"https://review.topcoder-dev.com/scorecard/hFU73Ve2XlYCK-"');
    expect(renderedText).not.toContain('Community Review Board"');
  });

  test('keeps the review board label when no manual review scorecard exists', () => {
    const renderedText = renderSideBar();

    expect(renderedText).toContain('"Community Review Board"');
    expect(renderedText).not.toContain('Scorecard Link');
  });
});
