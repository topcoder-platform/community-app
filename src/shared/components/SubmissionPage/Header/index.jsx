/**
 * components.page.challenge-details.submission.header.index Header Component
 *
 * Description:
 *   Header for the submission page.  Displays title and allows navigation
 *   back to challenge details.
 */
import PT from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

/**
 * Header shown on Submissions Page
 */
const Header = ({
  challengeId,
  challengesUrl,
  title,
}) => (
  <div styleName="header">
    <Link to={`${challengesUrl}/${challengeId}`}>
      <span>
&#x2039;
      </span>
      <p>
Back to challenge
      </p>
    </Link>
    <h2>
      {title}
    </h2>
  </div>
);

/**
 * Prop Validation
 */
Header.propTypes = {
  challengeId: PT.number.isRequired,
  challengesUrl: PT.string.isRequired,
  title: PT.string.isRequired,
};

export default Header;
