/**
 * Connects the Redux store to the Email Verification components
 */
/* eslint-disable */
import _ from "lodash";
import React, { Component } from 'react';
import PT from 'prop-types';
import {connect} from "react-redux";
import { actions } from "topcoder-react-lib";
import { Redirect } from 'react-router';
import {isTokenExpired} from "tc-accounts";
import * as queryString from 'query-string';
import LoadingIndicator from 'components/LoadingIndicator';
import Error404 from 'components/Error404';
import { goToLogin } from 'utils/tc';

import './styles.scss';

const verfiyActions = ['verify', 'reject'];

class EmailVerificationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailVerifyToken: '',
      action: '',
    };
  }

  componentDidMount() {
    this.loadPageData(this.props);

  }

  componentWillReceiveProps(nextProps) {
    this.loadPageData(nextProps);
  }

  loadPageData(props) {
    const {
      tokenV3,
      authenticating,
      location,
    } = props;

    const params = queryString.parse(location.search);
    const action = params.action ? params.action : 'null';
    const token = (params.token && action === 'verify') ? params.token : '';
    this.setState({
      action: action,
      emailVerifyToken: token,
    });

    // Check auth token, go to login page if invalid
    if (authenticating || !tokenV3 || isTokenExpired(tokenV3)) {
      goToLogin('community-app-main');
    }
  }

  onSendVerifyToken() {
    const { handle, tokenV3, verifyMemberNewEmail } = this.props;
    const { emailVerifyToken } = this.state;
    verifyMemberNewEmail(handle, tokenV3, emailVerifyToken);
  }

  render() {
    const { action } = this.state;
    const { verifyingEmail, verifyError, emailChangeResult } = this.props;

    if (verifyError === null) {
      switch (action) {
        case 'reject':
          return (<Redirect to="/settings/account/email-verification/failure" />);
        case 'verify':
          if (!verifyingEmail) {
            this.onSendVerifyToken();
          }
          return (
            <div styleName="outer-container">
              <div styleName="page">
                <div styleName="container">
                  <h1>
                    Email Verification
                  </h1>
                  <div styleName="text">
                    Please wait while we&#39;re verifying your new email
                  </div>
                  <div styleName="loading">
                    <LoadingIndicator/>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          if (action === '') {
            return (<div />);
          } else if (_.findIndex(verfiyActions, item => item === action) < 0) {
            return (<Error404 />)
          }
      }
    } else {
      if (!verifyError) {
        if (emailChangeResult.emailChangeCompleted) {
          return (<Redirect to="/settings/account/email-verification/success" />);
        } else {
          return (
            <Redirect to={{
              pathname: '/settings/account/email-verification/almost-done',
              state: {
                verifiedEmail: emailChangeResult.verifiedEmail,
              }
            }} />
          );
        }
      }
      return (<Redirect to="/settings/account/email-verification/failure" />);
    }
  }
}

EmailVerificationContainer.defaultProps = {
  handle: '',
  tokenV3: '',
  verifyingEmail: false,
  location: null,
  verifyError: null,
  emailChangeResult: {},
};

EmailVerificationContainer.propTypes = {
  handle: PT.string,
  tokenV3: PT.string,
  verifyingEmail: PT.bool,
  verifyMemberNewEmail: PT.func.isRequired,
  location: PT.shape(),
  authenticating: PT.bool.isRequired,
  verifyError: PT.bool,
  emailChangeResult: PT.shape(),
};

function mapStateToProps(state) {
  return {
    authenticating: state.auth.authenticating,
    handle: _.get(state.auth, 'user.handle'),
    tokenV3: state.auth.tokenV3,
    verifyingEmail: state.profile.verifyingEmail,
    verifyError: state.profile.verifyError,
    emailChangeResult: state.profile.emailChangeResult,
  };
}

function mapDispatchToProps(dispatch) {
  const profileActions = actions.profile;

  return {
    verifyMemberNewEmail: (handle, tokenV3, emailVerifyToken) => {
      dispatch(profileActions.verifyMemberNewEmailInit());
      dispatch(profileActions.verifyMemberNewEmailDone(handle, tokenV3, emailVerifyToken));
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmailVerificationContainer);

export default Container;
