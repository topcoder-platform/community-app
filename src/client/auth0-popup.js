import Auth0Compat from 'auth0-js';

const options = JSON.parse(document.getElementById('auth0-popup-config').textContent);
const client = new Auth0Compat.WebAuth({ ...options, popupOrigin: window.location.origin });
client.popup.callback();
