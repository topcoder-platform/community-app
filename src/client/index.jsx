import forge from 'node-forge';

/* Cuts injected data section out from the HTML markup. */
const block = document.querySelector('script[id="inj"]');
document.getElementsByTagName('body')[0].removeChild(block);

/* Receives sensitive data injected by the server. */
let injectedData = forge.util.decode64(window.INJ);
const iv = injectedData.slice(0, 32);
injectedData = injectedData.slice(32);
/* eslint-disable no-undef */
const decipher = forge.cipher.createDecipher('AES-CBC', BUILD_RNDKEY);
/* eslint-enable no-undef */
decipher.start({ iv });
decipher.update(forge.util.createBuffer(injectedData));
decipher.finish();

const data = JSON.parse(forge.util.decodeUtf8(decipher.output.data));

window.CONFIG = data.CONFIG;
window.ISTATE = data.ISTATE;

require('./client');
