import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import actions from 'actions/status';
import Tooltip from 'components/Tooltip';
import APIErrorIcon from './APIError.svg';
import NetworkErrorIcon from './NetworkError.svg';

import './style.scss';

function Tip({ errors, clear }) {
  return (
    <div styleName="Tip">
      {
        _.toPairs(errors).map(([url, message]) => (
          <div key={url} styleName="item">
            <div styleName="url">{url}</div>
            <div styleName="message">{message}</div>
            <a styleName="clear" onClick={() => clear(url)} role="button" tabIndex={-1}>&#10799;</a>
          </div>
        ))
      }
    </div>
  );
}

Tip.propTypes = {
  errors: PT.shape().isRequired,
  clear: PT.func.isRequired,
};

function StatusContainer({
  ApiErrors,
  networkErrors,
  clearApiErrorsStatus,
  clearNetworkErrorsStatus }) {
  if (_.isEmpty(ApiErrors) && _.isEmpty(networkErrors)) {
    return null;
  }
  return (
    <div styleName="container">
      {!_.isEmpty(networkErrors) ?
        <Tooltip
          styleName="Tooltip"
          content={<Tip errors={networkErrors} clear={clearNetworkErrorsStatus} />}
        >
          <NetworkErrorIcon />
        </Tooltip>
        : null}
      {!_.isEmpty(ApiErrors) ?
        <Tooltip
          styleName="Tooltip"
          content={<Tip errors={ApiErrors} clear={clearApiErrorsStatus} />}
        >
          <APIErrorIcon />
        </Tooltip>
        : null}
    </div>
  );
}

StatusContainer.propTypes = {
  ApiErrors: PT.shape().isRequired,
  networkErrors: PT.shape().isRequired,
  clearApiErrorsStatus: PT.func.isRequired,
  clearNetworkErrorsStatus: PT.func.isRequired,
};

/**
 * Standard redux function, passes redux state into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Object} state Redux state
 * @return {Object}
 */
const mapStateToProps = state => ({
  ApiErrors: state.status.ApiErrors,
  networkErrors: state.status.networkErrors,
});

/**
 * Standard redux function, passes redux actions into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Function} dispatch Function to dispatch action to reducers
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  clearApiErrorsStatus: url => dispatch(actions.status.clearApiErrorsStatus(url)),
  clearNetworkErrorsStatus: () => dispatch(actions.status.clearNetworkErrorsStatus()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StatusContainer);
