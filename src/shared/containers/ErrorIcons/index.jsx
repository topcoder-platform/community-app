/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/anchor-is-valid */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { actions, errors as libErrors } from 'topcoder-react-lib';
import Tooltip from 'components/Tooltip';
import APIErrorIcon from './APIError.svg';
import NetworkErrorIcon from './NetworkError.svg';

import './style.scss';

const { ERROR_ICON_TYPES } = libErrors;

const Icons = {
  [ERROR_ICON_TYPES.API]: <APIErrorIcon />,
  [ERROR_ICON_TYPES.NETWORK]: <NetworkErrorIcon />,
};

function Tip({ errors, clear }) {
  return (
    <div styleName="Tip">
      <a styleName="clear" onClick={clear} role="button" tabIndex={-1}>
        &#10799;
      </a>
      {
        errors.map(({ title, message }) => (
          <div key={`${title}-${message}`} styleName="item">
            <div styleName="title" title={title}>
              {title}
            </div>
            <div styleName="message">
              {message}
            </div>
          </div>
        ))
      }
    </div>
  );
}

Tip.propTypes = {
  errors: PT.arrayOf(PT.shape()).isRequired,
  clear: PT.func.isRequired,
};

function ErrorIconsContainer({
  errorIcons,
  clearErrorIcon,
}) {
  if (_.values(errorIcons).every(_.isEmpty)) {
    return null;
  }

  return (
    <div styleName="container">
      {_.toPairs(errorIcons).map(([id, errors]) => (
        !_.isEmpty(errors) ? (
          <Tooltip
            key={id}
            styleName="Tooltip"
            content={<Tip errors={errors} clear={() => clearErrorIcon(id)} />}
          >
            {Icons[id] || null}
          </Tooltip>
        ) : null
      ))}
    </div>
  );
}

ErrorIconsContainer.propTypes = {
  errorIcons: PT.shape().isRequired,
  clearErrorIcon: PT.func.isRequired,
};

/**
 * Standard redux function, passes redux state into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Object} state Redux state
 * @return {Object}
 */
const mapStateToProps = state => ({
  errorIcons: state.errors.icons,
});

/**
 * Standard redux function, passes redux actions into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Function} dispatch Function to dispatch action to reducers
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  clearErrorIcon: id => dispatch(actions.errors.clearErrorIcon(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorIconsContainer);
