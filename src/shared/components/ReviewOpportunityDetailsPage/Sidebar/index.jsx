/**
 * Implements Sidebar for Review Opportunity Details
 */
import React from 'react';

import './styles.scss';

/**
 * Sidebar Component
 */
const Sidebar = () => (
  <div styleName="container">
    <h4>HOW TO BECOME A REVIEWER</h4>
    <p>If you are an active participant and interested in joining the Topcoder Review Board, send an email to <a href="mailto:support@topcoder.com">support@topcoder.com</a> to apply.</p>
    <h4>REVIEWER TERMS:</h4>
    <p><a href="https://www.topcoder.com/challenges/terms/detail/20704" target="_blank" rel="noopener noreferrer">Standard Terms for TopCoder Reviewer.</a></p>
  </div>
);

export default Sidebar;
