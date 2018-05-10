import countries from './countries.json';

// Initialize maps
const codeToCountryObj = {};
const numericStringToCountryObj = {};
const alpha2ToCountryObj = {};
const alpha3ToCountryObj = {};

countries.forEach((obj, index) => {
  codeToCountryObj[obj.code] = index;
  numericStringToCountryObj[obj.numericString] = index;
  alpha2ToCountryObj[obj.alpha2] = index;
  alpha3ToCountryObj[obj.alpha3] = index;
});

export function getCountryObjFromCountryCode(numCode) {
  if (!numCode) {
    return null;
  }
  const idx = codeToCountryObj[numCode.toString()];
  if (idx >= 0) {
    return countries[idx];
  }
  return null;
}

export function getCountryObjFromNumericString(numericString) {
  if (!numericString) {
    return null;
  }
  const idx = numericStringToCountryObj[numericString.toString()];
  if (idx >= 0) {
    return countries[idx];
  }
  return null;
}

export function getCountryObjFromAlpha2(alpha2) {
  if (!alpha2) {
    return null;
  }
  const idx = alpha2ToCountryObj[alpha2.toString()];
  if (idx >= 0) {
    return countries[idx];
  }
  return null;
}

export function getCountryObjFromAlpha3(alpha3) {
  if (!alpha3) {
    return null;
  }
  const idx = alpha3ToCountryObj[alpha3.toString()];
  if (idx >= 0) {
    return countries[idx];
  }
  return null;
}

export function getAllCountryObjects() {
  return countries;
}
