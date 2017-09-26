import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './styles.scss';

/**
 * Header shown on Submissions Page
 */
const Header = ({
  title,
  challengeId,
}) => (
  <div styleName="header">
    <Link to={`/challenges/${challengeId}`}>
      <span>&#x2039;</span>
      <p>Back</p>
    </Link>
    <h2>{title}</h2>
  </div>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  challengeId: PropTypes.number.isRequired,
};

export default Header;
