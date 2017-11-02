/**
 * ErrorAlert Container
 * <ErrorAlert>
 *
 * Description:
 *   Connects the Redux store to the modal ErrorAlert container.
 *   NOTE: This is created and managed by utils/errorAlert and should not
 *   be used directly.
 */
import actions from 'actions/ErrorAlert';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import ErrorAlert from 'components/ErrorAlert';

/**
 * ErrorAlert Container
 */
const ErrorAlertContainer = ({ error, clearError }) => (
  <div>
    { error ?
      <ErrorAlert
        title={error.title}
        details={error.details}
        onOk={() => clearError()}
      /> : undefined }
  </div>
);

/**
 * Default values for Props
 */
ErrorAlertContainer.defaultProps = {
  error: null,
};

/**
 * Prop Validation
 */
ErrorAlertContainer.propTypes = {
  clearError: PT.func.isRequired,
  error: PT.shape({
    title: PT.string.isRequired,
    details: PT.string.isRequired,
  }),
};

/**
 * Standard redux function, passes redux state into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Object} state Redux state
 * @return {Object}
 */
const mapStateToProps = state => ({
  error: state.errorAlert[0],
});

/**
 * Standard redux function, passes redux actions into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Function} dispatch Function to dispatch action to reducers
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  clearError: () => {
    dispatch(actions.errorAlert.clearError());
  },
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorAlertContainer);

export default Container;
