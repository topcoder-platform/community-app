// Machine credentials and signing code must remain on the server. The React
// library constructs this factory during browser initialization but only uses
// machine tokens inside its server-side API branch.
module.exports = {
  auth: {
    m2m: () => ({ getMachineToken: () => Promise.reject(new Error('Machine tokens are only available on the server')) }),
  },
};
