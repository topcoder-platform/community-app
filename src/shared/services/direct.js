/**
 * The Direct service takes care about communication with Direct APIs: projects,
 * billing accounts, copilots, all these stuff should be added here, at least
 * for now.
 */
/* NOTE: We don't want to export getService(..) as default because it will be
 * confusing: most of users would expect that the default export should be an
 * instance of the service class, or the class itself. */
/* eslint-disable import/prefer-default-export */

import qs from 'qs';

import { services } from 'topcoder-react-lib';

const { getApiV3 } = services.api;

class Direct {
  /**
   * Service constructor.
   * @param {String} tokenV3 Optional. Topcoder auth token v3. Though optional,
   *  most probably most, if not all, of the service functionality won't work
   *  for non-authenticated visitors.
   */
  constructor(tokenV3) {
    this.private = {
      api: getApiV3(tokenV3),
      tokenV3,
    };
  }

  /**
   * Gets details of the specified project.
   * @param {Number} projectId
   * @return {Promise} Resolves to the project details object.
   */
  async getProjectDetails(projectId) {
    let res = await this.private.api.get(`/direct/projects/${projectId}`);
    if (!res.ok) throw new Error(res.statusText);
    res = (await res.json()).result;
    if (res.status !== 200) throw new Error(res.content);
    return res.content;
  }

  /**
   * Gets user permissions on the specified project.
   * @param {Number|String} projectId
   * @param {String} tokenV3 Auth token for API v3.
   * @return {Promise} Resolves to the user permissions data.
   */
  async getProjectPermissions(projectId) {
    const URL = `/direct/projects/${projectId}/permissions`;
    let res = await this.private.api.get(URL);
    if (!res.ok) throw new Error(res.statusText);
    res = (await res.json()).result;
    if (res.status !== 200) throw new Error(res.content);
    return res.content;
  }

  /**
   * Gets all projects the user can see.
   * @param {Object} query Optional. Query params for the request.
   * @return {Promise} Resolves to an array of project objects.
   */
  async getUserProjects(query) {
    let url = '/direct/projects/user';
    if (query) url += `?${qs.stringify(query)}`;
    let res = await this.private.api.get(url);
    if (!res.ok) throw new Error(res.statusText);
    res = (await res.json()).result;
    if (res.status !== 200) throw new Error(res.content);
    return res.content;
  }
}

/**
 * Returns a new or existing Direct service.
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @return {Direct} Direct service object.
 */
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || lastInstance.private.tokenV3 !== tokenV3) {
    lastInstance = new Direct(tokenV3);
  }
  return lastInstance;
}
