import React from 'react';
import PT from 'prop-types';

import moment from 'moment';

import './styles.scss';
import { Link } from 'react-router-dom';

const Footer = ({ avatarUrl, createdBy, eventDate }) => (
  <div styleName="footer">
    <img alt="user-avatar" src={avatarUrl} styleName="avatar" />
    <Link styleName="handle" to={`/members/${createdBy}`}>{ createdBy }</Link>
    <ul styleName="date">
      <li>{moment(eventDate).format('MMM DD, YYYY')}</li>
    </ul>
  </div>
);

Footer.defaultProps = {
  avatarUrl: '',
  createdBy: '',
  eventDate: '',
};

Footer.propTypes = {
  avatarUrl: PT.string,
  createdBy: PT.string,
  eventDate: PT.string,
};

export default Footer;
