/**
 * The loader of Profile webpack chunks.
 */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { config } from 'topcoder-react-utils';
import { connect } from 'react-redux';
import { goToLogin } from 'utils/tc';
import { isTokenExpired } from '@topcoder-platform/tc-auth-lib';
import RedirectExternalUrlPage from '../../components/RedirectExternalUrlPage';

function SettingRedirect(props) {
  const {
    match: {
      params: { settingsTab },
    },
    authenticating,
    tokenV3,
    handle,
  } = props;
  let externalUrl = '';
  if (settingsTab === 'profile' && handle) {
    externalUrl = `${config.MEMBER_PROFILE_REDIRECT_URL}/${handle}`;
  } else if (settingsTab === 'skills' && handle) {
    externalUrl = `${config.MEMBER_PROFILE_REDIRECT_URL}/${handle}/?edit-mode=skills`;
  } else if (settingsTab === 'tracks') {
    externalUrl = `${config.ACCOUNT_SETTINGS_REDIRECT_URL}/#tcandyou`;
  } else if (settingsTab === 'tools') {
    externalUrl = `${config.ACCOUNT_SETTINGS_REDIRECT_URL}/#tools`;
  } else if (settingsTab === 'account') {
    externalUrl = `${config.ACCOUNT_SETTINGS_REDIRECT_URL}/#account`;
  } else if (settingsTab === 'preferences') {
    externalUrl = `${config.ACCOUNT_SETTINGS_REDIRECT_URL}/#preferences`;
  } else if (settingsTab === 'payment') {
    externalUrl = `${config.ACCOUNT_SETTINGS_REDIRECT_URL}/#payment`;
  }

  if (!authenticating && !externalUrl) {
    // Check auth token, go to login page if invalid
    if (!tokenV3 || isTokenExpired(tokenV3)) {
      goToLogin('community-app-main');
      return null;
    }
  }

  return <RedirectExternalUrlPage externalRedirectUrl={externalUrl} />;
}

SettingRedirect.defaultProps = {
  handle: '',
  tokenV3: '',
};

SettingRedirect.propTypes = {
  match: PT.shape({
    params: PT.shape({
      settingsTab: PT.string,
    }),
  }).isRequired,
  authenticating: PT.bool.isRequired,
  handle: PT.string,
  tokenV3: PT.string,
};

function mapStateToProps(state) {
  return {
    authenticating: state.auth.authenticating,
    handle: _.get(state.auth, 'user.handle'),
    tokenV3: state.auth.tokenV3,
  };
}

export default connect(mapStateToProps)(SettingRedirect);
