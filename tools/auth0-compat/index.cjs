'use strict';
const { WebAuth } = require('auth0-engine');

// topcoder-react-lib uses only the Auth0 6 constructor/signin callback. Keep that
// interface while letting the current SDK create and verify its state and nonce.
class Auth0Compat {
  constructor(options) {
    this.client = new WebAuth({
      domain: options.domain,
      redirectUri: `${window.location.origin}/community-app-assets/auth0-popup`,
      clientID: options.clientID,
      responseType: 'token id_token',
      scope: 'openid profile email',
    });
  }

  signin(options, callback) {
    this.client.popup.authorize({
      connection: options.connection,
      scope: options.scope || 'openid profile email',
      responseType: 'token id_token',
    }, (error, result) => {
      if (error) return callback(error);
      if (!result || !result.accessToken) return callback(new Error('Missing authentication result'));
      return this.client.client.userInfo(result.accessToken, (profileError, profile) => {
        if (profileError) return callback(profileError);
        if (!profile || !(profile.sub || profile.user_id)) return callback(new Error('Missing user profile'));
        const userId = profile.user_id || profile.sub;
        const normalized = {
          ...profile,
          user_id: userId,
          identities: profile.identities && profile.identities.length ? profile.identities : [{
            connection: options.connection,
            user_id: userId.slice(userId.lastIndexOf('|') + 1),
          }],
        };
        return callback(null, normalized, result.idToken, result.accessToken);
      });
    });
  }
}
Auth0Compat.WebAuth = WebAuth;
module.exports = Auth0Compat;
