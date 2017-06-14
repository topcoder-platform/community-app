/**
 * IconStat component
 */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-themr';
import defaultStyle from './style.scss';

function IconStat(props) {
  const { icon: Icon, number, label, theme } = props;

  return (
    <div className={theme.container}>
      <Icon className={theme.icon} />
      <p className={theme.number}>{number}</p>
      <p className={theme.label}>{label}</p>
    </div>
  );
}

IconStat.defaultProps = {
  theme: {},
};

IconStat.propTypes = {
  icon: PT.func.isRequired,
  number: PT.oneOfType([PT.number, PT.string]).isRequired,
  label: PT.string.isRequired,
  theme: PT.shape({
    container: PT.string,
    icon: PT.string,
    number: PT.string,
    label: PT.string,
  }),
};

export default themr('tcCommunities-IconStat', defaultStyle)(IconStat);
