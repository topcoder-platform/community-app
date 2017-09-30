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
      <span>&#x2039;</span>
      <p>Back to challenge</p>
    </Link>
    <h2>{title}</h2>
  </div>
);

Header.propTypes = {
  challengeId: PT.number.isRequired,
  challengesUrl: PT.string.isRequired,
  title: PT.string.isRequired,
};

export default Header;
