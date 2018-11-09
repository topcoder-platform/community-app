/**
 * ErrorMessage Container
 *
 * Description:
 *   Connects the Redux store to the modal ErrorMessageContainer container.
 *   NOTE: This is created and managed by utils/errors and should not
 *   be used directly.
 */
import { actions } from 'topcoder-react-lib';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import ErrorMessage from 'components/ErrorMessage';

function ErrorMessageContainer({ error, clearError }) {
  return (
    <div>
      { error
        ? (
          <ErrorMessage
            title={error.title}
            details={error.details}
            onOk={() => clearError()}
          />
        ) : undefined }
    </div>
  );
}

/**
 * Default values for Props
 */
ErrorMessageContainer.defaultProps = {
  error: null,
};

/**
 * Prop Validation
 */
ErrorMessageContainer.propTypes = {
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
  error: state.errors.alerts[0],
});

/**
 * Standard redux function, passes redux actions into Container as props.
 * Is passed to connect(), not called directly.
 * @param {Function} dispatch Function to dispatch action to reducers
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  clearError: () => {
    dispatch(actions.errors.clearError());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorMessageContainer);
