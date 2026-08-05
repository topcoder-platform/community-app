/* global document */

/**
 * Creates the hidden iframe used by the accounts authentication connector.
 *
 * @param {String} id Iframe element ID.
 * @param {String} src Connector URL.
 * @return {HTMLIFrameElement} Configured iframe.
 */
function createFrame(id, src) {
  const iframe = document.createElement('iframe');

  iframe.id = id;
  iframe.src = src;
  iframe.width = 0;
  iframe.height = 0;
  iframe.setAttribute('frameborder', '0');

  document.body.appendChild(iframe);

  return iframe;
}

module.exports = { createFrame };
