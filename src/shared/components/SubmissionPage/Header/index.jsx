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
import LeftArrow from 'assets/images/arrow-prev-green.svg';
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
    <Link to={`${challengesUrl}/${challengeId}`} styleName="header-link">
      <LeftArrow styleName="left-arrow" />
      <p>
        {title}
      </p>
    </Link>
  </div>
);

/**
 * Prop Validation
 */
Header.propTypes = {
  challengeId: PT.string.isRequired,
  challengesUrl: PT.string.isRequired,
  title: PT.string.isRequired,
};

export default Header;
