// UTM cookie configuration constants
const TC_UTM_COOKIE_NAME = 'tc_utm';

/**
 * Retrieves and parses the tc_utm cookie
 * @returns Parsed UTM parameters or null if cookie doesn't exist
 */
export function getUtmCookie() {
  try {
    const cookies = document.cookie.split(';');
    const cookieStr = cookies.find(cookie => cookie.trim().startsWith(`${TC_UTM_COOKIE_NAME}=`));

    if (!cookieStr) {
      return null;
    }

    // handle values that might contain '='
    const cookieValue = decodeURIComponent(cookieStr.split('=').slice(1).join('='));
    return JSON.parse(cookieValue);
  } catch (error) {
    return null;
  }
}

/**
 * Appends UTM parameters from the tc_utm cookie to a given URL
 * Only appends parameters that exist in the cookie
 * @param url - The base URL to append parameters to
 * @returns URL with UTM parameters appended, or original URL if no cookie exists
 */
export function appendUtmParamsToUrl(url, defaultParams = {}) {
  if (!url) {
    return url;
  }

  const utmParams = getUtmCookie();

  // If there are no cookie params and no defaults, nothing to do
  if (
    (!utmParams || Object.keys(utmParams).length === 0) &&
    (!defaultParams || Object.keys(defaultParams).length === 0)
  ) {
    return url;
  }

  try {
    const urlObj = new URL(url, window.location.origin);
    const paramNames = ['utm_source', 'utm_medium', 'utm_campaign'];

    paramNames.forEach((param) => {
      const cookieVal = utmParams && utmParams[param];
      const defaultVal = defaultParams && defaultParams[param];

      // Cookie takes precedence and will overwrite existing query param
      if (cookieVal) {
        urlObj.searchParams.set(param, cookieVal);
      } else if (defaultVal) {
        // Only apply default if the URL does not already have the param
        if (!urlObj.searchParams.has(param)) {
          urlObj.searchParams.set(param, defaultVal);
        }
      }
    });

    return urlObj.toString();
  } catch (error) {
    return url;
  }
}
