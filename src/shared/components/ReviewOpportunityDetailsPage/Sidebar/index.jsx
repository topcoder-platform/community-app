/**
 * Implements Sidebar for Review Opportunity Details
 */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

/**
 * Sidebar Component
 */
const Sidebar = ({ terms }) => (
  <div styleName="container">
    <h4>HOW TO BECOME A REVIEWER</h4>
    <p>If you are an active participant and interested in joining the Topcoder Review Board, send an email to <a href="mailto:support@topcoder.com">support@topcoder.com</a> to apply.</p>
    <h4>REVIEWER TERMS:</h4>
    {
      terms.map(term => (
        <p key={term.termsOfUseId}><a href={`https://www.topcoder.com/challenges/terms/detail/${term.termsOfUseId}`} target="_blank" rel="noopener noreferrer">{term.title}</a></p>
      ))
    }
  </div>
);

Sidebar.defaultProps = {
  terms: [],
};

Sidebar.propTypes = {
  terms: PT.arrayOf(PT.shape()),
};

export default Sidebar;
