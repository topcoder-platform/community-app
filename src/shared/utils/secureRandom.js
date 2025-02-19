const getCryptoLibrary = () => {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  /* eslint-disable global-require */
  const nodeCrypto = require('crypto');
  return nodeCrypto;
};

export default function(min, max) {  
  const crypto = getCryptoLibrary();
  const random = new Uint32Array(1);
  if (typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(random);
  } else if (typeof crypto.randomFillSync === 'function') {
    crypto.randomFillSync(random);
  }

  if (!max) {
    return random[0] % min;
  }

  const range = max - min + 1;
  return min + (random[0] % range);
};
