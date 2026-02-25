/**
 * ErrorMessage Container
 *
 * Description:
 *   Connects the Redux store to the modal ErrorMessageContainer container.
 *   NOTE: This is created and managed by utils/errors and should not
 *   be used directly.
 */
import { actions } from 'topcoder-react-lib';
import { DangerButton, Modal } from 'topcoder-react-ui-kit';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import style from './ErrorMessage.scss';

const WIPRO_REGISTRATION_BLOCKED_MESSAGE = 'Wipro employees are not allowed to participate in this Topcoder challenge';
const WIPRO_REGISTRATION_SUPPORT_MESSAGE = 'If you think this is an error, please contact support@topcoder.com';
const SCROLLING_DISABLED_CLASS_NAME = 'scrolling-disabled-by-modal';

/**
 * Detects if the current error is the Wipro registration blocked popup.
 * @param {Object} error Error payload.
 * @return {Boolean}
 */
function isWiproRegistrationBlockedError(error) {
  const title = error && error.title ? error.title : '';
  return title.trim().toLowerCase() === WIPRO_REGISTRATION_BLOCKED_MESSAGE.toLowerCase();
}

class ErrorMessageContainer extends React.Component {
  componentDidMount() {
    const { error } = this.props;
    if (error) {
      document.body.classList.add(SCROLLING_DISABLED_CLASS_NAME);
    }
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (!prevProps.error && error) {
      document.body.classList.add(SCROLLING_DISABLED_CLASS_NAME);
    }
    if (prevProps.error && !error) {
      document.body.classList.remove(SCROLLING_DISABLED_CLASS_NAME);
    }
  }

  componentWillUnmount() {
    document.body.classList.remove(SCROLLING_DISABLED_CLASS_NAME);
  }

  renderSupportMessage() {
    const { error } = this.props;
    if (isWiproRegistrationBlockedError(error)) {
      return WIPRO_REGISTRATION_SUPPORT_MESSAGE;
    }

    return (
      <React.Fragment>
        We are sorry that you have encountered this problem. Please, contact
        {' '}
        our support
        {' '}
        <a href="mailto:support@topcoder.com">support@topcoder.com</a>
        {' '}
        to help us resolve it as soon as possible.
      </React.Fragment>
    );
  }

  render() {
    const { error, clearError } = this.props;
    const isWiproError = isWiproRegistrationBlockedError(error);

    return (
      <div>
        {error ? (
          <Modal theme={{ container: style.container }}>
            <p styleName="title">{error.title}</p>
            {error.details && !isWiproError ? (
              <p styleName="details">{error.details}</p>
            ) : null}
            <p styleName={isWiproError ? 'details wiproSupport' : 'details'}>
              {this.renderSupportMessage()}
            </p>
            <DangerButton
              onClick={(e) => {
                e.preventDefault();
                clearError();
              }}
            >
              OK
            </DangerButton>
          </Modal>
        ) : undefined}
      </div>
    );
  }
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
    details: PT.string,
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
